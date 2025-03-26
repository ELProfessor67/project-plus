import express from "express";
import {authMiddleware} from '../middlewares/authMiddleware.js'
import { createClientMeeting, createMeeting, getMeetingBYId, getMeetings, handleConfirm, handleVoting } from "../controllers/meetingController.js";


const router = express.Router();

router.route('/create').post(authMiddleware,createMeeting);
router.route('/create/client').post(authMiddleware,createClientMeeting);
router.route('/vote/:meeting_id').get(handleVoting);
router.route('/confirm/:meeting_id').get(handleConfirm);
router.route('/get').get(authMiddleware,getMeetings);
router.route('/get/:meeting_id').get(authMiddleware,getMeetingBYId);


export default router;
