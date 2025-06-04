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
                <div className="bg-secondary p-4 border-b border-primary flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <AvatarCompoment name={selectedChat.name} />
                        <div>
                            <p className="font-medium text-foreground-primary">{selectedChat.name} - {selectedTask?.name}</p>
                            <p className="text-sm text-foreground-secondary">{selectedChat.active_status}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleCall(selectedChat)} 
                            disabled={!conversationId}
                            className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text cursor-pointer"
                        >
                            <PhoneCall className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div className="h-[72vh] overflow-y-auto p-2 space-y-4 overflow-x-hidden bg-secondary" ref={containerRef}>
                    {
                        loading &&
                        Array(8).fill(0).map((_, index) => (
                            <Skeleton key={index} className={`h-12 ${index & 1 ? 'ml-auto' : ''}`} style={{ width: `${200 + (index * 10)}px` }} />
                        ))
                    }
                    {
                        !loading && messages.length != 0 &&
                        messages.map((message, index) => (
                            <React.Fragment key={index}>
                                {
                                    message.sender_id == user?.user_id
                                        ?
                                        (
                                            <Card className="p-3 w-fit bg-tbutton-bg ml-auto text-tbutton-text px-7 flex-row mr-1 mb-2 !flex gap-2 items-center">
                                                {
                                                    message.content_type == "CALL" &&
                                                    <div className='flex items-center gap-5'>
                                                        <PhoneOutgoing />
                                                        <div>
                                                            <p className='break-words max-w-md text-xs text-tbutton-text/80 uppercase'>Voice Call</p>
                                                            <p className='break-words max-w-md text-xs text-tbutton-text/70 mt-1'>{message.call_status !== 'ENDED' ? message.call_status : message.duration}</p>
                                                        </div>
                                                    </div>
                                                }

                                                {
                                                    message.content_type == "PLAIN_TEXT" &&
                                                    <>
                                                        <p className='break-words max-w-md'>{message.content}</p>
                                                        <time className='text-tbutton-text/70 text-xs font-normal'>{moment(message.createdAt).format("LT")}</time>
                                                    </>
                                                }
                                            </Card>
                                        )
                                        :
                                        (
                                            <Card className="p-3 w-fit px-7 flex-row mr-1 mb-2 !flex gap-2 items-center bg-secondary-hover">
                                                {
                                                    message.content_type == "CALL" &&
                                                    <>
                                                        {
                                                            message.call_status != "NO_RESPONSE" &&
                                                            <div className='flex items-center gap-5'>
                                                                <PhoneIncoming className="text-foreground-primary" />
                                                                <div>
                                                                    <p className='break-words max-w-md text-xs text-foreground-secondary uppercase'>Voice Call</p>
                                                                    <p className='break-words max-w-md text-xs text-foreground-secondary mt-1'>{message.call_status !== 'ENDED' ? message.call_status : message.duration}</p>
                                                                </div>
                                                            </div>
                                                        }

                                                        {
                                                            message.call_status == "NO_RESPONSE" &&
                                                            <div className='flex items-center gap-5 text-red-500 cursor-pointer hover:text-red-600' onClick={() => handleCall(selectedChat)}>
                                                                <PhoneIncoming />
                                                                <div>
                                                                    <p className='break-words max-w-md text-xs uppercase'>Voice Call</p>
                                                                    <p className='break-words max-w-md text-xs mt-1'>You Missed Call Click To Callback</p>
                                                                </div>
                                                            </div>
                                                        }
                                                    </>
                                                }

                                                {
                                                    message.content_type == "PLAIN_TEXT" &&
                                                    <>
                                                        <time className='text-foreground-secondary text-xs font-normal'>{moment(message.createdAt).format("LT")}</time>
                                                        <p className='break-words max-w-md text-foreground-primary'>{message.content}</p>
                                                    </>
                                                }
                                            </Card>
                                        )
                                }
                            </React.Fragment>
                        ))
                    }

                    {
                        !loading && messages.length == 0 &&
                        <div className='h-full w-full flex items-center justify-center'>
                            <img src='/assets/no-message.png' alt="No messages" />
                        </div>  
                    }
                </div>
                <div className="bg-secondary p-4 border-t border-primary">
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    size="icon" 
                                    className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all"
                                >
                                    <Text className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-secondary border-primary">
                                <DropdownMenuLabel className="text-foreground-primary">Projects</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {
                                        user && user?.Projects?.map(project => (
                                            <DropdownMenuSub key={project.project_id}>
                                                <DropdownMenuSubTrigger className="text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text">
                                                    <PanelsTopLeft className="mr-2 h-4 w-4" />
                                                    <span>{project.name}</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent className="bg-secondary border-primary">
                                                        {
                                                            project?.Tasks?.map((task) => (
                                                                <DropdownMenuItem 
                                                                    key={task.task_id}
                                                                    onClick={() => setSelectTask(task)}
                                                                    className="text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text"
                                                                >
                                                                    <ListTodo className="mr-2 h-4 w-4" />
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
                        <Input 
                            className="flex-1 bg-secondary text-foreground-primary border-primary focus:ring-accent-hover focus:border-accent" 
                            placeholder="Type a message here" 
                            value={messageValue} 
                            onChange={(e) => setMessageValue(e.target.value)} 
                        />
                        <Button 
                            size="icon" 
                            className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all" 
                            onClick={handleSend}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default RenderChats