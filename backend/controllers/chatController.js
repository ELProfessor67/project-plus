import catchAsyncError from '../middlewares/catchAsyncError.js';
import { prisma } from "../prisma/index.js";

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


export const getConversationUsers = catchAsyncError(async (req, res, next) => {
  const my_id = req.user.user_id;
  const conversationUserList = await prisma.participant.findMany({
    where: {
      conversation: {
        participants: {
          some: {
            user_id: Number(my_id),
          },
        },
      },
      NOT: {
        user_id: Number(my_id),
      },
    },
    select: {
      user: {
        select: {
          user_id: true,
          name: true,
          email: true,
          active_status: true
        },
      },
    },
    distinct: ['user_id'],
  });

  const users = conversationUserList.map(item => item.user);

  res.status(200).json({
    success: true,
    users: users,
  })

})


export const getChatsUser = catchAsyncError(async (req, res, next) => {
  const { query } = req.query; 

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required.",
    });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },  
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      user_id: true,
      name: true,
      email: true,
      active_status: true,
    },
  });

  res.status(200).json({
    success: true,
    users,
  });
});


