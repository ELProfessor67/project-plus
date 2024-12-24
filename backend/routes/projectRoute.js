import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    createProject,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject,
    removeMemberFromProject,
    getProjectMembers,
    generateInvitationLink,
    addMemberThroughInvitation,
    sendInvitationViaMail
} from '../controllers/projectController.js';

const router = express.Router();

router.route('/').post(authMiddleware,createProject).get(authMiddleware,getMyProjects)
router.route('/:id').get(authMiddleware,getProjectById).put(authMiddleware,updateProject).delete(authMiddleware,deleteProject);
router.route('/:project_id/invite').post(authMiddleware,generateInvitationLink);
router.route('/join').post(authMiddleware,addMemberThroughInvitation);
router.route('/members/:project_member_id').delete(authMiddleware,removeMemberFromProject);
router.route('/:project_id/members').get(authMiddleware,getProjectMembers);
router.route('/send-via-mail').post(authMiddleware,sendInvitationViaMail);



export default router;