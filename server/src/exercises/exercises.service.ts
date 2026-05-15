import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const BASE_URL = 'https://api.workoutxapp.com/v1';

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

@Injectable()
export class ExercisesService {
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
        const body = await this.fetch<{ total: number; data: Exercise[] }>(`${path}${sep}limit=${limit}&offset=${offset}`);
        return { total: body.total, data: body.data ?? [] };
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

    getById(id: string): Promise<Exercise> {
        return this.fetch<Exercise>(`/exercises/exercise/${id}`);
    }

    async getSimilar(id: string): Promise<Exercise[]> {
        const result = await this.paginated(`/exercises/${id}/similar`, 10, 0);
        return result.data;
    }

    async getGif(id: string): Promise<Buffer> {
        const res = await fetch(`${BASE_URL}/gifs/${id}.gif`, { headers: this.headers });
        if (!res.ok) throw new InternalServerErrorException(`GIF not found: ${id}`);
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}
