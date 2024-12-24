import { ON_MESSAGE } from '@/contstant/chatEventConstant';
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




    return {handleSendMessage, socketRef};
}

export default useChatHook