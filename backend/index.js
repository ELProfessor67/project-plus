import express from 'express';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import ErrorMiddleware from './middlewares/error.js'
import initChatServer from './config/chatServerConfig.js';
import http from 'http';
import { Server } from "socket.io";
import initTranscribeServer from './config/transcribeServerConfig.js';
import passport from 'passport';

config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));
app.use(passport.initialize());
app.use('/api/v1/',router);
app.use(ErrorMiddleware);

const PORT = process.env.PORT || 4000;

const httpserver = http.createServer(app);

const io = new Server({
    cors: {
      allowedHeaders: ["*"],
      origin: "*",
    },
});
io.attach(httpserver);

const chatIO = io.of('/chat');
initChatServer(chatIO);


const transcribeIO = io.of('/transcribe');
initTranscribeServer(transcribeIO);

httpserver.listen(PORT,() => {
    console.log(`server running: http://localhost:${PORT}`);
});