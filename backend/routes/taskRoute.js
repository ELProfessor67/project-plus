import express from "express";
import {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask,
    addMembersToTask,
    addTranscibtion,
    getTaskById,
    addComments,
    addEmail,
    getMails,
    getProgress,
    getConnectMails,
    addMailClient,
    getAllTaskProgress,
    createTime,
    stopTime,
    getComments,
} from "../controllers/taskController.js";
import {authMiddleware} from '../middlewares/authMiddleware.js'
import singleUpload from "../middlewares/multerMiddleware.js";

const router = express.Router();

router
    .route("/")
    .post(authMiddleware,createTask);

router
    .route("/get-connect-mails").get(authMiddleware,getConnectMails);
    
router
    .route("/:task_id")
    .put(authMiddleware,updateTask)
    .delete(authMiddleware,deleteTask)
    .get(authMiddleware,getTaskById);

router
    .route("/:project_id/")
    .get(getTasksByProject);

router
    .route("/members/add/:task_id")
    .post(authMiddleware,addMembersToTask);


router
    .route("/transcribe").post(authMiddleware,singleUpload,addTranscibtion);

router
    .route("/comment").post(authMiddleware,addComments);
router
    .route("/comment/:task_id").get(authMiddleware,getComments);

router
    .route("/email").post(authMiddleware,addEmail);
router
    .route("/email/client").post(authMiddleware,addMailClient);

router
    .route("/emails/get-emails").get(authMiddleware,getMails);

router
    .route("/progress/get-progress/:task_id").get(authMiddleware,getProgress);
router
    .route("/progress/get-progress").get(authMiddleware,getAllTaskProgress);

router
    .route("/time/:task_id").post(authMiddleware,createTime);
router
    .route("/time-stop/:time_id").post(authMiddleware,stopTime);


export default router;
