import React, { useCallback, useState } from 'react'
import BigDialog from './Dialogs/BigDialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './Button'
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useUser } from '@/providers/UserProvider'
import { sendTaskEmailRequest } from '@/lib/http/task'
import { toast } from 'react-toastify'

const SendMail = ({ open, onClose,getAllMail }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectProject, setSelectProject] = useState(null);
    const [selectTask, setSelectedTask] = useState(null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const {user} = useUser();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = {
                task_id: selectTask,
                content: content,
                subject: subject
            }

            const res = await sendTaskEmailRequest(formData);
            getAllMail();
            toast.success(res?.data?.message);
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }finally{
            setIsLoading(false);
        }
    },[selectTask,selectProject,subject,content]);
    return (
        <BigDialog open={open} onClose={onClose}>
            <div className='px-2 py-3'>
                <div className="w-full px-10 space-y-6 mt-5">
                    <h1 className="text-3xl font-semibold text-gray-800 text-center">Send A Mail</h1>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea name='content' id='content' placeholder="add content..." value={content} onChange={(e) => setContent(e.target.value)}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project">Project</Label>
                            <Select onValueChange={(value) => setSelectProject(value)} value={selectProject}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a project" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Projects</SelectLabel>
                                        {
                                            user && user?.Projects?.map((project,index) => (
                                                <SelectItem value={`${project.project_id}`}  key={`${project.project_id}-${index}`}>{project?.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="description">Task</Label>
                            <Select onValueChange={(value) => setSelectedTask(value)} value={selectTask}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a task" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Tasks</SelectLabel>
                                        {
                                            user && user?.Projects?.find(project => project.project_id == selectProject)?.Tasks?.map((task,index) => (
                                                <SelectItem value={`${task.task_id}`}  key={`${task.task_id}-${index}`}>{task?.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>


                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600"
                            disabled={isLoading || !selectProject || !selectTask || !subject || !content}
                            isLoading={isLoading}
                        >
                            Send Now
                        </Button>
                    </form>

                </div>
            </div>
        </BigDialog>
    )
}

export default SendMail