import { Injectable, Logger, } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { DataSource } from 'typeorm';

// https://docs.nestjs.com/techniques/task-scheduling 

@Injectable()
export class TaskService {
    constructor(
        private readonly nodemailer: NodemailerService,
        private readonly dataSource: DataSource
    ) { }

    private readonly logger = new Logger(TaskService.name);

    @Cron(CronExpression.EVERY_5_SECONDS, {
        name: 'notifications',
        timeZone: 'Europe/Bucharest',
    })

    async handleCron() {
        // SELECT * FROM "nutrition_logs" WHERE "logged_at":: date = '2026-04-20 07:30:00';

        this.logger.debug('Called when the current second is 5');
        const data = await this.dataSource.query(`
            SELECT users.email, users.id FROM users
            LEFT JOIN nutrition_logs 
                ON users.id::uuid = nutrition_logs.user_id
                AND nutrition_logs.logged_at::date = DATE(NOW())
            WHERE nutrition_logs.user_id IS NULL;
        `)

        if (!!data.length) {
            // this.nodemailer.sendMail(data);
        } else {
            this.logger.error('user has no data logged')
            console.log('no entries found')
        }
    }
}



