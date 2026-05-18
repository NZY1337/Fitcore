import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://api.workoutxapp.com/v1';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours — exercise data is stable
const CACHE_FILE = join(process.cwd(), '.cache', 'exercises.json');

export interface Exercise {
    id: string;
    name: string;
    bodyPart: string;
    target: string;
    equipment: string;
    gifUrl: string;
    difficulty?: string;
    instructions?: string[];
    secondaryMuscles?: string[];
}

export interface PaginatedExercises {
    total: number;
    data: Exercise[];
}

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

// LRU cache: evicts the least-recently-used entry when maxSize is reached.
// Map insertion/deletion order is used to track recency — O(1) get and set.
class LruCache {
    private readonly store = new Map<string, CacheEntry<unknown>>();

    constructor(private readonly maxSize: number) {}

    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        // Refresh recency: move to end
        this.store.delete(key);
        this.store.set(key, entry);
        return entry.data as T;
    }

    set<T>(key: string, data: T, ttlMs: number): void {
        if (this.store.has(key)) {
            this.store.delete(key);
        } else if (this.store.size >= this.maxSize) {
            // Evict LRU entry (first key in insertion order)
            this.store.delete(this.store.keys().next().value as string);
        }
        this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
    }

    entries(): IterableIterator<[string, CacheEntry<unknown>]> {
        return this.store.entries();
    }

    load(key: string, entry: CacheEntry<unknown>): void {
        this.store.set(key, entry);
    }

    get size() { return this.store.size; }
}

@Injectable()
export class ExercisesService {
    private readonly logger = new Logger(ExercisesService.name);
    private readonly cache = new LruCache(500);
    private readonly inflight = new Map<string, Promise<unknown>>();
    private readonly apiKey: string;
    private persistTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(private readonly config: ConfigService) {
        this.apiKey = this.config.get<string>('WORKOUTX_API_KEY') ?? '';
        this.loadFromDisk();
    }

    // ── Disk persistence ──────────────────────────────────────────────────────

    private loadFromDisk(): void {
        if (!existsSync(CACHE_FILE)) return;
        try {
            const raw = JSON.parse(readFileSync(CACHE_FILE, 'utf8')) as Record<string, CacheEntry<unknown>>;
            const now = Date.now();
            let loaded = 0;
            for (const [key, entry] of Object.entries(raw)) {
                if (entry.expiresAt > now) {
                    this.cache.load(key, entry);
                    loaded++;
                }
            }
            this.logger.log(`Loaded ${loaded} non-expired entries from disk cache`);
        } catch {
            this.logger.warn('Could not read disk cache — starting fresh');
        }
    }

    // Debounced: coalesces rapid writes into a single flush 10s later
    private schedulePersist(): void {
        if (this.persistTimer) return;
        this.persistTimer = setTimeout(() => {
            this.persistTimer = null;
            this.flushToDisk();
        }, 10_000);
    }

    private flushToDisk(): void {
        try {
            mkdirSync(join(process.cwd(), '.cache'), { recursive: true });
            const snapshot: Record<string, CacheEntry<unknown>> = {};
            for (const [key, entry] of this.cache.entries()) {
                snapshot[key] = entry;
            }
            writeFileSync(CACHE_FILE, JSON.stringify(snapshot));
            this.logger.debug(`Flushed ${Object.keys(snapshot).length} entries to disk cache`);
        } catch (e) {
            this.logger.warn(`Could not write disk cache: ${(e as Error).message}`);
        }
    }

    // ── Core helpers ──────────────────────────────────────────────────────────

    private get headers(): Record<string, string> {
        return { 'X-WorkoutX-Key': this.apiKey };
    }

    private async fetch<T>(path: string): Promise<T> {
        const res = await fetch(`${BASE_URL}${path}`, { headers: this.headers });
        if (!res.ok) {
            throw new InternalServerErrorException(`WorkoutX API error: ${res.status}`);
        }
        return res.json();
    }

    // Deduplicates concurrent requests for the same key so WorkoutX is called
    // exactly once even when many users trigger the same cache miss simultaneously.
    private dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
        if (this.inflight.has(key)) return this.inflight.get(key) as Promise<T>;
        const promise = fn().finally(() => this.inflight.delete(key));
        this.inflight.set(key, promise);
        return promise;
    }

    private cacheSet<T>(key: string, data: T): void {
        this.cache.set(key, data, TTL_MS);
        this.schedulePersist();
    }

    private async paginated(path: string, limit: number, offset: number): Promise<PaginatedExercises> {
        const sep = path.includes('?') ? '&' : '?';
        const cacheKey = `${path}:${limit}:${offset}`;

        const cached = this.cache.get<PaginatedExercises>(cacheKey);
        if (cached) {
            this.logger.debug(`Cache hit — ${cacheKey}`);
            return cached;
        }

        return this.dedupe(cacheKey, async () => {
            const body = await this.fetch<{ total: number; data: Exercise[] }>(`${path}${sep}limit=${limit}&offset=${offset}`);
            const result: PaginatedExercises = { total: body.total, data: body.data ?? [] };
            this.cacheSet(cacheKey, result);
            this.logger.debug(`Cache miss — fetched and stored (cache size: ${this.cache.size})`);
            return result;
        });
    }

    // ── Public API ────────────────────────────────────────────────────────────

    getAll(limit = 10, offset = 0): Promise<PaginatedExercises> {
        return this.paginated(`/exercises`, limit, offset);
    }

    search(name: string, limit = 10, offset = 0): Promise<PaginatedExercises> {
        return this.paginated(`/exercises/name/${encodeURIComponent(name)}`, limit, offset);
    }

    getByBodyPart(bodyPart: string, limit = 10, offset = 0): Promise<PaginatedExercises> {
        return this.paginated(`/exercises/bodyPart/${encodeURIComponent(bodyPart)}`, limit, offset);
    }

    getByEquipment(equipment: string, limit = 10, offset = 0): Promise<PaginatedExercises> {
        return this.paginated(`/exercises/equipment/${encodeURIComponent(equipment)}`, limit, offset);
    }

    getById(id: string): Promise<Exercise> {
        const cacheKey = `exercise:${id}`;
        const cached = this.cache.get<Exercise>(cacheKey);
        if (cached) return Promise.resolve(cached);

        return this.dedupe(cacheKey, async () => {
            const data = await this.fetch<Exercise>(`/exercises/exercise/${id}`);
            this.cacheSet(cacheKey, data);
            return data;
        });
    }

    getSimilar(id: string): Promise<Exercise[]> {
        const cacheKey = `similar:${id}`;
        const cached = this.cache.get<Exercise[]>(cacheKey);
        if (cached) return Promise.resolve(cached);

        return this.dedupe(cacheKey, async () => {
            const result = await this.paginated(`/exercises/${id}/similar`, 10, 0);
            this.cacheSet(cacheKey, result.data);
            return result.data;
        });
    }

    getGif(id: string): Promise<Buffer> {
        return this.dedupe(`gif:${id}`, async () => {
            const res = await fetch(`${BASE_URL}/gifs/${id}.gif`, { headers: this.headers });
            if (!res.ok) throw new InternalServerErrorException(`GIF not found: ${id}`);
            return Buffer.from(await res.arrayBuffer());
        });
    }
}
