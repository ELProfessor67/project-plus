import React, { useState, useEffect } from "react"
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
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";





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

const TableView = ({ project: projectsDetails }) => {
    const [project, setProject] = useState(null);
    const [expandedTask, setExpandedTask] = useState(null);
    useEffect(() => setProject(projectsDetails), [projectsDetails]);



   


    return (
        <div className="flex-1 overflow-auto">
            <Table className="border-collapse border rounded-md">
                <TableHeader className="border-b">
                    <TableRow>
                        <TableHead className="!w-[10px] border-r last:border-r-0 !p-1"></TableHead>
                        
                        <TableHead className="w-[300px] border-r last:border-r-0">Task</TableHead>
                        <TableHead className="border-r last:border-r-0">Member</TableHead>
                        <TableHead className="border-r last:border-r-0">Status</TableHead>
                        <TableHead className="border-r last:border-r-0">Due date</TableHead>
                        <TableHead className="border-r last:border-r-0">Priority</TableHead>
                        <TableHead className="border-r last:border-r-0">Last Date</TableHead>
                        <TableHead className="border-r last:border-r-0">Recondings</TableHead>
                        <TableHead className="border-r last:border-r-0">Emails</TableHead>
                        <TableHead>Last updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y">

                    {project?.Tasks?.map((task) => (
                        <>
                            <TableRow key={task.task_id}>
                                <TableCell className="!p-1 border-r last:border-r-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpandedTask(expandedTask === task.task_id ? null : task.task_id)}

                                    >
                                        {expandedTask === task.task_id ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TableCell>
                               
                                <TableCell className="border-r last:border-r-0 !p-1">{task.name}</TableCell>
                                <TableCell className="border-r last:border-r-0 !p-1 text-center">
                                    <RenderMembers members={task?.assignees} className="justify-center" />
                                </TableCell>
                                <TableCell className={`border-r last:border-r-0 !p-0 text-center text-white cursor-pointer ${statusColors[task.status]} relative group`}>
                                    <span className="fold-paper-effect group-hover:block hidden transition-all"></span>
                                    {statusLabel[task.status]}
                                </TableCell>
                                <TableCell className={`border-r last:border-r-0 !p-1 text-center ${task.status == "DONE" ? 'line-through' : ''}`}>{formatDate(task.created_at)}</TableCell>
                                <TableCell className={`border-r last:border-r-0 !p-1 text-white text-center ${priorityColor[task.priority]} relative cursor-pointer group`}>
                                    <span className="fold-paper-effect group-hover:block hidden transition-all"></span>
                                    {task.priority}
                                </TableCell>
                                <TableCell className="border-r last:border-r-0 !p-1 whitespace-pre text-center">{formatDate(task.last_date)}</TableCell>
                             
                                <TableCell className="border-r last:border-r-0 !p-1 whitespace-pre text-center">7</TableCell>
                                <TableCell className="border-r last:border-r-0 !p-1 whitespace-pre text-center">20</TableCell>
                                <TableCell className="whitespace-pre">{moment(task?.updated_at).fromNow()}</TableCell>
                            </TableRow>
                            {expandedTask === task.task_id && (
                                <TableRow>
                                    <TableCell colSpan={11} className="bg-muted/50">
                                        <div className="p-4" dangerouslySetInnerHTML={{ __html: task.description }}>
                                            
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default TableView