import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createToken, twilioVoice } from '../controllers/twilioController.js';

const router = express.Router();

router.route('/token').post(authMiddleware,createToken);
router.route('/voice').post(twilioVoice);

export default router;