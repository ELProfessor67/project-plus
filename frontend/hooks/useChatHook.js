import { ON_CALL, ON_CALL_ANSWER, ON_CALL_END, ON_CALL_NO_RESPONSE, ON_MESSAGE, ON_SIGNAL } from '@/contstant/chatEventConstant';
import { useUser } from '@/providers/UserProvider';
import { useCallback, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

const useChatHook = () => {
    const socketRef = useRef(null);
    const { user } = useUser();


    useEffect(() => {
        if(socketRef.current && socketRef.current.connected) return;
        if(user){
            socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                query: {
                    user_id: user.user_id
                }
            });
        }
    },[user]);


    const handleSendMessage = useCallback((data) => {
        // sender_id,reciever_id,content,conversation_id,content_type
        if(socketRef.current &&  socketRef.current.connected){
            socketRef.current.emit(ON_MESSAGE, data);
        }
    },[socketRef.current]);


    const handleCall = useCallback((data) => {
        if(socketRef.current &&  socketRef.current.connected){
            socketRef.current.emit(ON_CALL, data);
        }
    },[]);


    const handleCallAnswer = useCallback((data) => {
        if(socketRef.current &&  socketRef.current.connected){
            socketRef.current.emit(ON_CALL_ANSWER, data);
        }
    },[]);


    const handleSendSignal = useCallback((data) => {
        if(socketRef.current &&  socketRef.current.connected){
            socketRef.current.emit(ON_SIGNAL, data);
        }
    },[]);



    const handleCallEnd = useCallback((data) => {
        if(socketRef.current &&  socketRef.current.connected){
            socketRef.current.emit(ON_CALL_END, data);
        }
    },[]);


    const handelNoResponse = useCallback((data) => {
        if(socketRef.current &&  socketRef.current.connected){
            socketRef.current.emit(ON_CALL_NO_RESPONSE, data);
        }
    },[]);

    return {handleSendMessage, handleCall,handleCallAnswer,handleSendSignal, handleCallEnd, handelNoResponse,socketRef};
}

export default useChatHook