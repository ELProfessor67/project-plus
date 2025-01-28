import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { formatDate } from '@/utils/formatDate'
import { updateTaskRequest } from '@/lib/http/task'
import RenderMembers from './RenderMembers'

// 'TO_DO','IN_PROGRESS','STUCK','DONE'
const statuses = [["TO_DO", "TO DO"], ["IN_PROGRESS", "IN PROGRESS"], ["STUCK", "STUCK"], ["DONE", "DONE"], ["OVER_DUE","OVER DUE"]]
const statusColors = {
    "TO_DO": "bg-gray-400",
    "IN_PROGRESS": "bg-blue-400",
    "STUCK": "bg-yellow-400",
    "DONE": "bg-green-400",
    "OVER_DUE": "bg-red-400"
}

const Kanban = ({project:projectsDetails}) => {
    const [project,setProject] = useState(null);
    useEffect(() => setProject(projectsDetails),[projectsDetails]);


    const onDragStart = useCallback((event,task_id) => {
        event.dataTransfer.setData("task_id", task_id);
    },[]);

    const handleDrop = useCallback(async (event, status) => {
        const task_id = event.dataTransfer.getData("task_id");
        setProject(prev => {
            let task = prev.Tasks.map(task => {
                if(task.task_id == task_id){
                    task.status = status;
                }
                return task;
            });
            return {...prev,Tasks: task};
        });

        try {
            await updateTaskRequest({status},task_id);
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
        }

    },[]);


    return (
        <div className="grid gap-4 md:grid-cols-5 relative">
            {statuses.map(([value, status]) => (
                <Card key={status} className="h-full bg-gray-100"  onDrop={(e) => handleDrop(e,value)} onDragOver={(e) => e.preventDefault()}>
                    <CardContent className="p-0">
                        <h3 className={`mb-4 font-semibold py-2 ${statusColors[value]} text-center text-white rounded-t-sm`}>{status}</h3>
                        <div className='px-3'>
                            {project?.Tasks?.filter(task => task.status == value).map((task) => (
                                <Card key={task} className="mb-2 bg-white" draggable onDragStart={(e) => onDragStart(e,task.task_id)}>
                                    <CardContent className="p-2 cursor-pointer">

                                        <span className='text-black/80 mb-2 '>{task.name}</span>
                                        <div className='my-2 flex items-center gap-2 flex-wrap'>
                                            <Button variant="ghost" className="!text-xs px-[10px] h-[30px] bg-gray-100 text-gray-700 relative">
                                                {task.status}
                                            </Button>
                                            <Button variant="ghost" className="!text-xs px-[10px] h-[30px] bg-gray-100 text-gray-700 relative">
                                                {formatDate(task.last_date)}
                                            </Button>
                                            <Button variant="ghost" className="!text-xs px-[10px] h-[30px] bg-gray-100 text-gray-700 relative">
                                                {task.priority}
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between mt-5">
                                            <RenderMembers members={task.assignees}/>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default Kanban