import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import { sendInviation, sendMailDetails, sendMailUpdate, sendMeetingLink } from '../services/meetingService.js';
import {prisma} from "../prisma/index.js";

export const createMeeting = catchAsyncError(async (req, res, next) => {
    const { heading,description,task_id,time,date,isScheduled,mail_text } = req.body;
    if(!heading || !description || !task_id) return next(new ErrorHandler("Heading and description and task_id is required"));
    const user_id = req.user.user_id;


    const task = await prisma.task.findUnique({
        where: {
            task_id: parseInt(task_id)
        },
        include: {
            assignees: {
                select: {
                    user: {
                        select: {
                            email: true,
                            name: true,
                            user_id: true
                        }
                    }
                }
            }
        }
    });


    if(!task) return next(new ErrorHandler("Invalid task_id"));


    const participantsData = task.assignees.map((assignee) => ({
        user_id: assignee.user.user_id,
        vote: 'PENDING'
    }));
    
    const meeting = await prisma.meeting.create({
        data: {
            heading,
            description,
            task_id: parseInt(task_id),
            user_id,
            isScheduled,
            date,
            time,
            project_id: task.project_id,
            status: isScheduled ? "PENDING" : "SCHEDULED",
            participants: {
                create: participantsData
            } 
        }
    });

    
    if(isScheduled){
        sendInviation(task.assignees,heading,description,meeting.meeting_id,date,time,req.user.name,req.user.email);
    }

    


    // Return the conversation ID in the response
    res.status(200).json({
        success: true,
        message:"Meetin Created Successfully",
        meeting
    });
});


export const createClientMeeting = catchAsyncError(async (req, res, next) => {
    const { heading,description,task_id,time,date,isScheduled,client_id } = req.body;
    if(!heading || !description || !task_id) return next(new ErrorHandler("Heading and description and task_id is required"));
    const user_id = req.user.user_id;


    const task = await prisma.task.findUnique({
        where: {
            task_id: parseInt(task_id)
        }
    });

    const client = await prisma.user.findUnique({
        where: {
            user_id: parseInt(client_id)
        }
    });


    if(!task) return next(new ErrorHandler("Invalid task_id"));


    const participantsData = [{
        user_id: parseInt(client_id),
        vote: 'PENDING'
    }];
    
    const meeting = await prisma.meeting.create({
        data: {
            heading,
            description,
            task_id: parseInt(task_id),
            user_id,
            isScheduled,
            date,
            time,
            project_id: task.project_id,
            status: isScheduled ? "PENDING" : "SCHEDULED",
            participants: {
                create: participantsData
            } 
        }
    });

    
    if(isScheduled){
        sendInviation(task.assignees,heading,description,meeting.meeting_id,date,time,req.user.name,req.user.email);
    }

    if(!isScheduled){
        sendMeetingLink(client.name,client.email,{
            heading,
            description,
            meeting_id: meeting.meeting_id
        });
    }



    await prisma.taskProgress.create({
        data: {
            message: `User Send a mail subject: ${subject}`,
            user_id: user_id,
            task_id: parseInt(task_id),
            type: "MEETING"
        }
    });


    // Return the conversation ID in the response
    res.status(200).json({
        success: true,
        message:"Meeting Created Successfully",
        meeting
    });
});


export const handleVoting = catchAsyncError(async (req, res, next) => {
    const {meeting_id} = req.params;
    const {user_id,vote} = req.query;

    if(!meeting_id || !user_id) return next(new ErrorHandler("Metting Id and User Id is required."));

    const voteValue = Number(vote) ? "ACCEPTED" : "REJECTED";
    const participantInfo = await prisma.meetingParticipant.findFirst({
        where: {
          meeting_id,
          user_id: parseInt(user_id),
        },
    });

    if(!participantInfo) return next(new ErrorHandler("Invalid Meeting ID"));

    const participant = await prisma.meetingParticipant.update({
        where: {
            meeting_participant_id: participantInfo.meeting_participant_id
        },
        data: {
            vote: voteValue
        }
    });


    const meeting = await prisma.meeting.findUnique({
        where: {
            meeting_id
        },
        include: {
            participants: {
                select: {
                    vote: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            user_id: true
                        }
                    }
                }
            },
            user: {
                select: {
                    name: true,
                    email: true,
                    user_id: true
                }
            }
        }
    });

    if(!meeting) return next(new ErrorHandler("Invalid Meeting ID"));

    sendMailDetails(meeting);

    res.redirect(`${process.env.FRONTEND_URL}/vote-sccuess?vote=${voteValue}`);
});





export const handleConfirm = catchAsyncError(async (req, res, next) => {
    const {meeting_id} = req.params;
    const {user_id,vote} = req.query;

    if(!meeting_id || !user_id) return next(new ErrorHandler("Metting Id and User Id is required."));

    const voteValue = Number(vote) ? "SCHEDULED" : "CANCELED`";
    const meetingInfo = await prisma.meeting.update({
        where: {
          meeting_id
        },
        data: {
            status: voteValue
        },
        include: {
            participants: {
                select: {
                    vote: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            user_id: true
                        }
                    }
                }
            },
            user: {
                select: {
                    name: true,
                    email: true,
                    user_id: true
                }
            },
            task: {
                select: {
                    assignees: {
                        select: {
                            user: {
                                select: {
                                    email: true,
                                    name: true,
                                    user_id: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    
    if(!meetingInfo) return next(new ErrorHandler("Invalid Meeting ID"));
    sendMailUpdate(meetingInfo,voteValue);
    res.redirect(`${process.env.FRONTEND_URL}/vote-confirm?vote=${voteValue}`);
});



export const getMeetings = catchAsyncError(async (req, res, next) => {
    const {isScheduled} = req.query;
    const user_id = req.user.user_id;

    const meetings = await prisma.meeting.findMany({
        where: {
            OR: [
                { user_id: user_id },
                { participants: { some: { user_id: user_id } } }
            ],
            isScheduled: isScheduled ? true : false
        },
        orderBy: {
            created_at: 'desc'
        },
        include: {
            participants: {
                select: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            user_id: true
                        }
                    },
                    vote: true
                }
            },
            transcribtions: {
                select: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            user_id: true
                        }
                    },
                    transcribe: true
                }
            }
        }
    });

    res.status(200).json({
        success: true,
        meetings
    })
});





export const getMeetingBYId = catchAsyncError(async (req, res, next) => {
    const {meeting_id} = req.params;
    const meeting = await prisma.meeting.findUnique({
        where: {
            meeting_id: meeting_id
        }
    });

    if(!meeting) return next(new ErrorHandler("Invalid Meeting Id",404));

    res.status(200).json({
        success: true,
        meeting
    })
});