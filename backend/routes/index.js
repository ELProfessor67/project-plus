import express from 'express';
const router = express.Router();
import userRouter from './userRoute.js';
import projectRouter from './projectRoute.js';
import taskRouter from './taskRoute.js';
import notificationRouter from './notificationRoute.js';
import chatRouter from './chatRoute.js';
import meetingRoute from './meetingRoute.js'
import mediaRoute from './mediaRoute.js'

router.use('/user',userRouter);
router.use('/project',projectRouter);
router.use('/task',taskRouter);
router.use('/notificaion',notificationRouter);
router.use('/chat',chatRouter);
router.use('/meeting',meetingRoute);
router.use('/media',mediaRoute);



export default router;