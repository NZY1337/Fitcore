import { Injectable } from "@nestjs/common";
import nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
    private readonly transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    })

    async sendMail() {
        this.transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: 'mandreicosmin@yahoo.com', // send to yourself for testing
            subject: 'Nu ai logat astazi zilele nimic in calendar',
            text: 'Hello, noi suntem Fitforge. This is a test message',
        }, (err: Error | null, info: any) => {
            if (err) {
                return console.error('Error:', err);
            }
            console.log('Email sent:', info.response);
        });
    }
}
