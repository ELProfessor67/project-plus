import { PrismaClient } from '@prisma/client';
import catchAsyncError from '../middlewares/catchAsyncError.js';

const prisma = new PrismaClient();

export const getConversationID = catchAsyncError(async (req, res, next) => {
    let { user_id, task_id } = req.body;
    user_id = parseInt(user_id);
    const my_id = req.user.user_id; 

    let conversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          task_id: parseInt(task_id),
          AND: [
            {
              participants: {
                some: {
                  user_id: user_id,
                },
              },
            },
            {
              participants: {
                some: {
                  user_id: my_id,
                },
              },
            },
            {
              participants: {
                every: {
                  user_id: {
                    in: [user_id, my_id],
                  },
                },
              },
            },
          ],
        },
        select: {
          conversation_id: true,
          participants: true,
        },
      });
      

  
    // If no conversation exists, create one
    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                isGroup: false, 
                task_id: parseInt(task_id),
                participants: {
                    create: [
                        { user_id: user_id },
                        { user_id: my_id },
                    ],
                },
            },
            select: {
                conversation_id: true,   
            },
        });
    }

    // Return the conversation ID in the response
    res.status(200).json({
        success: true,
        conversation_id: conversation.conversation_id,
    });
});


export const getConversations = catchAsyncError(async (req, res, next) => {
    const { conversation_id } = req.params;
    

    let conversations = await prisma.message.findMany({
        where: {
            conversation_id: conversation_id
        }
    });

    // Return the conversation ID in the response
    res.status(200).json({
        success: true,
        conversations,
    });
});


export const getChatsUser = catchAsyncError(async (req, res, next) => {
    const users = await prisma.user.findMany({
        select: {
            user_id: true,
            name: true,
            email: true,
            active_status: true
        }
    });

    // Return the conversation ID in the response
    res.status(200).json({
        success: true,
        users,
    });
});


