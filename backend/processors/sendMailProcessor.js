import { createTransport } from "nodemailer";

export const sendMail = async (subject,mail,html) => {
    try {
        console.log('sending too : ',mail)
        const transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });
        
          const subject = "ProjectPlus.com Project Inviation";
        
          await transporter.sendMail({
            to: "jeeshanr599@gmail.com",
            subject,
            html
          });
    } catch (error) {
        console.log(error.message);
    }
}