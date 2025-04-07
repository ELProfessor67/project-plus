import { createMailBatchs } from "../processors/createMailBatchProcessor.js";
import { executeBatchMail } from "../processors/executeMailBatchProcessor.js";
import moment from 'moment'
import { generateMeetingInfoHtml } from "../processors/generateMeetingInfoProcessor.js";
import { sendMail } from "../processors/sendMailProcessor.js";
import { generateMeetingUpdateHtml } from "../processors/generateMeetingUpdateHtmlProcessor.js";
import { executeUpdateMailsBatch } from "../processors/executeMeetingMailBatch.js";
import { generateMeetingInvitation } from "../processors/generateMeetingLinkProcessor.js";
import { generateRequestDocumentHtml } from "../processors/generateDocumentRequestHtmlProcessor.js";

export const sendInviation = async (users, heading, description, meeting_id, date, time, senderName, sendEmail) => {
    const batches = createMailBatchs(users, 10);
    for (const batch of batches) {
        await executeBatchMail(batch, heading, description, meeting_id, date, time, senderName, sendEmail)
        await new Promise((resolve) => setTimeout(resolve, 5000));

    }
    console.log('All emails sent!');
}


export const sendMailDetails = async (meetingInfo) => {
    const participant = meetingInfo.participants;
    const recipient = meetingInfo.user;
    const meetingDetails = {
        title: meetingInfo.heading,
        description: meetingInfo.description,
        scheduledTime: moment(meetingInfo.date).format('LLL')
    }
    const scheduledLink = `${process.env.BACKEND_URL}/api/v1/meeting/confirm/${meetingInfo.meeting_id}?user_id=${meetingInfo.user.user_id}&vote=1`
    const CanceledLink = `${process.env.BACKEND_URL}/api/v1/meeting/confirm/${meetingInfo.meeting_id}?user_id=${meetingInfo.user.user_id}&vote=0`
    const html = generateMeetingInfoHtml(participant, recipient, meetingDetails, scheduledLink, CanceledLink);
    sendMail("Meeting Information", recipient.email, html);
}

export const sendMeetingLink = async (name,email,meetingInfo) => {
    const recipient = {
        name,
        email
    };
    const meetingDetails = {
        title: meetingInfo.heading,
        description: meetingInfo.description
    }
    const joinLink =  `${process.env.FRONTEND_URL}/meeting/${meetingInfo.meeting_id}`
    const html = generateMeetingInvitation(recipient, meetingDetails, joinLink);
    sendMail("Meeting Invitation", recipient.email, html);
}

export const sendDocumentRequest = async (project_client_id,name,description,email) => {
    const submitLink =  `${process.env.FRONTEND_URL}/documents/${project_client_id}`
    const html = generateRequestDocumentHtml(submitLink,name,description);
    sendMail("Submit Document", email, html);
}



export const sendSignatureRequest = async (project_client_id,name,description,email) => {
    const submitLink =  `${process.env.FRONTEND_URL}/sign/${project_client_id}`
    const html = generateRequestDocumentHtml(submitLink,name,description);
    sendMail("Submit Document", email, html);
}

export const sendMailUpdate = async (meetingInfo, status) => {
    const participants = meetingInfo.participants;

    const meetingDetails = {
        meetingTitle: meetingInfo.heading,
        meetingDescription: meetingInfo.description,
        scheduledTime: moment(meetingInfo.date).format('LLL'),
        meetingStatus: status,
        participants,
        meetingLink: `${process.env.FRONTEND_URL}/meeting/${meetingInfo.meeting_id}`
    };

    const batches = createMailBatchs(meetingInfo.task.assignees, 10);

    const html = generateMeetingUpdateHtml(meetingDetails);
    for (const batch of batches) {
        executeUpdateMailsBatch(html, batch);
        await new Promise((resolve) => setTimeout(resolve, 5000));

    }
}