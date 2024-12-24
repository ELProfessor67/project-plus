import { PrismaClient } from "@prisma/client";
import { ON_MESSAGE, REDIS_CHANNEL } from "../constants/chatEventConstant.js";
import { userSocketMap } from "../constants/userSocketMapConstant.js";
import { produceChat } from "./kafkaService.js";
const prisma = new PrismaClient();

export const handleDisconnect = (config) => {
    //delete user id user socket is map
    const user_id = config.user_id;
    userSocketMap.delete(user_id);
}


export const handleMessage = (data,redis) => {
    const publishData = {...data,sender_name: undefined,task_name: undefined};
    produceChat(publishData);
    redis.publish(REDIS_CHANNEL,JSON.stringify(data));
}

export const initRedisSubcriber = (redis,io) => {
    redis.subscribe(REDIS_CHANNEL, (err, count) => {
        if (err) {
            console.error('Failed to subscribe:', err.message);
        } else {
            console.log(`Subscribed to ${count} channel(s).`);
        }
    });

    redis.on('message', (channel, message) => {
        if(channel == REDIS_CHANNEL){
            const parseMessage = JSON.parse(message);
            const reciever_id = parseMessage.reciever_id;
            const recieverSocketId = userSocketMap.get(reciever_id.toString());
            if(recieverSocketId){
                io.to(recieverSocketId).emit(ON_MESSAGE,parseMessage);
            }
        }
    });
}



export const addChatMessage = async (messages) => {
    try {
        await prisma.message.createMany({
            data: messages
        });
    } catch (error) {
        console.log('getting an error while save chats',error.message)
    }
}