import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../utils/constants';

@Injectable()
export class NotificationsListener {
    constructor(private readonly notificationsService: NotificationsService) { }

    // NUTRITION EVENT
    // every notifService.create triggers an @SSE event (this.push)
    @OnEvent('nutrition.created')
    handleNutritionCreated(payload: { userId: string; foodItem: NotificationType }) {
        this.notificationsService.create(payload.userId, {
            type: 'info',
            message: `Ai adăugat ${payload.foodItem} în jurnal.`,
        });
    }

    @OnEvent('nutrition.edited')
    handleNutritionEdited(payload: { userId: string; foodItem: NotificationType }) {
        this.notificationsService.create(payload.userId, {
            type: 'warning',
            message: `Ai editat ${payload.foodItem} în jurnal`
        })
    }

    @OnEvent('nutrition.removed')
    handleNutritionRemoved(payload: { userId: string; foodItem: NotificationType }) {
        this.notificationsService.create(payload.userId, {
            type: 'warning',
            message: `Ai sters ${payload.foodItem} în jurnal`
        })
    }

    // AI PLAN EVENT

}
