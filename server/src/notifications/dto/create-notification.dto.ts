import { IsString, IsIn } from 'class-validator';
import { type NotificationType } from '../../utils/constants';

export class CreateNotificationDto {
    @IsString()
    @IsIn(['info', 'warning', 'error'])
    type: NotificationType;

    @IsString()
    message: string;
}

