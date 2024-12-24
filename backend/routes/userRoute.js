import express from 'express';
import { login, register, verify, changePassword, updateUser, loadUser, resendOTP } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/verify').post(verify);
router.route('/resend-otp').post(resendOTP);

router.route('/change-password').put(authMiddleware,changePassword);
router.route('/update').put(authMiddleware,updateUser);
router.route('/get').get(authMiddleware,loadUser);


export default router;