import React, { useState, useEffect, useCallback, useRef } from "react"
import moment from 'moment';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/utils/formatDate"
import RenderMembers from "./RenderMembers";
import Link from "next/link";
import { getColorByFirstLetter } from "@/utils/getColorByFirstLetter";
import { toast } from "react-toastify";
import { updateTaskRequest } from "@/lib/http/task";





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


const priorityColor = {
    "CRITICAL": "bg-red-950",
    "HIGH": "bg-orange-700",
    "MEDIUM": "bg-yellow-700",
    "LOW": "bg-green-700",
    "NONE": "bg-blue-300",
}

const TableView = ({ project: projectsDetails,reloadProject }) => {
    const [project, setProject] = useState(null);
    useEffect(() => setProject(projectsDetails), [projectsDetails]);
    

    const [statusClickPosition, setStatusClickPosition] = useState(null);
    const [selectedStatusTask, setSelectedStatusTask] = useState(null);
    const [showStatusBox, setShowStatusBox] = useState(false);
    const statusBoxRef = useRef(null);


    const handleStatusChange = useCallback((e, task) => {
        e.stopPropagation();
        const { clientX, clientY } = e;
        setStatusClickPosition({ x: clientX, y: clientY });
        setSelectedStatusTask(task);
        setShowStatusBox(true);
    }, []);

    const handleOutClick = useCallback((e) => {
        if (statusBoxRef.current && !statusBoxRef.current.contains(e.target)) {
            setShowStatusBox(false);
        }
    }, []);


    const handleStatusUpdate = useCallback(async (task,status) => {
        try {
            const res = await updateTaskRequest({status},task.task_id);
            if(reloadProject) await reloadProject();
            toast.success("Status Update Successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    },[]);

    useEffect(() => {
        if (showStatusBox) {
            document.addEventListener('click', handleOutClick);
        } else {
            document.removeEventListener('click', handleOutClick);
        }

        return () => {
            document.removeEventListener('click', handleOutClick);
        };
    }, [showStatusBox, handleOutClick]);

    return (
        <>
            <div className="flex-1 overflow-auto">
                <Table className="border-collapse border rounded-md">
                    <TableHeader className="border-b">
                        <TableRow>
                            <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                            <TableHead className="w-[300px] border-r last:border-r-0">Task Name</TableHead>
                            <TableHead className="border-r last:border-r-0">Member</TableHead>
                            <TableHead className="border-r last:border-r-0">Status</TableHead>
                            <TableHead className="border-r last:border-r-0">Start Date</TableHead>
                            <TableHead className="border-r last:border-r-0">Priority</TableHead>
                            <TableHead className="border-r last:border-r-0">Last Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">

                        {project?.Tasks?.map((task,index) => (
                            <>

                                <TableRow key={task.task_id}>
                                    <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                                        <Link href={`/dashboard/projects/tasks/${task.task_id}`}>Task {index + 1}</Link>
                                    </TableCell>

                                    <TableCell className={`border-r last:border-r-0 !p-0 text-center text-white cursor-pointer relative group`} style={{background: getColorByFirstLetter(task.name)}}>
                                        <span className="fold-paper-effect group-hover:block hidden transition-all"></span>
                                        {task.name?.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="border-r last:border-r-0 !p-1 text-center">
                                        <RenderMembers members={task?.assignees} className="justify-center" />
                                    </TableCell>
                                    <TableCell className={`border-r last:border-r-0 !p-0 text-center text-white cursor-pointer ${statusColors[task.status]} relative group`} onClick={(e) => handleStatusChange(e,task)}>
                                        <span className={`fold-paper-effect group-hover:block transition-all hidden`}></span>
                                        {statusLabel[task.status]}
                                    </TableCell>
                                    <TableCell className={`border-r last:border-r-0 !p-1 text-center ${task.status == "DONE" ? 'line-through' : ''}`}>{formatDate(task.created_at)}</TableCell>
                                    <TableCell className={`border-r last:border-r-0 !p-1 text-white text-center ${priorityColor[task.priority]} relative cursor-pointer group`}>
                                        <span className="fold-paper-effect group-hover:block hidden transition-all"></span>
                                        {task.priority}
                                    </TableCell>
                                    <TableCell className="border-r last:border-r-0 !p-1 whitespace-pre text-center">{formatDate(task.last_date)}</TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            {showStatusBox && statusClickPosition && (
                <div 
                    ref={statusBoxRef}
                    style={{
                        position: 'absolute',
                        left: statusClickPosition.x - 80,
                        top: statusClickPosition.y,
                    }}
                    className="w-[10rem] rounded-none p-1 shadow-md bg-white"
                >
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-white"></div>
                    <div className="w-full relative space-y-1">
                        {
                            Object.keys(statusColors).map((key) => (
                                <button className={`w-full flex items-center justify-center py-2 text-white cursor-pointer ${statusColors[key]} relative group`} onClick={() => handleStatusUpdate(selectedStatusTask,key)}>
                                    <span className={`fold-paper-effect group-hover:block transition-all hidden`}></span>
                                    {statusLabel[key]}
                                </button>
                            ))
                        }
                        
                    </div>
                </div>
            )}

            
        </>
    )
}

export default TableView