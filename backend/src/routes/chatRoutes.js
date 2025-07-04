import express from 'express';
import {
  getChatHistory,
  getChatList,
  markMessagesAsSeen,
  searchUsers
} from '../controllers/chatController.js';

import { verifyToken } from '../middleware/authMiddleware.js'; // ✅ renamed

const router = express.Router();

// ✅ Protected routes using updated verifyToken
router.get('/messages/:username', verifyToken, getChatHistory);
router.get('/chats', verifyToken, getChatList);
router.patch('/messages/mark-seen', verifyToken, markMessagesAsSeen);
router.get('/users/search', verifyToken, searchUsers);

export default router;
