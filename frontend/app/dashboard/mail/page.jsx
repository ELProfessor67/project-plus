"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArchiveRestore,
    ArrowLeftToLine,
    ArrowRightToLine,
    Delete,
    Forward,
    Info,
    MoveLeft,
    Plus,
    Search,
    Settings,
    Trash,
    Trash2,
    UndoDot,
} from "lucide-react"
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { constantMeeting } from "@/contstant/contantMeeting"
import RenderMail from "@/components/RenderMail"
import { constantMails } from "@/contstant/constantMail"
import AvatarCompoment from "@/components/AvatarCompoment"
import moment from "moment"
import SendMail from "@/components/SendMail"
import { getTaskEmailRequest } from "@/lib/http/task"
import { useUser } from "@/providers/UserProvider"
import { getRecentDatesWithLabels } from "@/utils/getRecentDatesWithLabels"
import SendMailClient from "@/components/SendMailClient"





export default function Page() {
    const [sendMail, setSendMail] = useState(false);
    const [sendMailClient, setSendMailClient] = useState(false);
    const [selectedMail, setSelectedMail] = useState(null);
    const [mails, setMails] = useState([]);
    const [date, setDate] = useState(null);
    const [dates, setDates] = useState(getRecentDatesWithLabels(100));
    const { user } = useUser();



    const getAllMail = useCallback(async () => {
        try {
            const res = await getTaskEmailRequest(date);
            setMails(res?.data?.emails);
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
        }
    }, [date]);

    useEffect(() => {
        getAllMail();
    }, [date]);


    return (
        <>
            {
                selectedMail &&
                <div className="flex h-screen flex-col bg-secondary m-2 rounded-md overflow-y-auto items-start p-8">
                    <div className="flex items-center justify-between w-full">
                        <Button variant="ghost" className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text" onClick={() => setSelectedMail(null)}>
                            <MoveLeft size={40} />
                        </Button>

                        <div className="flex items-center gap-4">
                            <Button size='icon' variant='ghost' className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">
                                <ArrowLeftToLine />
                            </Button>
                            <Button size='icon' variant='ghost' className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">
                                <UndoDot />
                            </Button>
                            <Button size='icon' variant='ghost' className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">
                                <ArrowRightToLine />
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant='ghost' className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">
                                <ArchiveRestore />
                                Move To...
                            </Button>
                            <Button size='icon' variant='ghost' className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">
                                <Trash2 />
                            </Button>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mt-8 w-full'>
                        <div className='flex items-center gap-2'>
                            <AvatarCompoment name={selectedMail?.user.name} />
                            <h3 className='text-foreground-primary text-md font-medium'>{selectedMail?.user.name}</h3>
                        </div>
                        <time className='text-foreground-secondary text-sm'>{moment(selectedMail?.created_at).format("MM MMM YYYY")}</time>
                    </div>
                    <h2 className="mt-8 text-3xl text-foreground-primary font-medium">{selectedMail?.subject?.toUpperCase()}</h2>
                    <p className='text-foreground-secondary leading-5 mt-5 ml-2 text-lg'>{selectedMail?.content}</p>
                </div>
            }
            {
                selectedMail == null &&
                <div className="flex h-screen flex-col bg-secondary m-2 rounded-md overflow-y-auto">
                    <div className="flex flex-col gap-4 p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold text-foreground-primary">All Mails</h1>
                                <Info className="h-4 w-4 text-foreground-secondary" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">
                                    <Settings className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" className="border-primary text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">Customize</Button>
                            </div>
                        </div>

                        {/* View Tabs */}
                        <Tabs defaultValue="all" className="w-full">
                            <div className="flex items-center justify-between">
                                <TabsList className="bg-secondary border border-primary">
                                    <TabsTrigger value="all" className="data-[state=active]:bg-tbutton-bg data-[state=active]:text-tbutton-text">All</TabsTrigger>
                                    <TabsTrigger value="inbox" className="data-[state=active]:bg-tbutton-bg data-[state=active]:text-tbutton-text">Inbox</TabsTrigger>
                                    <TabsTrigger value="outbox" className="data-[state=active]:bg-tbutton-bg data-[state=active]:text-tbutton-text">Outbox</TabsTrigger>
                                </TabsList>
                                <div className="flex items-center gap-2">
                                    {
                                        user?.Role != "CLIENT" &&
                                        <>
                                            <Button 
                                                className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all" 
                                                onClick={() => setSendMail(true)}
                                            >
                                                <Plus className="mr-0 h-4 w-4" />
                                                Send Mail To Team
                                            </Button>
                                            <Button 
                                                className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all" 
                                                onClick={() => setSendMailClient(true)}
                                            >
                                                <Plus className="mr-0 h-4 w-4" />
                                                Send Mail To Client
                                            </Button>
                                        </>
                                    }

                                    {
                                        user?.Role == "CLIENT" &&
                                        <>
                                            <Button 
                                                className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all" 
                                                onClick={() => setSendMailClient(true)}
                                            >
                                                <Plus className="mr-0 h-4 w-4" />
                                                Send Mail
                                            </Button>
                                        </>
                                    }

                                    <Select onValueChange={(value) => setDate(value)}>
                                        <SelectTrigger className="w-[180px] bg-white border-primary text-black">
                                            <SelectValue placeholder="Select a date" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-primary">
                                            <SelectGroup>
                                                <SelectLabel className="text-gray-400">Today</SelectLabel>
                                                <SelectItem value={null} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">ALL</SelectItem>
                                                {
                                                    dates.map(date => (
                                                        <SelectItem 
                                                            value={date.date} 
                                                            key={date.date}
                                                            className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text"
                                                        >
                                                            {date.label}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <TabsContent value="all">
                                {
                                    mails.length > 0 &&
                                    <RenderMail selectedMail={selectedMail} setSelectedMail={setSelectedMail} mails={mails} />
                                }
                                {
                                    mails.length == 0 &&
                                    <div className="flex h-[500px] items-center justify-center text-foreground-secondary">
                                        No Mails
                                    </div>
                                }
                            </TabsContent>
                            <TabsContent value="inbox">
                                {
                                    mails?.filter(m => m.to_user == user?.user_id).length > 0 &&
                                    <RenderMail selectedMail={selectedMail} setSelectedMail={setSelectedMail} mails={mails?.filter(m => m.to_user == user?.user_id)} />
                                }
                                {
                                    mails?.filter(m => m.to_user == user?.user_id).length == 0 &&
                                    <div className="flex h-[500px] items-center justify-center text-foreground-secondary">
                                        No Mails
                                    </div>
                                }
                            </TabsContent>
                            <TabsContent value="outbox">
                                {
                                    mails?.filter(m => m.user_id == user?.user_id).length > 0 &&
                                    <RenderMail selectedMail={selectedMail} setSelectedMail={setSelectedMail} mails={mails?.filter(m => m.user_id == user?.user_id)} />
                                }
                                {
                                    mails?.filter(m => m.user_id == user?.user_id).length == 0 &&
                                    <div className="flex h-[500px] items-center justify-center text-foreground-secondary">
                                        No Mails
                                    </div>
                                }
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            }

            <SendMail open={sendMail} onClose={() => setSendMail(false)} getAllMail={getAllMail} />
            <SendMailClient open={sendMailClient} onClose={() => setSendMailClient(false)} getAllMail={getAllMail} />
        </>
    )
}