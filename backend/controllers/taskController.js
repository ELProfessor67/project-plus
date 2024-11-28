import { PrismaClient } from '@prisma/client';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import { validateRequestBody } from '../utils/validateRequestBody.js';
import { CreateTaskRequestBodySchema } from '../schema/taskSchema.js';

const prisma = new PrismaClient();

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
