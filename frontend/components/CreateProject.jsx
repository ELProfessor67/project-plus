import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './Button'
import JoditEditor from 'jodit-react';
import { toast } from 'react-toastify';
import { createProjectRequest } from '@/lib/http/project';
import { useUser } from '@/providers/UserProvider';




const CreateProject = ({onClose}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        name: '',
        description: ''
    });
    const {loadUser} = useUser();

    const editor = useRef(null);
    const config = useMemo(() => ({
        placeholder: "Add description",
        height: 300
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
                    <h1 className="text-3xl font-semibold text-gray-800">Create New Project</h1>
                    <p className="text-gray-600">Start building your next big idea.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your project name"
                            value={formdata.name}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <JoditEditor
                            ref={editor}
                            value={formdata.description}
                            onChange={(newContent) => contentFieldChanaged(newContent)}
                            config={config}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-12 bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600"
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
