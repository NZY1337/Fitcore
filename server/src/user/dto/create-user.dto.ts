import { Plan } from '../../utils/constants';

export class CreateUserDto {
    id: string;
    email: string;
    plan?: Plan;
}