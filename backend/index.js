import express from 'express';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import ErrorMiddleware from './middlewares/error.js'
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use('/api/v1/',router);
app.use(ErrorMiddleware);

const PORT = process.env.PORT || 4000;

app.listen(PORT,() => {
    console.log(`server running: http://localhost:${PORT}`);
});