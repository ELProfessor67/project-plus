import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './Button'
import { toast } from 'react-toastify';
import { createProjectRequest } from '@/lib/http/project';
import { useUser } from '@/providers/UserProvider';

import dynamic from 'next/dynamic'
import { Textarea } from './ui/textarea';
const JoditEditor = dynamic(
    () => import('jodit-react'),
    { ssr: false }
)

const CreateProject = ({onClose}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        name: '',
        description: '',
        opposing: ''
    });
    const {loadUser} = useUser();

    const editor = useRef(null);
    const config = useMemo(() => ({
        placeholder: "Add description",
        height: 300,
        theme: 'default',
        buttons: [
            'source', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'table', 'link', '|',
            'align', '|',
            'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'symbol', 'fullsize', 'print', 'about'
        ],
        style: {
            background: 'white',
            color: 'black'
        }
    }),[]);

    const handleFormChange = useCallback((e) => {
        setFormdata(prev => ({...prev,[e.target.name]: e.target.value}));
    },[]);

    const contentFieldChanaged = (data) => {
        setFormdata(prev => ({ ...prev, description: data }))
    }

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await createProjectRequest(formdata);
            toast.success(res?.data?.message);
            await loadUser();
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }finally{
            setIsLoading(false);
        }
    },[formdata]);

    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-foreground-primary">Create New Cases</h1>
                    <p className="text-foreground-secondary">Create a new case to manage your client legal matters.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground-primary">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your project name"
                            value={formdata.name}
                            onChange={handleFormChange}
                            required
                            className="bg-white border-primary text-black placeholder:text-gray-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground-primary">Opposing Party</Label>
                        <Input
                            id="name"
                            type="text"
                            name="opposing"
                            placeholder="Enter your project name"
                            value={formdata.opposing}
                            onChange={handleFormChange}
                            required
                            className="bg-white border-primary text-black placeholder:text-gray-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground-primary">Description</Label>
                        <div className="border border-primary rounded-md overflow-hidden">
                            <Textarea
                                className="bg-white border-primary text-black placeholder:text-gray-400"
                                placeholder="Case Description"
                                value={formdata.description}
                                onChange={handleFormChange}
                                name="description"
                            >
                            </Textarea>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-12 bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all disabled:opacity-40"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        Create
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CreateProject
