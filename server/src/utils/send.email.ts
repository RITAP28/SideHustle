import nodemailer from "nodemailer";

interface options {
    to: string;
    subject: string;
    text: string;
};

export const sendEmail = async (options: options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.to,
        subject: options.subject,
        text: options.text
    };

    await transporter.sendMail(mailOptions);
};