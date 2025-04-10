import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './Button'
import { formatDate } from '@/utils/formatDate'
import { createTimeRequest, stopTimeRequest, updateTaskRequest } from '@/lib/http/task'
import RenderMembers from './RenderMembers'
import { Pause, Play } from 'lucide-react'
import { useUser } from '@/providers/UserProvider'
import { toast } from 'react-toastify'
import Timer from './Timer'
import BigDialog from './Dialogs/BigDialog'
import AddWorkDescription from './AddWorkDescription'

// 'TO_DO','IN_PROGRESS','STUCK','DONE'
const statuses = [["TO_DO", "TO DO"], ["IN_PROGRESS", "IN PROGRESS"], ["STUCK", "STUCK"], ["DONE", "DONE"], ["OVER_DUE", "OVER DUE"]]
const statusColors = {
    "TO_DO": "bg-gray-400",
    "IN_PROGRESS": "bg-blue-400",
    "STUCK": "bg-yellow-400",
    "DONE": "bg-green-400",
    "OVER_DUE": "bg-red-400"
}

const Kanban = ({ project: projectsDetails }) => {
    const [project, setProject] = useState(null);
    const [timesTasks, settimesTasks] = useState({});
    const [loadindTask, setloadindTask] = useState(null);
    const [loadindStopTask, setloadindStopTask] = useState(null);
    const [stopTimeOpen, setStopTimeOpen] = useState(null);
    useEffect(() => setProject(projectsDetails), [projectsDetails]);
    const { user, loadUser } = useUser();

    useEffect(() => {
        if (!user) return
        let timesTasks = {}
        user.Time.forEach(time =>
            timesTasks[time.task_id] = time.start
        );
        settimesTasks(timesTasks);
    }, [user]);


    const onDragStart = useCallback((event, task_id) => {
        event.dataTransfer.setData("task_id", task_id);
    }, []);

    const handleDrop = useCallback(async (event, status) => {
        const task_id = event.dataTransfer.getData("task_id");
        setProject(prev => {
            let task = prev.Tasks.map(task => {
                if (task.task_id == task_id) {
                    task.status = status;
                }
                return task;
            });
            return { ...prev, Tasks: task };
        });

        try {
            await updateTaskRequest({ status }, task_id);
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
        }

    }, []);



    const handleStartTime = useCallback(async (task_id) => {
        try {
            setloadindTask(task_id);
            const res = await createTimeRequest(task_id);
            await loadUser();
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setloadindTask(null);
        }
    }, []);

    const handleStopTime = useCallback(async (task_id,description) => {
        try {
            setloadindStopTask(task_id)
            const time = user.Time.find(time => time.task_id == task_id);
            if (!time) return;
            const formdata = {
                description
            }
          
            const res = await stopTimeRequest(time.time_id,formdata);
            await loadUser();
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setloadindStopTask(null);
        }
    }, [user]);




    return (
        <>

            <div className="grid gap-4 md:grid-cols-5 relative">
                {statuses.map(([value, status]) => (
                    <Card key={status} className="h-full bg-gray-100" onDrop={(e) => handleDrop(e, value)} onDragOver={(e) => e.preventDefault()}>
                        <CardContent className="p-0">
                            <h3 className={`mb-4 font-semibold py-2 ${statusColors[value]} text-center text-white rounded-t-sm`}>{status}</h3>
                            <div className='px-3'>
                                {project?.Tasks?.filter(task => task.status == value).map((task) => (
                                    <Card key={task} className="mb-2 bg-white" draggable onDragStart={(e) => onDragStart(e, task.task_id)}>
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
                                            <div className='flex items-center justify-between mt-5'>
                                                <div className="flex items-center justify-between ">
                                                    <RenderMembers members={task.assignees} />
                                                </div>

                                                {
                                                    timesTasks.hasOwnProperty(task.task_id) ?
                                                        <>
                                                            <div>
                                                                <Timer startTime={timesTasks[task.task_id]} />
                                                                <Button size="icon" variant="ghost" className="rounded-full w-[2rem] h-[2rem] bg-gray-100" onClick={() => setStopTimeOpen(task.task_id)} disabled={loadindStopTask == task.task_id} isLoading={loadindStopTask == task.task_id}>{loadindStopTask != task.task_id && <Pause />}</Button>
                                                            </div>
                                                        </>
                                                        :
                                                        <Button size="icon" variant="ghost" className="rounded-full w-[2rem] h-[2rem] bg-gray-100" onClick={() => handleStartTime(task.task_id)} disabled={loadindTask == task.task_id} isLoading={loadindTask == task.task_id}>{loadindTask != task.task_id && <Play />}</Button>
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>

            <BigDialog open={!!stopTimeOpen} onClose={() => setStopTimeOpen(null)} width={34}>
                <AddWorkDescription task_id={stopTimeOpen} handleStop={handleStopTime} close={() => setStopTimeOpen(null)}/>
            </BigDialog>
        </>
    )
}

export default Kanban