import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../utils/constants';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) { }

    async upsertUser(user: CreateUserDto) {
        await this.repo.upsert({ id: user.id, email: user.email }, ['id']);
    }

    findById(id: string): Promise<UserEntity | null> {
        return this.repo.findOneBy({ id });
    }

    findAll(): Promise<UserEntity[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async updateRole(id: string, role: Role): Promise<UserEntity> {
        await this.repo.update({ id }, { role });
        return this.repo.findOneByOrFail({ id });
    }

    async getStats(): Promise<{
        totalUsers: number;
        adminCount: number;
        userCount: number;
        newLast7Days: number;
        newLast30Days: number;
    }> {
        const now = new Date();
        const minus7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const minus30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [totalUsers, adminCount, newLast7Days, newLast30Days] = await Promise.all([
            this.repo.count(),
            this.repo.count({ where: { role: Role.ADMIN } }),
            this.repo.createQueryBuilder('u').where('u.createdAt >= :d', { d: minus7 }).getCount(),
            this.repo.createQueryBuilder('u').where('u.createdAt >= :d', { d: minus30 }).getCount(),
        ]);

        return { totalUsers, adminCount, userCount: totalUsers - adminCount, newLast7Days, newLast30Days };
    }
}
