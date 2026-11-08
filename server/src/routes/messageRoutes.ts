import { Router } from 'express';
import {
  getConversations,
  getMessagesByConversation,
  sendMessage,
  startConversation,
} from '../controllers/messageController';
import { authenticateUser } from '../middleware/auth';
import { validateMessageCreate } from '../validators';
import { validateRequest } from '../middleware/validate';

const router = Router();

router.get('/conversations', authenticateUser, getConversations);
router.post('/conversations', authenticateUser, startConversation);
router.get('/conversations/:conversationId/messages', authenticateUser, getMessagesByConversation);
router.post('/send', authenticateUser, validateMessageCreate, validateRequest, sendMessage);

export default router;
