import express from "express";
import {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask,
    addMembersToTask,
} from "../controllers/taskController.js";
import {authMiddleware} from '../middlewares/authMiddleware.js'

const router = express.Router();

router
    .route("/")
    .post(authMiddleware,createTask);

router
    .route("/:task_id")
    .put(authMiddleware,updateTask)
    .delete(authMiddleware,deleteTask);

router
    .route("/:project_id/")
    .get(getTasksByProject);

router
    .route("/members/add/:task_id")
    .post(authMiddleware,addMembersToTask);

export default router;
