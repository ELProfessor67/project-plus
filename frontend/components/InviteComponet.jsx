import React, { useCallback, useEffect, useState } from 'react'
import BigDialog from './Dialogs/BigDialog'
import { Button } from './Button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { invitePeopleRequest, sendViaMailRequest } from '@/lib/http/project';
import { toast } from 'react-toastify';
import { Textarea } from './ui/textarea';
import { generateInvitation } from '@/utils/createInvitation';
import { useUser } from '@/providers/UserProvider';
import { Input } from './ui/input';

const InviteComponet = ({ open, onClose, project,isClient=false}) => {
    // ADMIN,MEMBER,VIEWER,CLIENT
    const [role, setRole] = useState("CLIENT");
    const [isLoading,setIsLoading] = useState(false);
    const [link,setLink] = useState(null);
    const [invitation,setInvitation] = useState('');
    const {user} = useUser();
    const [sendViaMail, setSendViaMail] = useState(false);
    const [mail,setMail] = useState('');



    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formdata = {
                role
            }
            const res = await invitePeopleRequest(formdata,project.project_id);
            setLink(res.data.link);
            const invitation = generateInvitation(res.data.link,project.name,user?.name,'Project Admin',role,isClient);
            setInvitation(invitation);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }finally{
            setIsLoading(false);
        }
    },[role,isClient]);


    const handleCopy = useCallback(() => {
        try {
            if(typeof window != 'undefined'){
                window.navigator.clipboard.writeText(invitation);
                toast.success("Inviation Copied");
            }
        } catch (error) {
            toast.error(error.message);
        }
    },[invitation]);


    const handleSendViaMail = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formdata = {
                invitation,mail
            }
            const res = await sendViaMailRequest(formdata);
            toast.success(res.data.message);
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }finally{
            setIsLoading(false);
        }
    },[invitation,mail])



    useEffect(() => {
        if(isClient){
            setRole('CLIENT');
        }else{
            setRole('MEMBER');
        }

    },[isClient]);

    return (
        <BigDialog open={open} onClose={onClose}>

            {
                sendViaMail && 
                <>
                    <h2 className='text-center font-medium text-2xl text-gray-700'>Send Via Mail</h2>
                    <form className='mt-16 space-y-6 mx-auto max-w-2xl flex-col' onSubmit={handleSendViaMail}>
                        <Input
                            type="email"
                            placeholder="Enter Mail"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                        />

                        <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full" isLoading={isLoading} disabled={isLoading || !mail}>
                            Send
                        </Button>
                    </form>
                </>
            }


            {
                link && !sendViaMail &&
                <>
                    <h2 className='text-center font-medium text-2xl text-gray-700'>Edit Invitation</h2>
                    <div className='mt-16 space-y-6 mx-auto max-w-2xl flex-col' onSubmit={() => {}}>
                       
                        <Textarea value={invitation} onChange={(e) => setInvitation(e.target.value)} className='h-[25rem] w-full'></Textarea>
                        <div className='grid grid-cols-2 gap-5'>
                            <Button variant='ghost' className={'bg-gray-100 hover:bg-gray-200'} type="button"onClick={handleCopy}>
                                Copy Invitation
                            </Button>
                            <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full" onClick={() => setSendViaMail(true)}>
                               Send Via Email
                            </Button>
                        </div>
                        
                    </div>
                    
                </>
            }


            {
                !link && 
                <>
                    <h2 className='text-center font-medium text-2xl text-gray-700'>Create Invite Link</h2>
                    <form className='mt-16 space-y-6 mx-auto max-w-2xl flex-col' onSubmit={handleSubmit}>
                        <Select onValueChange={(value) => setRole(value)} value={role} className='w-full'>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Role</SelectLabel>
                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                    <SelectItem value="MEMBER">MEMBER</SelectItem>
                                    <SelectItem value="VIEWER">VIEWER</SelectItem>
                                    <SelectItem value="BILLER">BILLER</SelectItem>
                                    <SelectItem value="CLIENT">CLIENT</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full" isLoading={isLoading} disabled={isLoading}>
                            Create Link
                        </Button>
                    </form>
                </>
            }
            
        </BigDialog>
    )
}

export default InviteComponet