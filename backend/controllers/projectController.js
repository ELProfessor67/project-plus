import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import { validateRequestBody } from '../utils/validateRequestBody.js';
import { AddProjectRequestBodySchema } from '../schema/projectSchema.js';
import crypto from 'crypto';
import { projectSelector } from '../prisma/selectors/project.selector.js';
import { sendInviation } from '../services/userService.js';
import { prisma } from "../prisma/index.js";

export const createProject = catchAsyncError(async (req, res, next) => {
    const { name, description } = req.body;

    const [err, isValidate] = await validateRequestBody(req.body, AddProjectRequestBodySchema);
    if (!isValidate) {
        return next(new ErrorHandler(err, 401));
    }

    const userId = req.user.user_id;

    const project = await prisma.project.create({
        data: {
            name,
            description,
            created_by: userId,
        },
    });

    await prisma.projectMember.create({
        data: {
            project_id: project.project_id,
            user_id: userId,
            role: 'ADMIN',
        },
    });


    //add team member in project
    const members = await prisma.userTeam.findMany({
        where: {
            leader_id: userId
        }
    });

    for (let i = 0; i < array.length; i++) {
        const {user_id,role} = members[i];
        await prisma.projectMember.create({
            data: {
                project_id: project.project_id,
                user_id,
                role,
            },
        });
    }

    res.status(201).json({
        success: true,
        project,
    });
});

export const getMyProjects = catchAsyncError(async (req, res, next) => {
    let projects = await prisma.project.findMany({
        where: {
            created_by: req.user.user_id
        },
        include: projectSelector
    });


    let collaboratedProjects = await prisma.projectMember.findMany({
        where: { user_id: req.user.user_id },
        include: {
            project: {
                select: {
                    project_id: true,
                    name: true,
                    description: true,
                    created_by: true,
                    created_at: true,
                    updated_at: true,
                    ...projectSelector
                }
            },
        },
    });


    collaboratedProjects = collaboratedProjects.map(collabrationMember => ({ ...collabrationMember.project, isCollabrationProject: true }));
    collaboratedProjects = collaboratedProjects.filter(project => project.created_by !== req.user.user_id)
    res.status(200).json({
        success: true,
        projects,
        collaboratedProjects
    });
});

export const getProjectById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
        where: { project_id: parseInt(id) },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    user_id: true,

                },
            },
            Members: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            user_id: true,
                        },
                    },
                },
            },
            Tasks: {
                include: {
                    assignees: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                    user_id: true,
                                },
                            },
                        },
                    },
                },
            },
            Clients: {
                select: {
                    project_client_id: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            user_id: true,
                        }
                    },
                }
            },
        },
    });

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    res.status(200).json({
        success: true,
        project,
    });
});

export const updateProject = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.user_id;

    // Find the project to ensure the user is the owner 
    const project = await prisma.project.findUnique({
        where: { project_id: parseInt(id) },
    });

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    // Check if the authenticated user is the owner
    if (project.created_by !== userId) {
        return next(new ErrorHandler("You are not authorized to update this project", 403));
    }

    // Update the project if the user is the owner
    const updatedProject = await prisma.project.update({
        where: { project_id: parseInt(id) },
        data: { name, description },
    });

    res.status(200).json({
        success: true,
        project: updatedProject,
    });
});


export const deleteProject = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Find the project to ensure the user is the owner
    const project = await prisma.project.findUnique({
        where: { project_id: parseInt(id) },
    });

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    // Check if the authenticated user is the owner
    if (project.created_by !== userId) {
        return next(new ErrorHandler("You are not authorized to delete this project", 403));
    }

    // Use a transaction to delete the project and related records
    await prisma.$transaction([
        prisma.projectMember.deleteMany({
            where: { project_id: parseInt(id) }, // Delete project members
        }),
        prisma.taskMember.deleteMany({
            where: {
                task: {
                    project_id: parseInt(id), // Delete task members linked to the project's tasks
                },
            },
        }),
        prisma.task.deleteMany({
            where: { project_id: parseInt(id) }, // Delete tasks
        }),
        prisma.project.delete({
            where: { project_id: parseInt(id) }, // Delete the project itself
        }),
    ]);

    res.status(200).json({
        success: true,
        message: "Project and all associated data deleted successfully",
    });
});


export const generateInvitationLink = catchAsyncError(async (req, res, next) => {
    const { project_id } = req.params;
    const { role } = req.body;
    const user_id = req.user.user_id;

    // Check if the user is the project owner
    const project = await prisma.project.findUnique({
        where: { project_id: parseInt(project_id) },
    });



    if (!project || project.created_by !== user_id) {
        return next(new ErrorHandler("You are not authorized to generate an invitation link", 403));
    }


    const token = crypto.randomBytes(32).toString('hex');

    // Store the token with the project_id
    await prisma.invitation.create({
        data: {
            token,
            project_id: parseInt(project_id),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            role,
            user_id: user_id
        },
    });

    const link = `${process.env.FRONTEND_URL}/join-project/${token}`;

    res.status(201).json({
        success: true,
        link,
    });
});


export const addMemberThroughInvitation = catchAsyncError(async (req, res, next) => {
    const { token } = req.body;
    const user_id = req.user.user_id;

    // Validate the token
    const invitation = await prisma.invitation.findUnique({
        where: { token },
    });

    if (!invitation || invitation.expires_at < new Date()) {
        return next(new ErrorHandler("Invalid or expired invitation link", 400));
    }

    if (invitation.role != "CLIENT") {
        // Check if the user is already a member of the project
        const existingMember = await prisma.projectMember.findFirst({
            where: {
                project_id: invitation.project_id,
                user_id,
            },
        });



        if (existingMember) {
            return next(new ErrorHandler("You are already a member of this project", 400));
        }

        //add user to team
        const isAlreadyInTeam = await prisma.userTeam.findUnique({
            where: {
                user_id: user_id
            }
        });

        if (!isAlreadyInTeam) {
            await prisma.userTeam.create({
                data: {
                    user_id: user_id,
                    leader_id: invitation.user_id,
                    role: invitation.role
                }
            })
        }

        //add all other project this member
        const allProjects = await prisma.project.findMany({
            where: {
                created_by: invitation.user_id
            },
            select: {
                project_id: true
            }
        });

        for (let i = 0; i < allProjects.length; i++) {
            const { project_id } = allProjects[i];

            const existingMember = await prisma.projectMember.findFirst({
                where: {
                    project_id: project_id,
                    user_id,
                },
            });



            if (!existingMember) {
                await prisma.projectMember.create({
                    data: {
                        project_id: project_id,
                        user_id,
                        role: invitation.role || 'MEMBER',
                    },
                });
            }

        }

        // Add the user as a project member
        // const projectMember = await prisma.projectMember.create({
        //     data: {
        //         project_id: invitation.project_id,
        //         user_id,
        //         role: invitation.role || 'MEMBER',
        //     },
        // });

        // Optionally delete the invitation (one-time use)
        await prisma.invitation.delete({
            where: { token },
        });

        res.status(201).json({
            success: true,
            message: "You have successfully joined the project"
        });
    } else {
        // Check if the user is already a member of the project
        const existingClient = await prisma.projectClient.findFirst({
            where: {
                project_id: invitation.project_id,
                user_id,
            },
        });

        if (existingClient) {
            return next(new ErrorHandler("You are already a client of this project", 400));
        }

        // Add the user as a project member
        const projectClient = await prisma.projectClient.create({
            data: {
                project_id: invitation.project_id,
                user_id
            },
        });

        const prismaProjectMember = await prisma.projectMember.findMany({
            where: {
                project_id: invitation.project_id,
            },
        });

        //create conversation
        const data = [];

        prismaProjectMember.forEach(member => {
            data.push({
                isGroup: false,
                task_id: -1,
                project_id: invitation.project_id,
                participants: [
                    { user_id: member.user_id },
                    { user_id: user_id }
                ]
            });
        });

        // Use a loop to create conversations individually
        for (const conversation of data) {
            await prisma.conversation.create({
                data: {
                    isGroup: conversation.isGroup,
                    task_id: conversation.task_id,
                    participants: {
                        create: conversation.participants
                    }
                }
            });
        }

        // Optionally delete the invitation (one-time use)
        await prisma.invitation.delete({
            where: { token },
        });

        res.status(201).json({
            success: true,
            message: "You have successfully joined the project",
            projectClient,
        });
    }
});








export const removeMemberFromProject = catchAsyncError(async (req, res, next) => {
    const { project_member_id } = req.params;
    const userId = req.user.user_id;  // Assuming user_id is stored in the request after authentication

    // Fetch the project member to ensure the user is authorized to delete
    const projectMember = await prisma.projectMember.findUnique({
        where: { project_member_id: parseInt(project_member_id) },
        include: {
            project: true, // Include project to get its creator
        },
    });

    if (!projectMember) {
        return next(new ErrorHandler("Project member not found", 404));
    }

    // Check if the authenticated user is the project owner
    if (projectMember.project.created_by !== userId) {
        return next(new ErrorHandler("You are not authorized to remove members from this project", 403));
    }

    // Delete the project member
    await prisma.projectMember.delete({
        where: { project_member_id: parseInt(project_member_id) },
    });

    res.status(200).json({
        success: true,
        message: "Member removed successfully",
    });
});


export const getProjectMembers = catchAsyncError(async (req, res, next) => {
    const { project_id } = req.params;

    const members = await prisma.projectMember.findMany({
        where: { project_id: parseInt(project_id) },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    user_id: true,
                }
            }
        }
    });

    res.status(200).json({
        success: true,
        members,
    });
});





export const sendInvitationViaMail = catchAsyncError(async (req, res, next) => {
    const { invitation, mail } = req.body;
    if (!invitation || !mail) return next(new ErrorHandler('Inviation and Mail is required.'));
    await sendInviation(invitation, mail);

    res.status(200).json({
        success: true,
        message: "Mail Send Successfully",
    });
});