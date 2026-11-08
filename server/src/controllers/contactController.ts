import { Request, Response, NextFunction } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { sendSuccess, sendError } from '../utils/response';
import { sendEmail } from '../utils/email';

export const submitContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      sendError(res, 400, 'Please provide name, email, subject, and message content.');
      return;
    }

    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      status: 'unread',
    });

    await sendEmail({
      to: email,
      subject: `Referly Support: We received your inquiry regarding "${subject}"`,
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for contacting Referly Support. We have received your inquiry and our team will review it within 12 hours.</p>
        <p><strong>Your Inquiry:</strong> ${message}</p>
      `,
    });

    sendSuccess(
      res,
      201,
      'Your inquiry has been received. Our team will contact you shortly.',
      contact
    );
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    sendSuccess(res, 200, 'Contact inquiries retrieved.', messages);
  } catch (error) {
    next(error);
  }
};
