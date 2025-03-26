import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import { validateRequestBody } from '../utils/validateRequestBody.js';
import { CreateTaskRequestBodySchema } from '../schema/taskSchema.js';
import { transcribeFile } from '../services/taskService.js';
import {prisma} from "../prisma/index.js";
import { decrypt } from '../services/encryptionService.js';
import { fetchMail } from '../services/googleService.js';

async function getTaskDetailsByDate(taskId) {
    const emails = await prisma.email.findMany({
      where: { task_id: taskId },
      select: {
        created_at: true,
        content: true,
        subject: true,
        user: {
          select: { 
            user_id: true,
            name: true,
            email: true 
        },
        },
      },
    });
  
    const comments = await prisma.comment.findMany({
      where: { task_id: taskId },
      select: {
        created_at: true,
        content: true,
        user: {
          select: { 
            user_id: true,
            name: true,
            email: true 
        },
        },
      },
    });
  
    const transcriptions = await prisma.transcibtion.findMany({
      where: { task_id: taskId },
      select: {
        created_at: true,
        Transcibtion: true,
        name: true,
        user: {
          select: { 
            user_id: true,
            name: true,
            email: true 
        },
        },
      },
    });
  
    // Combine and format data
    const combined = [
      ...emails.map((email) => ({
        type: 'email',
        created_at: email.created_at,
        content: email.content,
        subject: email.subject,
        user: email.user,
      })),
      ...comments.map((comment) => ({
        type: 'comment',
        created_at: comment.created_at,
        content: comment.content,
        user: comment.user,
      })),
      ...transcriptions.map((transcription) => ({
        type: 'transcription',
        created_at: transcription.created_at,
        Transcibtion: transcription.Transcibtion,
        name: transcription.name,
        user: transcription.user,
      })),
    ];
  
    // Group data by date
    const grouped = combined.reduce((acc, curr) => {
      const date = curr.created_at.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, emails: [], comments: [], transcriptions: [] };
      }
      if (curr.type === 'email') acc[date].emails.push(curr);
      if (curr.type === 'comment') acc[date].comments.push(curr);
      if (curr.type === 'transcription') acc[date].transcriptions.push(curr);
      return acc;
    }, {});
  
    // Convert grouped data to array format
    return  Object.values(grouped) ;
  }

export const createTask = catchAsyncError(async (req, res, next) => {
    const { project_id, name, description, assigned_to, priority, last_date, otherMember, status } = req.body;
    const user_id = req.user.user_id;

    const [err, isValidate] = await validateRequestBody(req.body, CreateTaskRequestBodySchema);
    if (!isValidate) {
        return next(new ErrorHandler(err, 401));
    }

    // Check if the project exists and the user is a member
    const projectMember = await prisma.projectMember.findFirst({
        where: {
            project_id,
            user_id,
        }
    });

    const Project = await prisma.project.findUnique({
        where: {
            project_id
        },
        include: {
            Members: true
        }
    })

    if (!projectMember || projectMember.role != 'ADMIN') {
        return next(new ErrorHandler("You are not a admin of this project", 403));
    }

    //add selected memer to add task
    const isAllProviderMemberInProject = otherMember.every(id =>
        Project.Members.some(member => member.user_id === id)
    );

    if(!isAllProviderMemberInProject){
        return next(new ErrorHandler("You provider member is not in project.", 403));
    }



    // Create a task
    const task = await prisma.task.create({
        data: {
            project_id,
            name,
            description,
            created_by: user_id,
            assigned_to: assigned_to || null,
            priority,
            last_date,
            status
        }
    });

    const memberData = otherMember.map(id => ({
        user_id: id,
        task_id: task.task_id
    }))

    memberData.push({
        user_id: assigned_to,
        task_id: task.task_id
    });

    const taskMember = await prisma.taskMember.createMany({
        data: memberData
    });


    res.status(201).json({
        success: true,
        task,
    });
});


export const getTaskById = catchAsyncError(async (req,res,next) => {
    const task_id = req.params.task_id;

    const task = await prisma.task.findUnique({
        where: {
            task_id: parseInt(task_id)
        },
        include: {
            assignees: { 
                include: { 
                    user: { 
                        select: { 
                            name: true,
                            email: true,
                            user_id: true
                        }
                    }
                }
            },
            Transcibtions: {
                select: {
                    transcribtion_id: true,
                    name: true,
                    Transcibtion: true,
                    user: {
                        select: {
                            user_id: true,
                            name: true,
                            email: true
                        }
                    },
                    created_at: true,
                }
            },

            Emails: {
                select: {
                    email_id: true,
                    subject: true,
                    content: true,
                    user: {
                        select: {
                            user_id: true,
                            name: true,
                            email: true
                        }
                    },
                    created_at: true,
                }
            },

            
            Comments: {
                select: {
                    comment_id: true,
                    content: true,
                    user: {
                        select: {
                            user_id: true,
                            name: true,
                            email: true
                        }
                    },
                    created_at: true,
                }
            }
        }
    });

    const progress = await getTaskDetailsByDate( parseInt(task_id));

    res.status(200).json({
        success: true,
        task,
        progress
    });
});


export const getTasksByProject = catchAsyncError(async (req, res, next) => {
    const { project_id } = req.params;

    // Validate project existence
    const project = await prisma.project.findUnique({
        where: { project_id: parseInt(project_id) },
        include: { 
            Tasks: { 
                include: { 
                    assignees: { 
                        include: { 
                            user: { 
                                select: { 
                                    name: true,
                                    email: true,
                                    user_id: true
                                }
                            }
                        }
                    }
                }
            }
        },
    });

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    res.status(200).json({
        success: true,
        tasks: project.Tasks,
    });
});


export const updateTask = catchAsyncError(async (req, res, next) => {
    const { task_id } = req.params;
    const { name, description, status, assigned_to, priority, last_date } = req.body;
    const user_id = req.user.user_id;

    // Fetch task and validate permissions
    const task = await prisma.task.findUnique({
        where: { task_id: parseInt(task_id) },
        include: { project: { include: { Members: true } } },
    });

    if (!task) {
        return next(new ErrorHandler("Task not found", 404));
    }

    const isProjectAdmin = task.project.Members.some(
        (member) => member.user_id === user_id && (member.role === "ADMIN" || member.role === "MEMBER" )
    );

    if (task.created_by !== user_id && !isProjectAdmin) {
        return next(new ErrorHandler("You are not authorized to update this task", 403));
    }

    // Update task
    const updateData = {};
    if(name) updateData['name'] = name;
    if(description) updateData['description'] = description;
    if(status) updateData['status'] = status;
    if(assigned_to) updateData['assigned_to'] = assigned_to;
    if(priority) updateData['priority'] = priority;
    if(last_date) updateData['last_date'] = last_date;

    const updatedTask = await prisma.task.update({
        where: { task_id: parseInt(task_id) },
        data: updateData,
    });

    if (updatedTask) {
        await prisma.taskProgress.create({
            data: {
                message: `User updated "${updatedTask.name}" task.`,
                user_id: user_id,
                task_id: updatedTask.task_id,
            }
        });
    }

    res.status(200).json({
        success: true,
        task: updatedTask,
    });
});

export const deleteTask = catchAsyncError(async (req, res, next) => {
    const { task_id } = req.params;
    const user_id = req.user.user_id;

    // Fetch task and validate permissions
    const task = await prisma.task.findUnique({
        where: { task_id: parseInt(task_id) },
        include: { project: { include: { Members: true } } },
    });

    if (!task) {
        return next(new ErrorHandler("Task not found", 404));
    }

    const isProjectAdmin = task.project.Members.some(
        (member) => member.user_id === user_id && member.role === "ADMIN"
    );

    if (task.created_by !== user_id && !isProjectAdmin) {
        return next(new ErrorHandler("You are not authorized to delete this task", 403));
    }

    // Delete task and related task members
    await prisma.taskMember.deleteMany({
        where: { task_id: task.task_id },
    });

    await prisma.task.delete({
        where: { task_id: parseInt(task_id) },
    });


    await prisma.taskProgress.create({
        data: {
            message: `User Delete ${task.name} Task.`,
            user_id: user_id,
            task_id: parseInt(task_id),
        }
    });

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
});

export const addMembersToTask = catchAsyncError(async (req, res, next) => {
    const {task_id} = req.params
    const { otherMember } = req.body;

    // Fetch task and project
    const task = await prisma.task.findUnique({
        where: { task_id: parseInt(task_id) },
        include: { project: { include: { Members: true } } },
    });

    if (!task) {
        return next(new ErrorHandler("Task not found", 404));
    }

    const isAllProviderMemberInProject = otherMember.every(id =>
        task.project.Members.some(member => member.user_id === id)
    );



    if (!isAllProviderMemberInProject) {
        return next(new ErrorHandler("Users is not a member of this project", 403));
    }

    const memberData = otherMember.map(id => ({
        user_id: id,
        task_id: task.task_id
    }))

    // Add member to task
    const taskMember = await prisma.taskMember.createMany({
        data: memberData,
    });

    res.status(201).json({
        success: true,
        taskMember,
    });
});



export const addTranscibtion = catchAsyncError(async (req, res, next) => {
    let { task_id,name } = req.body;
    const user_id = req.user.user_id;
    if(!task_id || !name) return next(new ErrorHandler(401,"Task Id is required."));

    const task = await prisma.task.findUnique({
        where: {
            task_id: parseInt(task_id)
        }
    });



    if(!task) return next(new ErrorHandler(401,"Invalid Task Id"));


    const file = req.file;
    if(!file || !name) return next(new ErrorHandler(401,"File And Name Required."));
    const fileBuffer = file.buffer;
    const Transcibtion = await transcribeFile(fileBuffer);

    await prisma.transcibtion.create({
        data: {
            task_id: parseInt(task_id),
            user_id: user_id,
            Transcibtion: Transcibtion,
            name: name
        }
    })

    res.status(200).json({
        success: true,
        message: 'Audio Tanscibed Successfully',
    });
});


export const addComments = catchAsyncError(async (req, res, next) => {
    let { task_id,content } = req.body;
    const user_id = req.user.user_id;
    if(!task_id) return next(new ErrorHandler(401,"Task Id is required."));

    const task = await prisma.task.findUnique({
        where: {
            task_id: parseInt(task_id)
        }
    });



    if(!task) return next(new ErrorHandler(401,"Invalid Task Id"));



    if(!content) return next(new ErrorHandler(401,"Content is required."));
   
    await prisma.comment.create({
        data: {
            task_id: parseInt(task_id),
            user_id: user_id,
            content: content
        }
    })



    await prisma.taskProgress.create({
        data: {
            message: `User Add a comments: ${content}`,
            user_id: user_id,
            task_id: parseInt(task_id),
        }
    });


    res.status(200).json({
        success: true,
        message: 'Comment Add Successfully',
    });
});



export const addEmail = catchAsyncError(async (req, res, next) => {
    let { task_id,subject,content } = req.body;
    const user_id = req.user.user_id;
    if(!task_id) return next(new ErrorHandler(401,"Task Id is required."));

    const task = await prisma.task.findUnique({
        where: {
            task_id: parseInt(task_id)
        },
        include: {
            assignees: {
                select: {
                    user_id: true
                }
            }
        }
    });



    if(!task) return next(new ErrorHandler(401,"Invalid Task Id"));



    if(!content || !subject) return next(new ErrorHandler(401,"Content and subject is required."));
    const data = [
        {
            task_id: parseInt(task_id),
            user_id: user_id,
            content: content,
            subject: subject,
            project_id: task.project_id
        }
    ]

    for (let index = 0; index < task.assignees.length; index++) {
        const assignees =  task.assignees[index];
        if(assignees.user_id == user_id) continue;
        data.push(
            {
                task_id: parseInt(task_id),
                user_id: user_id,
                content: content,
                subject: subject,
                to_user: assignees.user_id,
                project_id: task.project_id
            }
        )
        
    }
    
    await prisma.email.createMany({
        data: data
    });

    await prisma.taskProgress.create({
        data: {
            message: `User Send a mail subject: ${subject}`,
            user_id: user_id,
            task_id: parseInt(task_id),
        }
    });

    res.status(200).json({
        success: true,
        message: 'Email Send  Successfully to all member.',
    });
});


export const addMailClient = catchAsyncError(async (req, res, next) => {
    let { client_id,task_id,subject,content } = req.body;
    const user_id = req.user.user_id;
    if(!task_id) return next(new ErrorHandler(401,"Task Id is required."));

    const task = await prisma.task.findUnique({
        where: {
            task_id: parseInt(task_id)
        }
    });



    if(!task) return next(new ErrorHandler(401,"Invalid Task Id"));



    if(!content || !subject) return next(new ErrorHandler(401,"Content and subject is required."));
    
    
    await prisma.email.create({
        data:  {
            task_id: parseInt(task_id),
            user_id: user_id,
            content: content,
            subject: subject,
            to_user: parseInt(client_id),
            project_id: task.project_id
        }
    });

    await prisma.taskProgress.create({
        data: {
            message: `User Send a mail subject: ${subject}`,
            user_id: user_id,
            task_id: parseInt(task_id),
        }
    });

    res.status(200).json({
        success: true,
        message: 'Email Send  Successfully to all member.',
    });
});

export const getMails = catchAsyncError(async (req, res, next) => {
    const user_id = req.user.user_id;
    const {date} = req.query;
    const whereCondition = {
        OR: [
            {user_id: user_id},
            {to_user: user_id},
        ],
    };

    // Check if both start and end dates are provided
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0); 
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);


        whereCondition.created_at = {
            gte: startOfDay, 
            lte: endOfDay,   
        };
    }
    const emails = await prisma.email.findMany({
        where: whereCondition,
        include: {
            user: {
                select: {
                    user_id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    res.status(200).json({
        success: true,
        emails
    });
});





export const getProgress = catchAsyncError(async (req, res, next) => {
    const task_id = req.params.task_id;
    const {date} = req.query;

    const whereCondition = {
        task_id: parseInt(task_id)
    };

    
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0); 
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);


        whereCondition.created_at = {
            gte: startOfDay, 
            lte: endOfDay,   
        };
    }

    const progresss = await prisma.taskProgress.findMany({
        where: whereCondition,
        include:{
            user: {
                select: {
                    user_id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    res.status(200).json({
        success: true,
        progresss
    });
});





export const getConnectMails = catchAsyncError(async (req, res, next) => {
    const user_id = req.user.user_id;
    const user = await prisma.user.findFirst({
        where: {
            user_id: user_id,
        },
        select: {
            connect_mail_hash: true,
            encryption_key: true,
            encryption_vi: true
        }
    });

    if(!user.connect_mail_hash){
        next(new ErrorHandler("Please Connect Mail First",401));
        return
    }

    const decryptData = decrypt(user.connect_mail_hash,user.encryption_key,user.encryption_vi);
    const [mail,password] = decryptData.split('|');
   
    const mails = await fetchMail(mail,password);


    res.status(200).json({
        success: true,
        mails
    });
});