"use client"
import {useCallback, useEffect, useState} from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Info,
    Plus,
    Search,
    Settings,
} from "lucide-react"
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { constantMeeting } from "@/contstant/contantMeeting"
import RenderScheduleMeeting from "@/components/RenderScheduleMeeting"
import CreateMeeting from "@/components/CreateMeeting"
import { getsMeetingRequest } from "@/lib/http/meeting"
import { useUser } from "@/providers/UserProvider"




export default function Page() {
    const [createMeeting,setCreateMeeting] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const {user} = useUser();


    const getMeetings = useCallback(async () => {
       
        try {
            const res = await getsMeetingRequest(true);
          
            setMeetings(res.data.meetings);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
        }
    },[]);

    useEffect(() => {  
        getMeetings();
    },[])
    return (
        <>
            <div className="flex h-screen flex-col bg-white m-2 rounded-md overflow-y-auto">
                <div className="flex flex-col gap-4 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold">Schedule Meetings</h1>
                            <Info className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline">Customize</Button>
                        </div>
                    </div>

                    {/* View Tabs */}
                    <Tabs defaultValue="pending" className="w-full">
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="canceled">Canceled</TabsTrigger>
                                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-2">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setCreateMeeting(true)}>
                                    Schedule Meet
                                </Button>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input className="w-64 pl-8" placeholder="Search" />
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Today</SelectLabel>
                                            <SelectItem value="apple">Yeaterday</SelectItem>
                                            <SelectItem value="banana">03-12-2024</SelectItem>
                                            <SelectItem value="blueberry">02-12-2024</SelectItem>
                                            <SelectItem value="grapes">01-12-2024</SelectItem>
                                            <SelectItem value="pineapple">31-11-2024</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value="pending">
                            {
                                meetings?.filter(meeting => meeting.status == "PENDING").length > 0 &&
                                <RenderScheduleMeeting meetings={meetings?.filter(meeting => meeting.status == "PENDING")} />
                            }
                            {
                                meetings?.filter(meeting => meeting.status == "PENDING").length == 0 &&
                                <div className="flex h-[500px] items-center justify-center text-gray-500">
                                    Empty
                                </div>
                            }

                        </TabsContent>
                        <TabsContent value="canceled">
                            {
                                meetings?.filter(meeting => meeting.status == "CANCELED").length > 0 &&
                                <RenderScheduleMeeting meetings={meetings?.filter(meeting => meeting.status == "CANCELED")} />
                            }
                            {
                                meetings?.filter(meeting => meeting.status == "CANCELED").length == 0 &&
                                <div className="flex h-[500px] items-center justify-center text-gray-500">
                                    Empty
                                </div>
                            }
                        </TabsContent>
                        <TabsContent value="scheduled">
                            {
                                meetings?.filter(meeting => meeting.status == "SCHEDULED").length > 0 &&
                                <RenderScheduleMeeting meetings={meetings?.filter(meeting => meeting.status == "SCHEDULED")} />
                            }
                            {
                                meetings?.filter(meeting => meeting.status == "SCHEDULED").length == 0 &&
                                <div className="flex h-[500px] items-center justify-center text-gray-500">
                                    Empty
                                </div>
                            }
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <CreateMeeting open={createMeeting} onClose={() => setCreateMeeting(false)} isScheduled={true} getMeetings={getMeetings}/>
        </>
    )
}