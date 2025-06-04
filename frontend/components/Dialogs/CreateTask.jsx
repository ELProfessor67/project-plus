import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarIcon, ChartNoAxesColumnIncreasing, ChevronDownIcon, FileIcon, Menu, TypeOutline, User2, UserCircle, Users, UsersIcon, X } from 'lucide-react'
import { Button } from "@/components/Button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getNameAvatar } from '@/utils/getNameAvatar'
import MultiSelect from "@/components/ui/multi-select";
import AvatarCompoment from '../AvatarCompoment'
import { toast } from 'react-toastify'
import { createTaskRequest } from '@/lib/http/task'
import dynamic from 'next/dynamic'
import { useUser } from '@/providers/UserProvider'
import { Textarea } from '../ui/textarea'
const JoditEditor = dynamic(
    () => import('jodit-react'),
    { ssr: false }
)


const CreateTask = ({ project, onClose, getProjectDetails }) => {
    const [selectedMember, setSelectedMember] = useState([]);
    const [isDisabled, setIsDiabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { loadUser } = useUser()
    const [formdata, setFormdata] = useState({
        project_id: project?.project_id,
        name: "New Task",
        description: "",
        assigned_to: -1,
        priority: "NONE",
        last_date: "",
        otherMember: [],
        status: "TO_DO"
    });

    useEffect(() => setFormdata(prev => ({ ...prev, project_id: project?.project_id, name: `Task ${project?.Tasks.length + 1}` })), [project]);



    const options = useMemo(() => (project?.Members?.filter(member => member.user_id != formdata.assigned_to).map(member => ({
        value: member?.user?.user_id, label: member?.user?.name, icon: (props) => <AvatarCompoment name={member?.user?.name} {...props} />
    }))), [project, formdata]);



    const handleCreate = useCallback(async () => {
        setIsLoading(true);
        try {
            formdata['otherMember'] = selectedMember;
            formdata['project_id'] = project.project_id;
            formdata['last_date'] = formdata.last_date + 'T00:00:00Z';
            const res = await createTaskRequest(formdata);
            setSelectedMember([]);
            setFormdata({
                project_id: project?.project_id,
                name: "New Task",
                description: "",
                assigned_to: -1,
                priority: "NONE",
                last_date: "",
                otherMember: [],
                status: "TO_DO"
            })
            toast.success(res?.data?.message);
            loadUser();
            await getProjectDetails();
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setIsLoading(false)
        }
    }, [selectedMember, formdata, project]);


    //button disabled
    // useEffect(() => {
    //     if (!formdata.name || formdata.assigned_to == -1 || !formdata.description || !formdata.last_date) {
    //         setIsDiabled(true);
    //         return
    //     }

    //     setIsDiabled(false);
    // }, [JSON.stringify(formdata), selectedMember]);





    const config = useMemo(() => ({
        placeholder: "Add description",
    }), []);


    return (

        <div className="sm:max-w-[500px]">
            <div className="flex flex-row items-center justify-between pb-2">
                <h1 className='text-foreground-primary text-3xl font-semibold'>{formdata.name}</h1>
            </div>
            <div className="grid gap-5 py-4 px-2">
                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <User2 className="h-5 w-5 text-foreground-secondary" />
                        <span className='text-foreground-primary text-sm'>Name</span>
                    </div>
                    <Input
                        type="text"
                        className="w-full focus-visible:ring-0 focus-visible:ring-transparent bg-white border-primary text-black"
                        onChange={(e) => setFormdata(prev => ({ ...prev, name: e.target.value }))}
                        value={formdata.name}
                    />
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <Menu className="h-5 w-5 text-foreground-secondary" />
                        <span className='text-foreground-primary text-sm'>Priority</span>
                    </div>
                    <Select onValueChange={(value) => setFormdata(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-transparent outline-none bg-white border-primary text-black">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="focus-visible:ring-0 focus-visible:ring-transparent bg-white border-primary">
                            <SelectItem value="CRITICAL">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-red-950 rounded-full'></span>
                                    <span className='text-black'>Critical</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="HIGH">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-orange-700 rounded-full'></span>
                                    <span className='text-black'>High</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="MEDIUM">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-yellow-700 rounded-full'></span>
                                    <span className='text-black'>Medium</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="LOW">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-green-700 rounded-full'></span>
                                    <span className='text-black'>Low</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="NONE">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-blue-300 rounded-full'></span>
                                    <span className='text-black'>Very Low</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <CalendarIcon className="h-5 w-5 text-foreground-secondary" />
                        <span className='text-foreground-primary text-sm'>Last Date</span>
                    </div>
                    <Input
                        type="date"
                        className="w-full focus-visible:ring-0 focus-visible:ring-transparent bg-white border-primary text-black"
                        onChange={(e) => setFormdata(prev => ({ ...prev, last_date: e.target.value }))}
                        value={formdata.last_date}
                    />
                </div>


                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <UserCircle className="h-5 w-5 text-foreground-secondary" />
                        <span className='text-foreground-primary text-sm'>Leader</span>
                    </div>
                    <Select onValueChange={(value) => setFormdata(prev => ({ ...prev, assigned_to: value }))}>
                        <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-transparent outline-none bg-white border-primary text-black">
                            <SelectValue placeholder="Task Leader" />
                        </SelectTrigger>
                        <SelectContent className="focus-visible:ring-0 focus-visible:ring-transparent bg-white border-primary">
                            {
                                project?.Members?.map(member => (
                                    <SelectItem value={member?.user?.user_id} key={member?.user?.user_id}>
                                        <div className='flex items-center gap-3'>
                                            <Avatar className="w-[2rem] h-[2rem]">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                                <AvatarFallback className="bg-primary/10 text-foreground-primary">{getNameAvatar(member?.user?.name)}</AvatarFallback>
                                            </Avatar>
                                            <span className='text-black'>{member?.user?.name}</span>
                                        </div>
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>







                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className="flex items-center gap-2 w-[6rem]">
                        <UsersIcon className="h-5 w-5 text-foreground-secondary" />
                        <span className="text-foreground-primary text-sm">Members</span>
                    </div>

                    <MultiSelect
                        options={options || []}
                        className="text-black"
                        onValueChange={setSelectedMember}
                        defaultValue={selectedMember}
                        placeholder="Select Member"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                    />
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>

                        <ChartNoAxesColumnIncreasing className="h-5 w-5 text-foreground-secondary" />
                        <span className='text-foreground-primary text-sm'>Status</span>
                    </div>
                    <Select onValueChange={(value) => setFormdata(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-transparent outline-none bg-white border-primary text-black">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="focus-visible:ring-0 focus-visible:ring-transparent bg-white border-primary">
                            <SelectItem value="TO_DO">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-gray-400 rounded-full'></span>
                                    <span className='text-black'>TO DO</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="IN_PROGRESS">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-blue-400 rounded-full'></span>
                                    <span className='text-black'>IN PROGRESS</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="STUCK">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-yellow-400 rounded-full'></span>
                                    <span className='text-black'>STUCK</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="DONE">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-green-400 rounded-full'></span>
                                    <span className='text-black'>DONE</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <TypeOutline className="h-5 w-5 text-foreground-secondary" />
                        <span className='text-foreground-primary text-sm'>Description</span>
                    </div>
                    <div className="border border-primary rounded-md">
                        <Textarea placeholder="Description"
                            onChange={(e) => setFormdata(prev => ({ ...prev, description: e.target.value }))}
                            value={formdata.description} >
                            
                        </Textarea>
                    </div>
                </div>


            </div>
            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="text-black "
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all"
                    disabled={isLoading || isDisabled}
                    onClick={handleCreate}
                    isLoading={isLoading}
                >
                    Create Task
                </Button>
            </div>
        </div>

    )
}

export default CreateTask