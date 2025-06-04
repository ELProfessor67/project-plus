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

const SendMail = ({ open, onClose, getAllMail, project_id = null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectProject, setSelectProject] = useState(project_id);
    const [selectTask, setSelectedTask] = useState(null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const { user } = useUser();

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
        } finally {
            setIsLoading(false);
        }
    }, [selectTask, selectProject, subject, content]);

    return (
        <BigDialog open={open} onClose={onClose}>
            <div className='px-2 py-3'>
                <div className="w-full px-10 space-y-6 mt-5">
                    <h1 className="text-3xl font-semibold text-foreground-primary text-center">Send A Mail</h1>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-foreground-primary">Subject</Label>
                            <Input
                                id="subject"
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="bg-white border-primary text-black placeholder:text-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content" className="text-foreground-primary">Content</Label>
                            <Textarea 
                                name='content' 
                                id='content' 
                                placeholder="add content..." 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)}
                                className="bg-white border-primary text-black placeholder:text-gray-400"
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Mail'}
                        </Button>
                    </form>
                </div>
            </div>
        </BigDialog>
    )
}

export default SendMail