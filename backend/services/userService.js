import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { generateOTP } from "../processors/generateOTPProcessor.js";


export const generateJWTToken = (user, callback) => {
  const jwttoken = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '15d' });
  return jwttoken;
}


export const sendOTPOnMail = async (user, callback) => {
  try {
    console.log("Sending OTP to user email...");
    console.log("generting transporter...");
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("transporter generated successfully...");
    const subject = "OTP";
    const OTP = generateOTP();
    const text = `your otp is ${OTP}`;

    console.log("Sending OTP to user email...");
    // await transporter.sendMail({
    //   to: user.email,
    //   subject,
    //   text,
    // });

    console.log(OTP)

    callback(OTP,null);
  } catch (error) {
    callback(null,error.message);

  }
};





export const sendInviation = async (message, mail) => {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = "flexywexy.com Project Inviation";

  await transporter.sendMail({
    to: mail,
    subject,
    text: message,
  });
};