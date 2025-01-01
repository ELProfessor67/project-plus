import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";


import {prisma} from "../prisma/index.js";

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
              Tasks: {
                select: {
                  task_id: true,
                  name: true
                }
              }
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
                  Tasks: {
                    select: {
                      task_id: true,
                      name: true
                    }
                  }
                },
              
              },
            },
          },
        },
    });


    if(!user) throw new ErrorHandler('Unauthorize user',401);


    const projectIds = user.Projects.map(project => project.project_id);

    let CollaborationProject = user.Collaboration.map((project) => ({is_collabration_project: true,...project.project}));
    CollaborationProject = CollaborationProject.filter(project => !projectIds.includes(project.project_id));
    user.Projects = [...user.Projects,...CollaborationProject];

    req.user = user;
  
    next()
});