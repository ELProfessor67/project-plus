import express from "express";
import {authMiddleware} from '../middlewares/authMiddleware.js'
import {  getChatsUser, getConversationID, getConversations, getConversationUsers} from "../controllers/chatController.js";


const router = express.Router();
router.route('/get-conversation-id').post(authMiddleware,getConversationID);
router.route('/get-conversations/:conversation_id').get(authMiddleware,getConversations);
router.route('/get-users/').get(authMiddleware,getChatsUser);
router.route('/get-conversation-users/').get(authMiddleware,getConversationUsers);

export default router;
