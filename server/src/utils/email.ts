import nodemailer from 'nodemailer';
import { ENV } from '../config/environment';

let transporter: nodemailer.Transporter | null = null;

if (ENV.SMTP_HOST && ENV.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASSWORD,
    },
  });
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> => {
  try {
    if (!transporter) {
      console.log(`[Email Mock Dispatch] To: ${to} | Subject: "${subject}"`);
      return true;
    }

    await transporter.sendMail({
      from: `"Referly Support" <${ENV.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error: any) {
    console.error('[Email Dispatch Error]', error.message);
    return false;
  }
};
