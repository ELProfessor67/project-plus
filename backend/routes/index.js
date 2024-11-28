import express from 'express';
const router = express.Router();
import userRouter from './user.js';
import projectRouter from './project.js';
import taskRouter from './task.js';
import notificationRouter from './notification.js';

router.use('/user',userRouter);
router.use('/project',projectRouter);
router.use('/task',taskRouter);
router.use('/notificaion',notificationRouter);



export default router;