import "dotenv/config"
import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import { generateToken } from "../services/twilioService.js";
import twilio from 'twilio'


export const createToken = catchAsyncError(async (req, res, next) => {
    const token = await generateToken("+17274905652");
    res.status(200).json(token);
});


export const twilioVoice = catchAsyncError(async (req, res, next) => {
    const {From,To} = req.body;
    console.log("Calling From: ", From)
    console.log("Calling To: ", To)
    if (!From || !To) {
        return res.status(400).json({ error: "From and To numbers are required" });
    }

    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    const dial = response.dial({ callerId: From });
    dial.number(To);

    res.type("text/xml");
    res.send(response.toString());
});

