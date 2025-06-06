"use client"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Info,
    Plus,
    Search,
    Settings,
} from "lucide-react"
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import RenderMeeting from "@/components/RenderMeeting"
import CreateMeeting from "@/components/CreateMeeting"
import { getsMeetingRequest } from "@/lib/http/meeting"
import { useUser } from "@/providers/UserProvider"
import CreateMeetingClient from "@/components/CreateMeetingClient"




export default function Page() {
    const [createMeeting, setCreateMeeting] = useState(false);
    const [createMeetingClient, setCreateMeetingClient] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const { user } = useUser();

    const getMeetings = useCallback(async () => {

        try {
            const res = await getsMeetingRequest(false);

            setMeetings(res.data.meetings);
        } catch (error) {
            console.log(error?.response?.data?.message || error.message);
        }
    }, []);

    useEffect(() => {
        getMeetings();
    }, []);

    return (
        <>
            <div className="flex h-screen flex-col bg-secondary m-2 rounded-md overflow-y-auto">
                <div className="flex flex-col gap-4 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold text-foreground-primary">All Meetings</h1>
                            <Info className="h-4 w-4 text-foreground-secondary" />
                        </div>

                    </div>

                    {/* View Tabs */}
                    <Tabs defaultValue="all" className="w-full">
                        <div className="flex items-center justify-between">
                            <TabsList className="bg-secondary border border-primary">
                                <TabsTrigger value="all" className="data-[state=active]:bg-tbutton-bg data-[state=active]:text-tbutton-text">All</TabsTrigger>
                                <TabsTrigger value="created" className="data-[state=active]:bg-tbutton-bg data-[state=active]:text-tbutton-text">Created</TabsTrigger>
                                <TabsTrigger value="joined" className="data-[state=active]:bg-tbutton-bg data-[state=active]:text-tbutton-text">Joined</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-2">
                                {
                                    user?.Role != "CLIENT" &&
                                    <>
                                        <Button className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all" onClick={() => setCreateMeeting(true)}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            New Meet For Team
                                        </Button>
                                        <Button className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all" onClick={() => setCreateMeetingClient(true)}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            New Meet For Client
                                        </Button>
                                    </>
                                }

                                {/* <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input className="w-64 pl-8" placeholder="Search" />
                                </div> */}
                                <Select>
                                    <SelectTrigger className="w-[180px] bg-secondary border-primary text-foreground-primary">
                                        <SelectValue placeholder="Select a date" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-secondary border-primary">
                                        <SelectGroup>
                                            <SelectLabel className="text-foreground-secondary">Today</SelectLabel>
                                            <SelectItem value="apple" className="text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text">Yeaterday</SelectItem>
                                            <SelectItem value="banana" className="text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text">03-12-2024</SelectItem>
                                            <SelectItem value="blueberry" className="text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text">02-12-2024</SelectItem>
                                            <SelectItem value="grapes" className="text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text">01-12-2024</SelectItem>
                                            <SelectItem value="pineapple" className="text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text">31-11-2024</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <TabsContent value="all">
                            {
                                meetings.length > 0 &&
                                <RenderMeeting meetings={meetings} />
                            }
                            {
                                meetings.length == 0 &&
                                <div className="flex h-[500px] items-center justify-center text-foreground-secondary">
                                    Calendar view coming soon
                                </div>
                            }

                        </TabsContent>
                        <TabsContent value="created">
                            {
                                meetings?.filter(meeting => meeting.user_id == user?.user_id).length > 0 &&
                                <RenderMeeting meetings={meetings?.filter(meeting => meeting.user_id == user?.user_id)} />
                            }
                            {
                                meetings?.filter(meeting => meeting.user_id == user?.user_id).length == 0 &&
                                <div className="flex h-[500px] items-center justify-center text-foreground-secondary">
                                    Calendar view coming soon
                                </div>
                            }
                        </TabsContent>
                        <TabsContent value="joined">
                            {
                                meetings?.filter(meeting => meeting.user_id != user?.user_id).length > 0 &&
                                <RenderMeeting meetings={meetings?.filter(meeting => meeting.user_id != user?.user_id)} />
                            }
                            {
                                meetings?.filter(meeting => meeting.user_id != user?.user_id).length == 0 &&
                                <div className="flex h-[500px] items-center justify-center text-foreground-secondary">
                                    Calendar view coming soon
                                </div>
                            }
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <CreateMeeting open={createMeeting} onClose={() => setCreateMeeting(false)} isScheduled={false} getMeetings={getMeetings} />
            <CreateMeetingClient open={createMeetingClient} onClose={() => setCreateMeetingClient(false)} isScheduled={false} getMeetings={getMeetings} />
        </>
    )
}