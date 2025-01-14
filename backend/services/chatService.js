import { ON_CALL, ON_CALL_ANSWER, ON_CALL_END, ON_CALL_NO_RESPONSE, ON_MESSAGE, ON_SIGNAL, REDIS_CHANNEL } from "../constants/chatEventConstant.js";
import { userSocketMap } from "../constants/userSocketMapConstant.js";
import { produceChat } from "./kafkaService.js";
import {prisma} from "../prisma/index.js";
import {RedisEvent} from "../constants/redisEventConstant.js"

export const handleDisconnect = (config) => {
    //delete user id user socket is map
    const user_id = config.user_id;
    userSocketMap.delete(user_id);
}


export const handleMessage = (data,redis) => {
    const publishData = {...data,sender_name: undefined,task_name: undefined};
    produceChat(publishData);

    const redisPublishData = {
        ...data,
        event: RedisEvent.onMessage
    }
    redis.publish(REDIS_CHANNEL,JSON.stringify(redisPublishData));
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

            //handle text message
            if(parseMessage.event == RedisEvent.onMessage){
                if(recieverSocketId){
                    io.to(recieverSocketId).emit(ON_MESSAGE,parseMessage);
                }
            }


            //hanle audio chat
            if(parseMessage.event == RedisEvent.onCall){
                if(recieverSocketId){
                    io.to(recieverSocketId).emit(ON_CALL,parseMessage);
                }
            }


            //hanle call answer 
            if(parseMessage.event == RedisEvent.onCallAnswer){
                console.log(parseMessage,'ssss');
                if(recieverSocketId){
                    io.to(recieverSocketId).emit(ON_CALL_ANSWER,parseMessage);
                }
            }


             //hanle call signal 
            if(parseMessage.event == RedisEvent.onSignal){
                if(recieverSocketId){
                    io.to(recieverSocketId).emit(ON_SIGNAL,parseMessage);
                }
            }

             //hanle call end 
            if(parseMessage.event == RedisEvent.onCallEnd){
                if(recieverSocketId){
                    io.to(recieverSocketId).emit(ON_CALL_END,parseMessage);
                }
            }


             //hanle timeout
             if(parseMessage.event == RedisEvent.onCallNoResponse){
                if(recieverSocketId){
                    io.to(recieverSocketId).emit(ON_CALL_NO_RESPONSE,parseMessage);
                }
            }
            
        }
    });
}






export const handleCall = async (data,redis) => {
    const publishData = {...data,sender_name: undefined,task_name: undefined};
    addChatMessage([publishData]);

    const redisPublishData = {
        ...data,
        event: RedisEvent.onCall
    }
    redis.publish(REDIS_CHANNEL,JSON.stringify(redisPublishData));
}


export const handleCallAnswer = async (data,redis) => {

    const updateMessage = {call_status: data.picked_up ? 'PROCESSING': 'REJECTED'};
    handleUpdateMessage(data.message_id,updateMessage);

    const redisPublishData = {
        ...data,
        event: RedisEvent.onCallAnswer
    }
    redis.publish(REDIS_CHANNEL,JSON.stringify(redisPublishData));
}



export const handleCallSignal = async (data,redis) => {
    const redisPublishData = {
        ...data,
        event: RedisEvent.onSignal
    }
    redis.publish(REDIS_CHANNEL,JSON.stringify(redisPublishData));
}


export const handleCallEnd = async (data,redis) => {
    const updateMessage = {duration: data.duration,call_status: 'ENDED'};
    handleUpdateMessage(data.message_id,updateMessage);

    const redisPublishData = {
        ...data,
        event: RedisEvent.onCallEnd
    }

    redis.publish(REDIS_CHANNEL,JSON.stringify(redisPublishData));
}



export const handelNoResponse = async (data,redis) => {
    const updateMessage = {call_status: 'NO_RESPONSE'};
    handleUpdateMessage(data.message_id,updateMessage);

    const redisPublishData = {
        ...data,
        event: RedisEvent.onCallNoResponse
    }
    redis.publish(REDIS_CHANNEL,JSON.stringify(redisPublishData));
}


export const handleUpdateMessage = async (message_id,data) => {
    try {
        await prisma.message.update({
            where: {
                message_id: message_id
            },
            data: data
        });
    } catch (error) {
        console.log(`getting an error during update message`,error.message)
    }
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