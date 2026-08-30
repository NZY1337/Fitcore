import { Injectable, MessageEvent, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationsService {
    private streams = new Map<string, Subject<MessageEvent>>();

    private push(userId: string, notification: Notification) {
        this.streams.get(userId)?.next({ data: notification });
    }

    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>
    ) { }

    async create(userId: string, createNotificationDto: CreateNotificationDto) {
        const notification = this.notificationRepository.create({ ...createNotificationDto, user_id: userId });
        const saved = await this.notificationRepository.save(notification);
        this.push(userId, saved);
        return saved;
    }

    getStream(userId: string): Observable<MessageEvent> {
        if (!this.streams.has(userId)) {
            this.streams.set(userId, new Subject<MessageEvent>());
        }

        return this.streams.get(userId)!.asObservable();
    }

    findAll(userId: string) {
        return this.notificationRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }

    async markAsRead(userId: string, id: string) {
        const notification = await this.notificationRepository.findOne({ where: { id, user_id: userId } });
        if (!notification) throw new NotFoundException('Notification not found');
        notification.is_read = true;
        return this.notificationRepository.save(notification);
    }

    async remove(userId: string, id: string) {
        const notification = await this.notificationRepository.findOne({ where: { id, user_id: userId } });
        if (!notification) throw new NotFoundException('Notification not found');
        return this.notificationRepository.delete(id);
    }
}
