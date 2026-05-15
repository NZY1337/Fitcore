import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const BASE_URL = 'https://api.workoutxapp.com/v1';
const TTL_MS = 60 * 60 * 1000; // 1 hour

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

class MemoryCache {
    private readonly store = new Map<string, CacheEntry<unknown>>();

    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.data as T;
    }

    set<T>(key: string, data: T, ttlMs: number): void {
        this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
    }

    get size() { return this.store.size; }
}

@Injectable()
export class ExercisesService {
    private readonly logger = new Logger(ExercisesService.name);
    private readonly cache = new MemoryCache();
    private readonly apiKey: string;

    constructor(private readonly config: ConfigService) {
        this.apiKey = this.config.get<string>('WORKOUTX_API_KEY') ?? '';
    }

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

    private async paginated(path: string, limit: number, offset: number): Promise<PaginatedExercises> {
        const sep = path.includes('?') ? '&' : '?';
        const cacheKey = `${path}:${limit}:${offset}`;

        const cached = this.cache.get<PaginatedExercises>(cacheKey);
        if (cached) {
            this.logger.debug(`Cache hit — ${cacheKey}`);
            return cached;
        }

        const body = await this.fetch<{ total: number; data: Exercise[] }>(`${path}${sep}limit=${limit}&offset=${offset}`);
        const result: PaginatedExercises = { total: body.total, data: body.data ?? [] };

        this.cache.set(cacheKey, result, TTL_MS);
        this.logger.debug(`Cache miss — fetched and stored (cache size: ${this.cache.size})`);
        return result;
    }

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

    async getById(id: string): Promise<Exercise> {
        const cacheKey = `exercise:${id}`;
        const cached = this.cache.get<Exercise>(cacheKey);
        if (cached) return cached;

        const data = await this.fetch<Exercise>(`/exercises/exercise/${id}`);
        this.cache.set(cacheKey, data, TTL_MS);
        return data;
    }

    async getSimilar(id: string): Promise<Exercise[]> {
        const cacheKey = `similar:${id}`;
        const cached = this.cache.get<Exercise[]>(cacheKey);
        if (cached) return cached;

        const result = await this.paginated(`/exercises/${id}/similar`, 10, 0);
        this.cache.set(cacheKey, result.data, TTL_MS);
        return result.data;
    }

    async getGif(id: string): Promise<Buffer> {
        const cacheKey = `gif:${id}`;
        const cached = this.cache.get<Buffer>(cacheKey);
        if (cached) return cached;

        const res = await fetch(`${BASE_URL}/gifs/${id}.gif`, { headers: this.headers });
        if (!res.ok) throw new InternalServerErrorException(`GIF not found: ${id}`);
        const buffer = Buffer.from(await res.arrayBuffer());

        this.cache.set(cacheKey, buffer, TTL_MS);
        return buffer;
    }
}
