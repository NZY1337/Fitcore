import { Global, Module } from '@nestjs/common';
import { TaskService } from './taskservice.service';
import { NodemailerService } from '../nodemailer/nodemailer.service';

// This modul has to send mails to the clients that have not logged anything in foodLogs, and trainingLogs
@Global()
@Module({
    providers: [TaskService, NodemailerService],
    exports: [TaskService],
})

export class TaskServiceModule { }