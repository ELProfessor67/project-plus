import { PrismaClient } from "@prisma/client";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();

export const authMiddleware = catchAsyncError(async (req,res,next) => {
    const token = req.cookies.token;
    if(!token) throw new ErrorHandler('Unauthorize user',401);
    const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
        where: {
          user_id: decodeToken.user_id, // Replace with your token decoding logic
        },
        select: {
          user_id: true,
          name: true,
          email: true,
          bring: true,
          hear_about_as: true,
          focus: true,
          account_name: true,
          Projects: {
            select: {
              project_id: true,
              name: true,
              description: true,
              created_at: true,
              updated_at: true,
              created_by: true,
            },
          },
          Collaboration: {
            select: {
              project_member_id: true,
              role: true,
              added_at: true,
              project: {
                select: {
                  project_id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
    });
      
    if(!user) throw new ErrorHandler('Unauthorize user',401);

    req.user = user;
    

    next()
});