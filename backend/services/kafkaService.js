import { Kafka,Partitioners } from "kafkajs";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { addTranscibtion } from "./transcriveService.js";
import { addChatMessage } from "./chatService.js";
dotenv.config();
const __dirname = path.resolve();

const kafka = new Kafka({
    clientId: 'api-service',
    brokers: [process.env.KAFKA_BROKER],
    ssl: {
        ca: fs.readFileSync(path.join(__dirname,'kafka.pem'),'utf-8')
    },
    sasl: {
        username: process.env.KAFKA_USER,
        password: process.env.KAFKA_PASS,
        mechanism: 'plain'
    }
});

let transcibtionProducer = null;
let chatProducer = null;


let transcibtionConsumer = null;
let chatConsumer = null;


//transcibtion array
let transcriptions = [];
let chatMessages = [];

export const getProducer = async () => {
    if(transcibtionProducer) return transcibtionProducer;
    transcibtionProducer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner
    });
    await transcibtionProducer.connect();
    return transcibtionProducer;
}


export const produceTranscribtion = async (message) => {
    const producer = await getProducer();
    await producer.send({topic: "transcribtion", messages: [{key: "transcibtion",value: JSON.stringify(message)}]});
}


export const produceChat = async (message) => {
    const producer = await getProducer();
    await producer.send({topic: "chat", messages: [{key: "chat",value: JSON.stringify(message)}]});
}


export const initTransciptConsumer = async () => {
    if(transcibtionConsumer) return;
    transcibtionConsumer = kafka.consumer({groupId: "transcript-consumer"});
    transcibtionConsumer.connect();
    transcibtionConsumer.subscribe({topics: ["transcribtion"]});

    await transcibtionConsumer.run({
        eachBatch: async ({batch,heartbeat,commitOffsetsIfNecessary,resolveOffset}) => {
            const messages = batch.messages;
            for (const message of messages){
                const messageValue = message.value.toString();
                const value = JSON.parse(messageValue);
                transcriptions.push(value);
            }
        }
    })
}




export const initChatConsumer = async () => {
    if(chatConsumer) return;
    chatConsumer = kafka.consumer({groupId: "chat-consumer"});
    chatConsumer.connect();
    chatConsumer.subscribe({topics: ["chat"]});

    await chatConsumer.run({
        eachBatch: async ({batch,heartbeat,commitOffsetsIfNecessary,resolveOffset}) => {
            const messages  = batch.messages;
            for (const message of messages){
                if(message.value){
                    const messageValue = message.value.toString();
                    const value = JSON.parse(messageValue);
                    chatMessages.push(value);
                }
            }
        }
    })
}


export const flushTranscribtion = async () => {
    if(transcriptions.length != 0){
        const transcibtionsCopy = [...transcriptions];
        transcriptions.length = 0;
        await addTranscibtion(transcibtionsCopy);
        console.log(`${transcibtionsCopy.length} Transcibtion Flushed`);
    }


    if(chatMessages.length != 0){
        const messagesCopy = [...chatMessages];
        chatMessages.length = 0;
        await addChatMessage(messagesCopy);
        console.log(`${messagesCopy.length} chat message Flushed`);
    }

    
}

//flush
let intervalRef = setInterval(flushTranscribtion,10000);

