
'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, MessageCircle, Moon, PenSquare, Search, Users } from 'lucide-react'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getChatUserRequest } from "@/lib/http/chat"
import { useUser } from "@/providers/UserProvider"
import RenderUserComponent from "@/components/chat/RenderUserComponent"
import RenderChats from "@/components/chat/RenderChats"
import useChatHook from "@/hooks/useChatHook"
import { toast } from "react-toastify"
import { ON_MESSAGE } from "@/contstant/chatEventConstant"

export default function Page() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [users, setUser] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectTask] = useState(null);
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const { handleSendMessage, socketRef } = useChatHook();
  const audioRef = useRef();
  const filterUser = useMemo(() => users.filter(user => (user.name.toLowerCase().includes(query.toLowerCase())) || user.email.toLowerCase().includes(query.toLowerCase())), [query, users]);



  useEffect(() => {
    if(typeof window !== 'undefined'){
      audioRef.current = new window.Audio('/ding.mp3');
    }
  },[])

  useEffect(() => {
    if (user) {
      const firstTask = user.Projects[0]?.Tasks[0];
      setSelectTask(firstTask);
    }
  }, [user]);


  const getAllChatUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getChatUserRequest();
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


  //subscribe on message event
  useEffect(() => {
    socketRef?.current?.on(ON_MESSAGE, handleMessageRecive);

    return () => {
      socketRef?.current.off(ON_MESSAGE, handleMessageRecive);
    }
  }, [conversationId,socketRef.current]);



  return (
    <div className="flex flex-col h-screen  md:flex-row bg-white m-2 rounded-md relative">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white p-4 border-r">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Moon className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><PenSquare className="h-5 w-5" /></Button>
          </div>
        </div>
        {/* <div className="flex items-center space-x-2 mb-4">
          <Button variant="secondary" className="w-full justify-start">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chats
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </Button>
        </div> */}
        <div className="relative mb-4">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input className="pl-8" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="space-y-2">
          <RenderUserComponent users={filterUser} handleSelectChat={handleSelectChat} />
        </div>
      </div>

      {/* Main Chat */}
      {
        selectedChat &&
        <RenderChats selectedChat={selectedChat} setSelectTask={setSelectTask} selectedTask={selectedTask} handleSendMessage={handleSendMessage} socketRef={socketRef} messages={messages} setMessages={setMessages} conversationId={conversationId} setConversationId={setConversationId} />
      }

      {
        !selectedChat &&
        <div className="flex-1 flex items-center justify-center bg-gray-200">
          <img src="/assets/Internet-Chat-Rooms.svg" />
        </div>
      }
    </div>
  )
}
