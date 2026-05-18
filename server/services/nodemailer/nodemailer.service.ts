import { Injectable } from "@nestjs/common";
import nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class NodemailerService {
    private readonly transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    })

    async sendWelcomeEmail(to: string, name: string) {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .header h1 { margin: 0; font-size: 32px; }
                    .logo { width: 60px; height: 60px; margin-bottom: 15px; }
                    .content { background: white; padding: 30px 20px; }
                    .content h2 { color: #667eea; font-size: 24px; margin-top: 0; }
                    .content p { margin: 15px 0; color: #555; }
                    .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .features { margin: 30px 0; }
                    .feature-item { margin: 15px 0; display: flex; align-items: center; }
                    .feature-icon { width: 30px; height: 30px; background: #667eea; color: white; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 15px; }
                    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
                    .footer-links { margin: 10px 0; }
                    .footer-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <!-- Option 1: CID embedded image (uncomment if you have logo.png) -->
                        <!-- <img src="cid:fitcoreLogo" alt="Fitcore Logo" class="logo"> -->

                        <!-- Option 2: External URL (simpler) -->
                        <img src="https://via.placeholder.com/60?text=Fitcore" alt="Fitcore Logo" class="logo">

                        <h1>Welcome to Fitcore!</h1>
                    </div>

                    <div class="content">
                        <h2>Hi ${name},</h2>
                        <p>We're thrilled to have you join the Fitcore community! 🎉</p>

                        <p>Get started with your fitness journey and unlock amazing features:</p>

                        <div class="features">
                            <div class="feature-item">
                                <div class="feature-icon">💪</div>
                                <div>AI-Powered Workout Plans personalized just for you</div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🍎</div>
                                <div>Smart Nutrition Tracking to meet your health goals</div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">📊</div>
                                <div>Real-time Progress Analytics and insights</div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🎯</div>
                                <div>Customizable Fitness Plans tailored to your needs</div>
                            </div>
                        </div>

                        <p>Let's get you started! Complete your profile and create your first workout:</p>
                        <a href="${process.env.APP_URL || 'https://fitcore.app'}/onboarding" class="cta-button">Complete Your Profile</a>

                        <p style="color: #999; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                            If you have any questions, reach out to our support team at support@fitcore.com
                        </p>
                    </div>

                    <div class="footer">
                        <p>© 2026 Fitcore. All rights reserved.</p>
                        <div class="footer-links">
                            <a href="https://fitcore.app">Website</a>
                            <a href="https://fitcore.app/help">Help Center</a>
                            <a href="https://fitcore.app/privacy">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(
                {
                    from: process.env.GMAIL_USERNAME,
                    to,
                    subject: 'Welcome to Fitcore! 🎯',
                    html: htmlTemplate,
                    text: `Welcome ${name} to Fitcore!`, // fallback for email clients that don't support HTML
                    // OPTION 1: Embed image as attachment (use CID reference in HTML)
                    // attachments: [
                    //     {
                    //         filename: 'logo.png',
                    //         path: path.join(__dirname, '../../assets/logo.png'), // path to your image
                    //         cid: 'fitcoreLogo' // referenced in HTML as src="cid:fitcoreLogo"
                    //     }
                    // ]
                },
                (err: Error | null, info: any) => {
                    if (err) {
                        console.error('Error sending email:', err);
                        reject(err);
                    } else {
                        console.log('Welcome email sent:', info.response);
                        resolve(info);
                    }
                }
            );
        });
    }

    async sendMail(recipients: string[] = ['mandreicosmin@yahoo.com']) {
        this.transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: recipients.join(', '),
            subject: 'Nu ai logat astazi zilele nimic in calendar',
            text: 'Hello, noi suntem Fitforge. This is a test message',
        }, (err: Error | null, info: any) => {
            if (err) {
                return console.error('Error:', err);
            }
            console.log('Email sent:', info.response);
        });
    }

    async sendMailToMany(recipients: string[], subject: string, text: string) {
        this.transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: recipients.join(', '),
            subject,
            text,
        }, (err: Error | null, info: any) => {
            if (err) {
                return console.error('Error:', err);
            }
            console.log('Email sent:', info.response);
        });
    }
}
