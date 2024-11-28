import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { generateOTP } from "../processors/generateOTPProcessor.js";


export const generateJWTToken = (user,callback) => {
    const jwttoken = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '15d' });
    return jwttoken;
}


export const sendOTPOnMail = async (user,callback) => {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = "OTP";
  const OTP = generateOTP();
  const text = `your otp is ${OTP}`;

  await transporter.sendMail({
    to: user.email,
    subject,
    text,
  });

  console.log(OTP)

  callback(OTP);
};
