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
    sendInvitationViaMail,
    createFolder,
    fileUpload,
    getFolderTreeByTemplateDocument,
    sendToLawyer,
    getTemplateDocumentFiles,
    updateFileUpload,
    updateTDocumentStatus,
    sendToClient
} from '../controllers/projectController.js';
import singleUpload from "../middlewares/multerMiddleware.js";
const router = express.Router();

router.route('/get-file').get(authMiddleware,getTemplateDocumentFiles);
router.route('/send').post(authMiddleware,singleUpload,sendToLawyer);
router.route('/send-client').post(authMiddleware,singleUpload,sendToClient);


router.route('/').post(authMiddleware,createProject).get(authMiddleware,getMyProjects)
router.route('/:id').get(authMiddleware,getProjectById).put(authMiddleware,updateProject).delete(authMiddleware,deleteProject);
router.route('/:project_id/invite').post(authMiddleware,generateInvitationLink);
router.route('/join').post(authMiddleware,addMemberThroughInvitation);
router.route('/members/:project_member_id').delete(authMiddleware,removeMemberFromProject);
router.route('/:project_id/members').get(authMiddleware,getProjectMembers);
router.route('/send-via-mail').post(authMiddleware,sendInvitationViaMail);

router.route('/folder').post(authMiddleware,createFolder);
router.route('/file').post(authMiddleware,singleUpload,fileUpload)
router.route('/file/update').put(authMiddleware,singleUpload,updateFileUpload);
router.route('/tree/:project_id').get(authMiddleware,getFolderTreeByTemplateDocument);

router.route('/update-t-document-status/:id').put(authMiddleware,updateTDocumentStatus);





export default router;