import { body } from 'express-validator';

export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  body('role')
    .optional()
    .isIn(['seeker', 'referrer'])
    .withMessage("Role must be 'seeker' or 'referrer'."),
  body().custom((value, { req }) => {
    const name = req.body.name || req.body.fullName;
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Full name is required.');
    }
    return true;
  }),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

export const validateJobCreate = [
  body('title').trim().notEmpty().withMessage('Job title is required.'),
  body('company').trim().notEmpty().withMessage('Company name is required.'),
  body('location').trim().notEmpty().withMessage('Job location is required.'),
  body('description').trim().notEmpty().withMessage('Job description is required.'),
];

export const validateReferralCreate = [
  body('jobId').notEmpty().withMessage('Job ID is required.'),
  body('referrerId').notEmpty().withMessage('Referrer ID is required.'),
  body().custom((value, { req }) => {
    const note = req.body.note || req.body.customNote;
    if (!note || typeof note !== 'string' || !note.trim()) {
      throw new Error('Introductory note is required.');
    }
    return true;
  }),
];

export const validateApplicationCreate = [
  body('jobId').notEmpty().withMessage('Job ID is required.'),
];

export const validateMessageCreate = [
  body('conversationId').notEmpty().withMessage('Conversation ID is required.'),
  body('content').trim().notEmpty().withMessage('Message text is required.'),
];

export const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long.'),
];
