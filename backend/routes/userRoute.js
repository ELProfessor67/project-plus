import express from 'express';
import { login, register, verify, changePassword, updateUser, loadUser, resendOTP, googleLogin, logout } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import passport from 'passport';
import { initPassport } from '../services/passportService.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/verify').post(verify);
router.route('/resend-otp').post(resendOTP);

router.route('/change-password').put(authMiddleware,changePassword);
router.route('/update').put(authMiddleware,updateUser);
router.route('/get').get(authMiddleware,loadUser);
router.route('/logout').get(authMiddleware,logout);




//google auth
initPassport();
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'],session: false }));
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login',session: false }),
    googleLogin
);


export default router;