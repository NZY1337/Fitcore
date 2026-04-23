import * as dotenv from 'dotenv';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // set this in your .env
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER, // send to yourself for testing
    subject: 'Nodemailer Test',
    text: 'This is a test email from Nodemailer!',
}, (err, info) => {
    if (err) {
        return console.error('Error:', err);
    }
    console.log('Email sent:', info.response);
});
