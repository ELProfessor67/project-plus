'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, MessageCircle, Moon, PenSquare, Search, Users } from 'lucide-react'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getChatUserRequest, getConversationUserRequest } from "@/lib/http/chat"
import { useUser } from "@/providers/UserProvider"
import RenderUserComponent from "@/components/chat/RenderUserComponent"
import RenderChats from "@/components/chat/RenderChats"
import useChatHook from "@/hooks/useChatHook"
import { toast } from "react-toastify"
import { ON_CALL, ON_MESSAGE } from "@/contstant/chatEventConstant"
import CallDialog from "@/components/Dialogs/CallDialog"

export default function Page() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [users, setUser] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const [searchLoading,setSearchLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectTask] = useState({task_id: -1, name:"Common Chat"});
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const { handleSendMessage, handleCall, handleCallAnswer, handleSendSignal, handleCallEnd, handelNoResponse, socketRef } = useChatHook();
  const [currentCallUser, setCurrentCallUser] = useState(null);
  const [isCallByMe, setIsCallByMe] = useState(true);
  const [callMessageId, setCallMessageId] = useState(null);
  const audioRef = useRef();
  const currentCallUserRef = useRef(null);
  const debounceRef = useRef();

  const handleQueryUser = useCallback(async () => {
    setSearchLoading(true);
    try {
        const res = await getChatUserRequest(query);
        setSearchUser(res.data.users);
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
    }finally{
      setSearchLoading(false)
    }
  },[query]);

  useEffect(() => {
    if(!query) return;

    debounceRef.current = setTimeout(handleQueryUser,1000);
    return () => {
      clearTimeout(debounceRef.current)
    }
  },[query]);

  useEffect(() => {
    currentCallUserRef.current = currentCallUser;
  },[currentCallUser]);

  const handleSetCall = useCallback((user) => {
    setCurrentCallUser(user);
    setIsCallByMe(true);
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new window.Audio('/ding.mp3');
    }
  }, [])

  // useEffect(() => {
  //   if (user) {
  //     const firstTask = user.Projects[0]?.Tasks[0];
  //     setSelectTask(firstTask);
  //   }
  // }, [user]);


  const getAllChatUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getConversationUserRequest();
      setUser(res.data.users);
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    getAllChatUser();
  }, []);


  const handleSelectChat = useCallback((user) => {
    setSelectedChat(user);
  }, []);




  const handleMessageRecive = useCallback((data) => {
    if (selectedChat?.user_id == data.sender_id && data.conversation_id == conversationId) {
      setMessages(prev => [...prev, data]);
    } else {
      audioRef.current?.play();
      toast.info(`${data.sender_name}: ${data.content} \n task: ${data.task_name}`);
    }
  }, [selectedChat, conversationId]);


  const handleRecieveCall = useCallback((data) => {
    // penfing line busy 
    // if (currentCallUserRef.current) {
    //   const data = {
    //     message_id: data.message_id,
    //     picked_up: false,
    //     sender_id: user.user_id,
    //     reciever_id: data.sender_id,
    //     line_busy: true
    //   }
    //   handleCallAnswer(data);
    //   return
    // }

    const user = {
      name: data.sender_name,
      user_id: data.sender_id,
      conversation_id: data.conversation_id
    }

    setCallMessageId(data.message_id);
    setCurrentCallUser(user);
    setMessages(prev => [...prev, data]);
    setIsCallByMe(false);
  }, [currentCallUserRef.current]);


  //subscribe on message event
  useEffect(() => {
    socketRef?.current?.on(ON_MESSAGE, handleMessageRecive);
    socketRef?.current?.on(ON_CALL, handleRecieveCall);

    return () => {
      socketRef?.current.off(ON_MESSAGE, handleMessageRecive);
      socketRef?.current.off(ON_CALL, handleRecieveCall);
    }
  }, [conversationId, socketRef.current]);



  return (
    <>
      <div className="flex flex-col h-[calc(100vh-5rem)] md:flex-row bg-secondary m-2 rounded-md relative">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-secondary p-4 border-r border-primary">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground-primary">Users</h1>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-3 h-4 w-4 text-foreground-secondary" />
            <Input 
              className="pl-8 focus:ring-accent-hover border-gray-300 rounded focus:border-accent" 
              placeholder="Search" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
          </div>
          <div className="space-y-2 overflow-auto h-[85%]">
            {
              loading && 
              [1,2,3,4,5,6,7].map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-secondary-hover rounded-lg py-10 px-2">
                </div>
              ))
            }
            <RenderUserComponent 
              searchLoading={searchLoading} 
              users={users} 
              searchUser={searchUser} 
              handleSelectChat={handleSelectChat} 
              query={query} 
              setUser={setUser} 
              setQuery={setQuery}
            />
          </div>
        </div>

        {/* Main Chat */}
        {
          selectedChat &&
          <RenderChats 
            selectedChat={selectedChat} 
            setSelectTask={setSelectTask} 
            selectedTask={selectedTask} 
            handleSendMessage={handleSendMessage} 
            socketRef={socketRef} 
            messages={messages} 
            setMessages={setMessages} 
            conversationId={conversationId} 
            setConversationId={setConversationId} 
            handleCall={handleSetCall} 
          />
        }

        {
          !selectedChat &&
          <div className="flex-1 flex items-center justify-center bg-secondary-hover">
            <img src="/assets/Internet-Chat-Rooms.svg" alt="Chat illustration" />
          </div>
        }
      </div>

      {
        currentCallUser &&
        <CallDialog 
          setCurrentCallUser={setCurrentCallUser} 
          handelNoResponse={handelNoResponse} 
          setIsCallByMe={setIsCallByMe} 
          setCallMessageId={setCallMessageId} 
          callMessageId={callMessageId} 
          handleCallAnswer={handleCallAnswer} 
          currentCallUser={currentCallUser} 
          isCallByMe={isCallByMe} 
          conversationId={conversationId} 
          socketRef={socketRef} 
          handleCall={handleCall} 
          selectedTask={selectedTask} 
          setMessages={setMessages} 
          handleSendSignal={handleSendSignal} 
          handleCallEnd={handleCallEnd} 
        />
      }
    </>
  )
}
