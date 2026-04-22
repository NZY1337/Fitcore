import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeightLog } from './entities/weight-log.entity';
import { CreateWeightLogDto } from './dto/create-weight-log.dto';

@Injectable()
export class WeightLogsService {
    constructor(
        @InjectRepository(WeightLog) private repo: Repository<WeightLog>,
    ) { }

    create(userId: string, dto: CreateWeightLogDto): Promise<WeightLog> {
        const log = this.repo.create({
            user_id: userId,
            weight_kg: dto.weight_kg,
            note: dto.note ?? null,
            ...(dto.measured_at ? { measured_at: new Date(dto.measured_at) } : {}),
        });
        return this.repo.save(log);
    }

    findAll(userId: string): Promise<WeightLog[]> {
        return this.repo.find({
            where: { user_id: userId },
            order: { measured_at: 'ASC' },
        });
    }

    async remove(userId: string, id: string): Promise<void> {
        const log = await this.repo.findOneBy({ id, user_id: userId });
        if (!log) throw new NotFoundException('Weight log not found');
        await this.repo.remove(log);
    }
}
