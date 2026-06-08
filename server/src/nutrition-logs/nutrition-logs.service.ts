import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NutritionLog } from './entities/nutrition-log.entity';
import { CreateNutritionLogDto } from './dto/create-nutrition-log.dto';
import { UpdateNutritionLogDto } from './dto/update-nutrition-log.dto';

@Injectable()
export class NutritionLogsService {
    constructor(
        @InjectRepository(NutritionLog) private repo: Repository<NutritionLog>,
        private eventEmitter: EventEmitter2,
    ) { }

    async create(userId: string, dto: CreateNutritionLogDto): Promise<NutritionLog> {
        const log = this.repo.create({
            user_id: userId,
            food_item: dto.food_item,
            meal_type: dto.meal_type ?? null,
            calories: dto.calories,
            protein_g: dto.protein_g ?? 0,
            carbs_g: dto.carbs_g ?? 0,
            fat_g: dto.fat_g ?? 0,
            serving_g: dto.serving_g ?? null,
            note: dto.note ?? null,
            ...(dto.logged_at ? { logged_at: new Date(dto.logged_at) } : {}),
        });

        const saved = await this.repo.save(log);

        // emit nutrition.created event
        this.eventEmitter.emit('nutrition.created', { userId, foodItem: dto.food_item });
        return saved;
    }

    findAll(userId: string, date?: string): Promise<NutritionLog[]> {
        if (date) {
            const start = new Date(date);
            start.setUTCHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setUTCHours(23, 59, 59, 999);
            return this.repo.find({
                where: { user_id: userId, logged_at: Between(start, end) },
                order: { logged_at: 'ASC' },
            });
        }

        return this.repo.find({
            where: { user_id: userId },
            order: { logged_at: 'ASC' },
        });
    }

    async update(userId: string, id: string, dto: UpdateNutritionLogDto): Promise<NutritionLog> {
        const log = await this.repo.findOneBy({ id, user_id: userId });
        if (!log) throw new NotFoundException('Nutrition log not found');

        if (dto.food_item !== undefined) log.food_item = dto.food_item;
        if (dto.meal_type !== undefined) log.meal_type = dto.meal_type ?? null;
        if (dto.calories !== undefined) log.calories = dto.calories;
        if (dto.protein_g !== undefined) log.protein_g = dto.protein_g;
        if (dto.carbs_g !== undefined) log.carbs_g = dto.carbs_g;
        if (dto.fat_g !== undefined) log.fat_g = dto.fat_g;
        if (dto.serving_g !== undefined) log.serving_g = dto.serving_g ?? null;
        if (dto.note !== undefined) log.note = dto.note ?? null;
        if (dto.logged_at !== undefined) log.logged_at = new Date(dto.logged_at);

        // emit nutrition.evidet event
        this.eventEmitter.emit('nutrition.edited', { userId, foodItem: dto.food_item });
        return this.repo.save(log);
    }

    async remove(userId: string, id: string): Promise<void> {
        const log = await this.repo.findOneBy({ id, user_id: userId });
        if (!log) throw new NotFoundException('Nutrition log not found');
        await this.repo.remove(log);

        this.eventEmitter.emit('nutrition.removed', { userId, foodItem: log.food_item })
    }
}
