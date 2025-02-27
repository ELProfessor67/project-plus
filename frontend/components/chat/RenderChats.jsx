import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarCompoment from '../AvatarCompoment';
import { Button } from '../Button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { useUser } from '@/providers/UserProvider';
import { Bell, ListTodo, PanelsTopLeft, Send, Video, Text, PhoneCall, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { getConversationIdRequest, getConversationRequest } from '@/lib/http/chat';
import moment from 'moment';
import { Skeleton } from "@/components/ui/skeleton"
import CallDialog from '../Dialogs/CallDialog';



const RenderChats = ({ selectedChat, setSelectTask, selectedTask, messages, setMessages, conversationId, setConversationId, handleSendMessage, socketRef, handleCall }) => {
    const [messageValue, setMessageValue] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const containerRef = useRef(null);


    const handleSend = useCallback(() => {
        // sender_id,reciever_id,content,conversation_id,content_type
        if(!messageValue) return
        const data = {
            sender_id: user.user_id,
            reciever_id: selectedChat.user_id,
            content: messageValue,
            conversation_id: conversationId,
            content_type: "PLAIN_TEXT",
            createdAt: new Date(Date.now()),
            sender_name: user?.name,
            task_name: selectedTask?.name
        }

        handleSendMessage(data);

        setMessages(prev => [...prev, data]);
        setMessageValue('');
    }, [messageValue, selectedChat, user, conversationId]);


    const getConversation = useCallback(async (user_id, task_id) => {
        setLoading(true);
        try {
            let res = await getConversationIdRequest({ task_id, user_id });
            const conversation_id = res.data.conversation_id;
            setConversationId(conversation_id);

            res = await getConversationRequest(conversation_id);
            setMessages(res.data.conversations);
        } catch (error) {
            console.log(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        if (selectedChat && selectedTask) {
            getConversation(selectedChat.user_id, selectedTask.task_id)
        }
    }, [selectedChat, selectedTask]);



    // Scroll to the bottom when messages are updated
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <>
            <div className="flex-1 flex flex-col relative">
                <div className="bg-white p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <AvatarCompoment name={selectedChat.name} />
                        <div>
                            <p className="font-medium">{selectedChat.name} - {selectedTask?.name}</p>
                            <p className="text-sm text-gray-500">{selectedChat.active_status}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleCall(selectedChat)} disabled={!conversationId}><PhoneCall className="h-5 w-5" /></Button>
                    </div>
                </div>
                <div className="h-[72vh]  overflow-y-auto p-2 space-y-4 overflow-x-hidden" ref={containerRef}>
                    {
                        loading &&
                        Array(8).fill(0).map((_, index) => (
                            <Skeleton className={`h-12 ${index & 1 ? 'ml-auto' : ''}`} style={{ width: `${200 + (index * 10)}px` }} />
                        ))
                    }
                    {
                        !loading && messages.length != 0 &&
                        messages.map((message) => (
                            <>
                                {
                                    message.sender_id == user?.user_id
                                        ?
                                        (
                                            <Card className="p-3 w-fit  bg-purple-500 ml-auto text-white px-7 flex-row mr-1 mb-2 !flex gap-2  items-center">
                                                {
                                                    message.content_type == "CALL" &&
                                                    <div className='flex items-center gap-5'>
                                                        <PhoneOutgoing />
                                                        <div>
                                                            <p className='break-words max-w-md text-xs text-muted uppercase'>Voice Call</p>
                                                            <p className='break-words max-w-md text-xs text-muted mt-1 text-white/70'>{message.call_status !== 'ENDED' ? message.call_status : message.duration}</p>
                                                        </div>
                                                    </div>
                                                }

                                                {
                                                    message.content_type == "PLAIN_TEXT" &&
                                                    <>
                                                        <p className='break-words max-w-md'>{message.content}</p>
                                                        <time className='text-white/70 text-xs font-normal'>{moment(message.createdAt).format("LT")}</time>
                                                    </>
                                                }


                                            </Card>
                                        )
                                        :
                                        (
                                            <Card className="p-3 w-fit px-7 flex-row mr-1 mb-2 !flex gap-2  items-center">
                                                {
                                                    message.content_type == "CALL" &&
                                                    <>
                                                        {
                                                            message.call_status != "NO_RESPONSE" &&
                                                            <div className='flex items-center gap-5'>
                                                                <PhoneIncoming />
                                                                <div>
                                                                    <p className='break-words max-w-md text-xs text-muted uppercase'>Voice Call</p>
                                                                    <p className='break-words max-w-md text-xs text-muted mt-1 text-black/70'>{message.call_status !== 'ENDED' ? message.call_status : message.duration}</p>
                                                                </div>
                                                            </div>
                                                        }

                                                        {
                                                            message.call_status == "NO_RESPONSE" &&
                                                            <div className='flex items-center gap-5 text-red-500 cursor-pointer' onClick={() => handleCall(selectedChat)}>
                                                                <PhoneIncoming />
                                                                <div>
                                                                    <p className='break-words max-w-md text-xs text-muted uppercase'>Voice Call</p>
                                                                    <p className='break-words max-w-md text-xs text-muted mt-1 text-red-500'>You Missed Call Click To Callback</p>
                                                                </div>
                                                            </div>
                                                        }
                                                    </>
                                                }

                                                {
                                                    message.content_type == "PLAIN_TEXT" &&
                                                    <>
                                                        <time className='text-gray-400 text-xs font-normal'>{moment(message.createdAt).format("LT")}</time>
                                                        <p className='break-words max-w-md'>{message.content}</p>
                                                    </>
                                                }
                                            </Card>
                                        )
                                }
                            </>

                        ))
                    }

                    {
                        !loading && messages.length == 0 &&
                        <div className='h-full w-full flex items-center justify-center'>
                            <img src='/assets/no-message.png'/>
                        </div>  
                    }
                </div>
                <div className="bg-white p-4 border-t">
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" className="bg-blue-500 hover:bg-blue-600 transition-all"><Text className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Projects</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {
                                        user && user?.Projects?.map(project => (
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    <PanelsTopLeft />
                                                    <span>{project.name}</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>

                                                        {
                                                            project?.Tasks?.map((task) => (
                                                                <DropdownMenuItem onClick={() => setSelectTask(task)}>

                                                                    <ListTodo />
                                                                    <span>{task.name}</span>
                                                                </DropdownMenuItem>
                                                            ))
                                                        }
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        ))
                                    }
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Input className="flex-1" placeholder="Type a message here" value={messageValue} onChange={(e) => setMessageValue(e.target.value)} />
                        <Button size="icon" className="bg-blue-500 hover:bg-blue-600 transition-all" onClick={handleSend}><Send className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default RenderChats