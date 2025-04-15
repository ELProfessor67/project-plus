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
const JoditEditor = dynamic(
    () => import('jodit-react'),
    { ssr: false }
)


const CreateTask = ({ project, onClose, getProjectDetails }) => {
    const [selectedMember, setSelectedMember] = useState([]);
    const [isDisabled, setIsDiabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            await getProjectDetails();
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setIsLoading(false)
        }
    }, [selectedMember, formdata, project]);


    //button disabled
    useEffect(() => {
        if (!formdata.name || formdata.assigned_to == -1 || !formdata.description || !formdata.last_date) {
            setIsDiabled(true);
            return
        }

        setIsDiabled(false);
    }, [JSON.stringify(formdata), selectedMember]);



    const config = useMemo(() => ({
        placeholder: "Add description",
    }), []);


    return (

        <div className="sm:max-w-[500px]">
            <div className="flex flex-row items-center justify-between pb-2">
                <Input
                    
                    value={formdata.name}
                    type="text"
                    defaultValue="New Task"
                    className=" border-none !text-3xl font-semibold p-0 focus:border-none focus:outline-none  focus-visible:ring-0 focus-visible:ring-transparent"
                />
            </div>
            <div className="grid gap-5 py-4 px-2">
                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <User2 className="h-5 w-5 text-gray-500" />
                        <span className='text-black/80 text-sm'>Name</span>
                    </div>
                    <Input type="text" className="w-full focus-visible:ring-0 focus-visible:ring-transparent" onChange={(e) => setFormdata(prev => ({ ...prev, name: e.target.value }))}
                        value={formdata.name} />
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-5 items-center ">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <Menu className="h-5 w-5 text-gray-500" />
                        <span className='text-black/80 text-sm'>Priority</span>
                    </div>
                    <Select onValueChange={(value) => setFormdata(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-transparent outline-none">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="focus-visible:ring-0 focus-visible:ring-transparent">
                            <SelectItem value="CRITICAL">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-red-950 rounded-full'></span>
                                    <span className='text-md'>Critical</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="HIGH">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-orange-700 rounded-full'></span>
                                    <span className='text-md'>Hign</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="MEDIUM">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-yellow-700 rounded-full'></span>
                                    <span className='text-md'>Medium</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="LOW">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-green-700 rounded-full'></span>
                                    <span className='text-md'>Low</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="NONE">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-blue-300 rounded-full'></span>
                                    <span className='text-md'>Very Low</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <span className='text-black/80 text-sm'>Last Date</span>
                    </div>
                    <Input type="date" className="w-full focus-visible:ring-0 focus-visible:ring-transparent" onChange={(e) => setFormdata(prev => ({ ...prev, last_date: e.target.value }))}
                        value={formdata.last_date} />
                </div>


                <div className="grid grid-cols-[auto,1fr] gap-5 items-center ">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <UserCircle className="h-5 w-5 text-gray-500" />
                        <span className='text-black/80 text-sm'>Leader</span>
                    </div>
                    <Select onValueChange={(value) => setFormdata(prev => ({ ...prev, assigned_to: value }))} >
                        <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-transparent outline-none">
                            <SelectValue placeholder="Task Leader" />
                        </SelectTrigger>
                        <SelectContent className="focus-visible:ring-0 focus-visible:ring-transparent">
                            {
                                project?.Members?.map(member => (
                                    <SelectItem value={member?.user?.user_id} key={member?.user?.user_id}>
                                        <div className='flex items-center gap-3'>
                                            <Avatar className="w-[2rem] h-[2rem]">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                                <AvatarFallback className="bg-blue-500 text-white ">{getNameAvatar(member?.user?.name)}</AvatarFallback>
                                            </Avatar>
                                            <span className='text-md'>{member?.user?.name}</span>
                                        </div>
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>







                <div className="grid grid-cols-[auto,1fr] gap-5 items-center ">
                    <div className="flex items-center gap-2 w-[6rem]">
                        <UsersIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-black/80 text-sm">Members</span>
                    </div>

                    <MultiSelect
                        options={options || []}
                        className="text-black/80"
                        onValueChange={setSelectedMember}
                        defaultValue={selectedMember}
                        placeholder="Select Member"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                    />
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-5 items-center ">
                    <div className='flex items-center gap-2 w-[6rem]'>

                        <ChartNoAxesColumnIncreasing className="h-5 w-5 text-gray-500" />
                        <span className='text-black/80 text-sm'>Status</span>
                    </div>
                    <Select onValueChange={(value) => setFormdata(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-transparent outline-none">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="focus-visible:ring-0 focus-visible:ring-transparent">
                            <SelectItem value="TO_DO">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-gray-400 rounded-full'></span>
                                    <span className='text-md'>TO DO</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="IN_PROGRESS">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-blue-400 rounded-full'></span>
                                    <span className='text-md'>IN PROGRESS</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="STUCK">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-yellow-400 rounded-full'></span>
                                    <span className='text-md'>STUCK</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="DONE">
                                <div className='flex items-center gap-4'>
                                    <span className='w-[1.4rem] h-[1.4rem] bg-green-400 rounded-full'></span>
                                    <span className='text-md'>DONE</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-[auto,1fr] gap-5 items-center">
                    <div className='flex items-center gap-2 w-[6rem]'>
                        <TypeOutline className="h-5 w-5 text-gray-500" />
                        <span className='text-black/80 text-sm'>Description</span>
                    </div>
                    <JoditEditor
                        value={formdata.description}
                        onChange={(newContent) => setFormdata(prev => ({ ...prev, description: newContent }))}
                        config={config}
                    />
                </div>


            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600" disabled={isLoading || isDisabled} onClick={handleCreate} isLoading={isLoading}>
                    Create Task
                </Button>
            </div>
        </div>

    )
}

export default CreateTask