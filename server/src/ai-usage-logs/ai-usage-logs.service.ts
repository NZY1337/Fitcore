import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiUsageLog } from './entities/ai-usage-log.entity';

const MODEL_COSTS: Record<string, { input: number; output: number }> = {
    'gpt-4o':      { input: 2.50, output: 10.00 },
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
};

@Injectable()
export class AiUsageLogsService {
    constructor(
        @InjectRepository(AiUsageLog)
        private readonly repo: Repository<AiUsageLog>,
    ) {}

    async log(data: {
        user_id: string;
        model: string;
        type: 'meal_plan' | 'workout_plan';
        prompt_tokens: number;
        completion_tokens: number;
    }): Promise<void> {
        const modelKey = Object.keys(MODEL_COSTS).find(k => data.model.startsWith(k)) ?? '';
        const rates = MODEL_COSTS[modelKey] ?? { input: 0, output: 0 };
        const cost_usd =
            (data.prompt_tokens / 1_000_000) * rates.input +
            (data.completion_tokens / 1_000_000) * rates.output;

        await this.repo.save(this.repo.create({ ...data, cost_usd }));
    }

    async getAdminStats() {
        return this.repo
            .createQueryBuilder('log')
            .select("TO_CHAR(DATE(log.created_at), 'YYYY-MM-DD')", 'date')
            .addSelect('COUNT(*)', 'requests')
            .addSelect('SUM(log.prompt_tokens)', 'prompt_tokens')
            .addSelect('SUM(log.completion_tokens)', 'completion_tokens')
            .addSelect('ROUND(SUM(log.cost_usd)::numeric, 6)', 'total_cost_usd')
            .groupBy('DATE(log.created_at)')
            .orderBy('date', 'DESC')
            .getRawMany();
    }

    async getAdminStatsByUser() {
        return this.repo
            .createQueryBuilder('log')
            .innerJoin('users', 'u', 'u.id::text = log.user_id')
            .select('u.id', 'user_id')
            .addSelect('u.email', 'email')
            .addSelect('COUNT(*)', 'requests')
            .addSelect('SUM(log.prompt_tokens)', 'prompt_tokens')
            .addSelect('SUM(log.completion_tokens)', 'completion_tokens')
            .addSelect('ROUND(SUM(log.cost_usd)::numeric, 6)', 'total_cost_usd')
            .groupBy('u.id')
            .addGroupBy('u.email')
            .orderBy('total_cost_usd', 'DESC')
            .getRawMany();
    }
}
