import catchAsyncError from '../middlewares/catchAsyncError.js';
import { validateRequestBody } from '../utils/validateRequestBody.js';
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from 'bcrypt';
import { ChangePasswordRequestBodySchema, LoginRequestBodySchema, OTPRequestBodySchema, RegisterRequestBodySchema, UpdateRequestBodySchema } from '../schema/userSchema.js';
import { generateJWTToken, sendOTPOnMail } from '../services/userService.js';
import crypto from 'crypto';

import {prisma} from "../prisma/index.js";
import { encrypt } from '../services/encryptionService.js';
import { verifyMailPassword } from '../processors/verifyMailPasswordProcessor.js';

export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password, account_name, bring, teams_member_count,focus,hear_about_as,role } = req.body;

    // Validate request body using Zod
    const [err, isValidate] = await validateRequestBody(req.body, RegisterRequestBodySchema);
    if (!isValidate) {
        return next(new ErrorHandler(err, 401));
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password_hash,
            account_name,
            bring,
            teams_member_count,
            focus,
            hear_about_as,
            Role: role || 'PROVIDER'
        }
    });

    await sendOTPOnMail(newUser,async (OTP,err) => {
        if (err) {
            return next(new ErrorHandler(err, 401));
        }
        const hash_otp = crypto.createHash('sha256').update(OTP.toString()).digest('hex');
        await prisma.oTP.create({
            data: {
                otp: hash_otp,
                user_id: newUser.user_id
            }
        });
    });

    // Send response with token as a cookie
    res.status(201).json({
        success: true,
        message: "OTP has been send to your email.",
    });
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password} = req.body;
    
    // Validate request body using Zod
    const [err, isValidate] = await validateRequestBody(req.body, LoginRequestBodySchema);
    if (!isValidate) {
        return next(new ErrorHandler(err, 401));
    }
    
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    
    //when user not exist
    if(!user){
        return next(new ErrorHandler('Invalid Credentials',404));
    }
    
    const isPasswordCorrect = await bcrypt.compare(password,user.password_hash);
    
    if(!isPasswordCorrect){
        return next(new ErrorHandler('Invalid Credentials',404));
    }

    
    await sendOTPOnMail(user,async (OTP,err) => {
        if (err) {
            return next(new ErrorHandler(err, 401));
        }
        const hash_otp = crypto.createHash('sha256').update(OTP.toString()).digest('hex');
        await prisma.oTP.create({
            data: {
                otp: hash_otp,
                user_id: user.user_id
            }
        });
    })   

    

    res.status(200).json({
        success: true,
        message: "OTP has been send to your email."
    });
});

export const verify = catchAsyncError(async (req,res, next) => {
    const {OTP} = req.body;
    const [err,isValidate] = await validateRequestBody(req.body,OTPRequestBodySchema);

    if (!isValidate) {
        return next(new ErrorHandler(err, 401));
    }

    const hash_otp = crypto.createHash('sha256').update(OTP.toString()).digest('hex');
    const otpRecord = await prisma.oTP.findUnique({
        where: {
          otp: hash_otp,
        },
        include: {
            user: {
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                    bring: true,
                    hear_about_as: true,
                    focus: true,
                    account_name: true,
                    Projects: true,
                    Role: true
                }
            }
        }
    });
    
    if (!otpRecord) {
        return next(new ErrorHandler('Invalid OTP or Expire',404));
    }
    
      // Calculate expiration time
    const expirationTime = new Date(otpRecord.created_at);
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
    
      // Compare current time with expiration time
    if (new Date() > expirationTime) {
        return next(new ErrorHandler('Invalid OTP or Expire',404));
    }

    const jwttoken = generateJWTToken(otpRecord.user);

    // Set options for the cookie
    const options = {
        httpOnly: true,    // Prevent access to the cookie from JavaScript
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Set expiration time
        secure: process.env.NODE_ENV === 'production' ? true : false  // Only send cookies over HTTPS in production
    };

    await prisma.oTP.delete({
        where: {
            otp: hash_otp,
        }
    })

      // Send response with token as a cookie
    res.status(201).cookie("token", jwttoken, options).json({
        success: true,
        message: "Login Successfully",
        user: otpRecord.user
    });

}) ;


export const googleLogin = catchAsyncError(async (req,res, next) => {
    const user = req.user;
    const jwttoken = generateJWTToken(user);

    // Set options for the cookie
    const options = {
        httpOnly: true,    // Prevent access to the cookie from JavaScript
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Set expiration time
        secure: process.env.NODE_ENV === 'production' ? true : false  // Only send cookies over HTTPS in production
    };

    // Send response with token as a cookie
    res.status(201).cookie("token", jwttoken, options).redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

export const logout = catchAsyncError(async (req,res, next) => {
   
    const options = {
        httpOnly: true, 
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === 'production' ? true : false
    };

    // Send response with token as a cookie
    res.status(201).cookie("token", null, options).json({
        success: true,
        message: "Logout Successfully"
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    const [err,isValidate] = await validateRequestBody(req.body,ChangePasswordRequestBodySchema);

    if (!isValidate) {
        return next(new ErrorHandler(err, 401));
    }

    const user = req.user;

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordCorrect) {
        return next(new ErrorHandler('Current password is incorrect', 403));
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { user_id: user.user_id },
        data: { password_hash: newHashedPassword },
    });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
    const { name, account_name, bring, teams_member_count, focus, hear_about_as } = req.body;

    const [err,isValidate] = await validateRequestBody(req.body,UpdateRequestBodySchema);

    if (!isValidate) {
        return next(new ErrorHandler(err, 401));
    }

    const userId = req.user.user_id;

    console.log(req.user,'sssss')

    // Validate request body to ensure only allowed fields are updated
    const updateData = {};
    if (name) updateData.name = name;
    if (account_name) updateData.account_name = account_name;
    if (bring) updateData.bring = bring;
    if (teams_member_count) updateData.teams_member_count = teams_member_count;
    if (focus) updateData.focus = focus;
    if (hear_about_as) updateData.hear_about_as = hear_about_as;

    if (Object.keys(updateData).length === 0) {
        return next(new ErrorHandler('No fields provided for update', 400));
    }

    // Update user details in the database
    const updatedUser = await prisma.user.update({
        where: { user_id: userId },
        data: updateData,
    });

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser, // Optionally send updated user data
    });
});

export const loadUser = catchAsyncError(async (req, res, next) => {
   
    res.status(200).json({
        success: true,
        user: req.user
    });
});


export const resendOTP = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    // Validate the request body
    if (!email) {
        return next(new ErrorHandler('Email is required', 400));
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Generate a new OTP
    await sendOTPOnMail(user, async (OTP) => {
        const hash_otp = crypto.createHash('sha256').update(OTP.toString()).digest('hex');

        // Delete any existing OTPs for the user
        await prisma.oTP.deleteMany({
            where: {
                user_id: user.user_id,
            },
        });

        // Save the new OTP in the database
        await prisma.oTP.create({
            data: {
                otp: hash_otp,
                user_id: user.user_id,
            },
        });
    });

    res.status(200).json({
        success: true,
        message: 'A new OTP has been sent to your email.',
    });
});


export const connectGmail = catchAsyncError(async (req, res, next) => {
    const { connect_mail_password, connect_mail } = req.body;


    if (!connect_mail || !connect_mail) {
        return next(new ErrorHandler("gmail and app password required", 401));
    }

    const verify = await verifyMailPassword(connect_mail,connect_mail_password);

    if (!verify) {
        return next(new ErrorHandler("Invalid Gmail Or App Password", 401));
    }

    const user_id = req.user.user_id;
    const mergeData = `${connect_mail}|${connect_mail_password}`;
    const encryptedData = encrypt(mergeData);


    // Update user details in the database
    const updatedUser = await prisma.user.update({
        where: { user_id: user_id },
        data: {
            connect_mail_hash: encryptedData.encryptedData,
            encryption_key: encryptedData.key,
            encryption_vi: encryptedData.iv
        }
    });

    res.status(200).json({
        success: true,
        message: 'Mail Connect Successfully',
        user: updatedUser,
    });
});