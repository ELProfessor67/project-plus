import { config } from "dotenv";
import { Redis } from "ioredis";
import { userSocketMap } from "../constants/userSocketMapConstant.js";
import { ON_CALL, ON_CALL_ANSWER, ON_CALL_END, ON_CALL_NO_RESPONSE, ON_DISCONNET, ON_MESSAGE, ON_SIGNAL } from "../constants/chatEventConstant.js";
import { handelNoResponse, handleCall, handleCallAnswer, handleCallEnd, handleCallSignal, handleDisconnect, handleMessage, initRedisSubcriber } from "../services/chatService.js";
import { initChatConsumer } from "../services/kafkaService.js";

config();

const initChatServer = (io) => {
  const REDIS_SERVER_URL = process.env.REDIS_URL;
  if (!REDIS_SERVER_URL) {
    throw new Error("REDIS_URL environment variable is not set");
  }

  const redisPub = new Redis(REDIS_SERVER_URL);
  const redisSub = new Redis(REDIS_SERVER_URL);

  //subscribe redis
  initRedisSubcriber(redisSub,io);
  initChatConsumer();
 

  io.on("connection", (socket) => {
    console.log('connection connect');

    //save user socket id
    const config = socket.handshake.query;
    const user_id = config.user_id;

    if(user_id){
      //change user active status on db - pending
    }
    
    userSocketMap.set(user_id,socket.id);

    socket.on(ON_DISCONNET,() => handleDisconnect(config));
    socket.on(ON_MESSAGE, (data) => handleMessage(data,redisPub));
    socket.on(ON_CALL, (data) => handleCall(data,redisPub));
    socket.on(ON_CALL_ANSWER, (data) => handleCallAnswer(data,redisPub));
    socket.on(ON_SIGNAL, (data) => handleCallSignal(data,redisPub));
    socket.on(ON_CALL_END, (data) => handleCallEnd(data,redisPub));
    socket.on(ON_CALL_NO_RESPONSE, (data) => handelNoResponse(data,redisPub));
    
  });
};

export default initChatServer;