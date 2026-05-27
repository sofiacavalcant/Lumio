import { Router } from 'express';
import { chat, resetarChat } from '../controllers/gemini.controller.js';

const router = Router();

router.post('/chat', chat);
router.delete('/chat', resetarChat);

export default router;
