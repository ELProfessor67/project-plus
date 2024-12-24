"use client"

import { useEffect, useCallback, useState } from "react"
import {
    Info,
    Menu,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getTaskByIdRequest } from "@/lib/http/task"
import RenderMembers from "@/components/RenderMembers"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { formatDate } from "@/utils/formatDate"
import moment from "moment"
import { Button } from "@/components/Button"
import TaskComments from "@/components/TaskComments"
import TaskEmails from "@/components/TaskEmails"
import TaskTranscibe from "@/components/TaskTranscribe"
import RenderProgress from "@/components/RenderProgress"
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import RenderChart from "@/components/RenderChart"
import RenderTaskProgress from "@/components/RenderTaskProgress"
import { getRecentDatesWithLabels } from "@/utils/getRecentDatesWithLabels"
import { calculateDaysAgo } from "@/utils/calculateDaysAgo"

const priorityColor = {
    "CRITICAL": "bg-red-950",
    "HIGH": "bg-orange-700",
    "MEDIUM": "bg-yellow-700",
    "LOW": "bg-green-700",
    "NONE": "bg-blue-300",
}


const statusColors = {
    "TO_DO": "bg-gray-400",
    "IN_PROGRESS": "bg-blue-400",
    "STUCK": "bg-yellow-400",
    "DONE": "bg-green-400",
}

const statusLabel = {
    "TO_DO": "TO DO",
    "IN_PROGRESS": "IN PROGRESS",
    "STUCK": "STUCK",
    "DONE": "DONE",
}

export default function Page({ params }) {
    const [task, setTask] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [openTranscribe, setOpenTranscribe] = useState(false);
    const [openEmails, setOpenEmails] = useState(false);
    const [opemComments, setOpenComments] = useState(false);
    const [progress, setProgress] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState(null);
    const [selectedComments, setSelectedComments] = useState(null);
    const [selectedTranscribtions, setSelectedTranscribtions] = useState(null);
    const [date,setDate] = useState(getRecentDatesWithLabels(5)[0].date);
    const [dates,setDates] = useState(getRecentDatesWithLabels(5));

    const getTaskById = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getTaskByIdRequest(params.id);
            setTask(res?.data?.task);
            const getDays = calculateDaysAgo(res.data.task.created_at);
            setDates(getRecentDatesWithLabels(getDays+1));
        } catch (error) {
            setProjects(null);
            console.log(error?.response?.data?.meesage || error?.meesage);
        } finally {
            setLoading(false);
        }
    }, [params.id]);


    useEffect(() => {
        getTaskById();
    }, []);

    const handleOpenSelectedMail = useCallback((mails) => {
        setSelectedEmails(mails);
        setOpenEmails(true);
    }, []);
    const handleOpenSelectedComments = useCallback((comments) => {
        setSelectedComments(comments);
        setOpenComments(true);
    }, []);
    const handleOpenSelectedTranscibtion = useCallback((transcribtion) => {
        setSelectedTranscribtions(transcribtion);
        setOpenTranscribe(true);
    }, []);


    return (
        <>
            <div className="flex h-screen flex-col bg-white m-2 rounded-md overflow-auto">
                <div className="flex flex-col gap-4 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl font-semibold">{task?.name}</h1>
                            <Info className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-between mx-5">
                                <RenderMembers members={task?.assignees || []} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button className={'text-white bg-blue-500 hover:bg-blue-600 ml-5'} onClick={() => { setOpenTranscribe(true); setSelectedTranscribtions(null) }}>
                                Transcibe
                                <span className="font-medium">{task?.Transcibtions?.length || 0}</span>
                            </Button>
                            <Button className={'text-white bg-blue-500 hover:bg-blue-600'} onClick={() => { setOpenEmails(true); setSelectedEmails(null) }}>
                                Email
                                <span className="font-medium">{task?.Emails?.length || 0}</span>
                            </Button>
                            <Button className={'text-white bg-blue-500 hover:bg-blue-600'} onClick={() => { setOpenComments(true); setSelectedComments(null) }}>
                                Comments
                                <span className="font-medium">{task?.Comments?.length || 0}</span>
                            </Button>
                        </div>
                    </div>

                    {/* description */}
                    <div className="px-1 py-2 font-light space-y-4" dangerouslySetInnerHTML={{ __html: task?.description }}></div>

                    <div className="my-10">
                        <Table className="border-collapse border rounded-md">
                            <TableHeader className="border-b">
                                <TableRow>
                                    <TableHead className="!w-[10px] border-r last:border-r-0">#</TableHead>

                                    <TableHead className="w-[300px] border-r last:border-r-0">Name</TableHead>
                                    <TableHead className="border-r last:border-r-0">Member</TableHead>
                                    <TableHead className="border-r last:border-r-0">Status</TableHead>
                                    <TableHead className="border-r last:border-r-0">Start Date</TableHead>
                                    <TableHead className="border-r last:border-r-0">Priority</TableHead>
                                    <TableHead className="border-r last:border-r-0">Last Date</TableHead>
                                    <TableHead>Last updated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y">
                                <TableRow key={task?.task_id}>
                                    <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                                        <Link href={`/dashboard/projects/tasks/${task?.task_id}`}>{1}</Link>
                                    </TableCell>

                                    <TableCell className="border-r last:border-r-0 !p-1 cursor-pointer" onClick={() => setSelectedTask(task)}>{task?.name}</TableCell>
                                    <TableCell className="border-r last:border-r-0 !p-1 text-center">
                                        <RenderMembers members={task?.assignees || []} className="justify-center" />
                                    </TableCell>
                                    <TableCell className={`border-r last:border-r-0 !p-0 text-center text-white cursor-pointer ${statusColors[task?.status]} relative group`}>
                                        <span className="fold-paper-effect group-hover:block hidden transition-all"></span>
                                        {statusLabel[task?.status]}
                                    </TableCell>
                                    <TableCell className={`border-r last:border-r-0 !p-1 text-center ${task?.status == "DONE" ? 'line-through' : ''}`}>{formatDate(task?.created_at)}</TableCell>
                                    <TableCell className={`border-r last:border-r-0 !p-1 text-white text-center ${priorityColor[task?.priority]} relative cursor-pointer group`}>
                                        <span className="fold-paper-effect group-hover:block hidden transition-all"></span>
                                        {task?.priority}
                                    </TableCell>
                                    <TableCell className="border-r last:border-r-0 !p-1 whitespace-pre text-center">{formatDate(task?.last_date)}</TableCell>
                                    <TableCell className="whitespace-pre">{moment(task?.updated_at).fromNow()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className=" mt-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h1 className="text-4xl font-semibold">{dates?.find(d => d.date == date)?.label?.toUpperCase()}</h1>
                                <Info className="h-4 w-4 text-gray-400" />
                            </div>
                            <Select onValueChange={(value) => setDate(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Dates</SelectLabel>
                                        {
                                            dates.map(date => (
                                                <SelectItem value={date.date} key={date.date}>{date.label}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* <RenderChart/> */}
                        <RenderTaskProgress task_id={params.id} date={date}/>
                    </div>
                </div>
            </div>

            <TaskComments open={opemComments} onClose={() => setOpenComments(false)} comments={selectedComments || task?.Comments} getTaskById={getTaskById} task={task} />
            <TaskEmails open={openEmails} onClose={() => setOpenEmails(false)} getTaskById={getTaskById} task={task} emails={selectedEmails || task?.Emails} />
            <TaskTranscibe open={openTranscribe} onClose={() => setOpenTranscribe(false)} transcribtions={selectedTranscribtions || task?.Transcibtions} task={task} getTaskById={getTaskById} />
        </>
    )
}