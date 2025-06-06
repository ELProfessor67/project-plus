import React, { useCallback, useEffect, useState } from 'react'
import BigDialog from './Dialogs/BigDialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './Button'
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useUser } from '@/providers/UserProvider'
import { toast } from 'react-toastify'
import { createMeetingRequest } from '@/lib/http/meeting'
import { useRouter } from 'next/navigation'
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CreateMeeting = ({ open, onClose,isScheduled,getMeetings,project_id=null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectProject, setSelectProject] = useState(project_id);
    const [selectTask, setSelectedTask] = useState(null);
    const [heading,setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [date,setDate] = useState('');
    const [time,setTime] = useState('');
    const {user} = useUser();
    const router = useRouter();


  


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formdata = {
                heading,
                description,
                task_id: selectTask,
                isScheduled,
            }


            if(date && time){
                formdata['date'] = `${date}T${time}:00Z`;
                formdata['time'] = `${date}T${time}:00Z`;
            }
          
            
            const res = await createMeetingRequest(formdata);
            if(!isScheduled){
                router.push(`/meeting/${res.data.meeting.meeting_id}`)
            }
            toast.success(res.data.message);
            await getMeetings()
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }finally{
            setIsLoading(false)
        }
    },[heading,description,selectProject,selectTask,date,time,isScheduled]);


    useEffect(() => {
        if(selectTask && user && selectProject){
            const project = user.Projects.find(project => project.project_id == selectProject);
            const task = project?.Tasks.find(task => task.task_id == selectTask);
            if(!heading && task){
                setHeading(task.name);
            }
        }
    },[selectTask]);
    return (
        <BigDialog open={open} onClose={onClose}>
            <div className='px-2 py-3'>
                <div className="w-full px-10 space-y-6 mt-5">
                    <h1 className="text-3xl font-semibold text-foreground-primary text-center">Create A New Meeting</h1>
                    <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                            <Label htmlFor="project" className="text-foreground-primary">Project</Label>
                            <Select onValueChange={(value) => setSelectProject(value)} value={selectProject}>
                                <SelectTrigger className="w-full bg-white border-primary text-black">
                                    <SelectValue placeholder="Select a project" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-primary">
                                    <SelectGroup>
                                        <SelectLabel className="text-gray-400">Projects</SelectLabel>
                                        {
                                            user && user?.Projects?.map((project,index) => (
                                                <SelectItem value={`${project.project_id}`} key={`${project.project_id}-${index}`} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">{project?.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-foreground-primary">Task</Label>
                            <Select onValueChange={(value) => setSelectedTask(value)} value={selectTask}>
                                <SelectTrigger className="w-full bg-white border-primary text-black">
                                    <SelectValue placeholder="Select a task" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-primary">
                                    <SelectGroup>
                                        <SelectLabel className="text-gray-400">Tasks</SelectLabel>
                                        {
                                            user && user?.Projects?.find(project => project.project_id == selectProject)?.Tasks?.map((task,index) => (
                                                <SelectItem value={`${task.task_id}`} key={`${task.task_id}-${index}`} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">{task?.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="heading" className="text-foreground-primary">Heading</Label>
                            <Input
                                id="heading"
                                type="text"
                                name="heading"
                                placeholder="Heading"
                                required
                                value={heading}
                                onChange={(e) => setHeading(e.target.value)}
                                className="bg-white border-primary text-black placeholder:text-gray-400"
                            />
                        </div>
                        

                        {
                            isScheduled &&
                            <>
                            
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-foreground-primary">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        name="date"
                                        placeholder="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-white border-primary text-black placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time" className="text-foreground-primary">Time</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        name="time"
                                        placeholder="time"
                                        required
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-white border-primary text-black placeholder:text-gray-400"
                                    />
                                </div>
                            </>
                        }

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-foreground-primary">Describtion</Label>
                            <Textarea 
                                name='description' 
                                id='description' 
                                placeholder="add description..." 
                                value={description}  
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-white border-primary text-black placeholder:text-gray-400 resize-none"
                            />
                        </div>



                        <Button
                            type="submit"
                            className="w-full h-12 bg-tbutton-bg text-tbutton-text disabled:opacity-40 hover:bg-tbutton-hover hover:text-tbutton-text transition-all"
                            disabled={isLoading || !selectProject || !selectTask || !heading || !description}
                            isLoading={isLoading}
                        >
                            Create Now
                        </Button>
                    </form>

                </div>
            </div>
        </BigDialog>
    )
}

export default CreateMeeting