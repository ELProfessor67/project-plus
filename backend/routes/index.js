import express from 'express';
const router = express.Router();
import userRouter from './userRoute.js';
import projectRouter from './projectRoute.js';
import taskRouter from './taskRoute.js';
import notificationRouter from './notificationRoute.js';
import chatRouter from './chatRoute.js';
import meetingRoute from './meetingRoute.js'
import mediaRoute from './mediaRoute.js'
import twilioRoute from './twilioRoute.js'
import clientRoute from './clientRoute.js'

router.use('/user',userRouter);
router.use('/project',projectRouter);
router.use('/task',taskRouter);
router.use('/notificaion',notificationRouter);
router.use('/chat',chatRouter);
router.use('/meeting',meetingRoute);
router.use('/media',mediaRoute);
router.use('/twilio',twilioRoute);
router.use('/client',clientRoute);



export default router;