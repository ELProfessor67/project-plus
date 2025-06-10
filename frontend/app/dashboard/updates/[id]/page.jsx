'use client'
import React, { use, useCallback, useEffect, useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import { useUser } from '@/providers/UserProvider';
import { Button } from '@/components/Button';
import BigDialog from '@/components/Dialogs/BigDialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { getDocuemtnRequest, getUpdatesRequest, giveUpdateRequest, requestDocuemtnRequest, updateStatusRequest, uploadDocumentRequest } from '@/lib/http/client';
import Loader from '@/components/Loader';
import moment from 'moment';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const page = ({ params }) => {
    const { id } = use(params);
    const [open, setOpen] = useState(false);
    const [updates, setUpdates] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        message: '',
        project_client_id: id,
        file: undefined,
    });
    const { user } = useUser();

    const getUpdates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getUpdatesRequest(id);
            setUpdates(res?.data?.updates);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getUpdates();
    }, [id]);

    const handleFormChange = useCallback((e) => {
        setFormdata(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);


    const handleUpdatesRequest = useCallback(async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await giveUpdateRequest(formdata);
            toast.success(res.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setOpen(false);
            setSubmitLoading(false);
            getUpdates();
        }
    }, [formdata]);



    const handleFileChange = useCallback((e) => {
        const [file] = e.target.files;
        setFormdata(prev => ({...prev,file}));
    },[]);

    


    if (loading) {
        return <>
            <div className="h-screen bg-secondary m-2 rounded-md flex items-center justify-center">
                <Loader />
            </div>
        </>
    }


    return (
        <>
            <main className="flex-1 overflow-auto p-8 bg-secondary m-2 rounded-md">
                {
                    user?.Role == "PROVIDER" &&
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-semibold text-foreground-primary">Project Updates</h1>
                        <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all' onClick={() => setOpen(true)}>
                            Give Update
                        </Button>
                    </div>
                }

                <div className="flex-1 overflow-auto">
                    <Table className="border-collapse border border-primary rounded-md">
                        <TableHeader className="border-b border-primary">
                            <TableRow>
                                <TableHead className="!w-[80px] border-r border-primary last:border-r-0 text-foreground-primary">#</TableHead>
                                <TableHead className="w-[300px] border-r border-primary last:border-r-0 text-foreground-primary">Message</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Date</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">File</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-primary">
                            {
                                updates.map((document, index) => (
                                    <TableRow>
                                        <TableCell className='border-r border-primary last:border-r-0 cursor-pointer text-foreground-primary'>
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                            {document.message}
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                            {moment(document.created_at).format("DD MMM YYYY")}
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-1 text-foreground-primary text-center relative cursor-pointer group'>
                                            {
                                                document.filename ?
                                                (
                                                    <Link href={document.file_url} className='text-tbutton-bg hover:text-tbutton-hover underline'>{document.filename}</Link>
                                                ):
                                                "No File Attach"
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </main>


            <BigDialog open={open} onClose={() => setOpen(false)} width={'38'}>

                <form className='space-y-8 mt-20 px-5' onSubmit={handleUpdatesRequest}>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-foreground-primary">Message</Label>
                        <Textarea
                            id="message"
                            type="text"
                            name="message"
                            placeholder="Update"
                            value={formdata.message}
                            onChange={handleFormChange}
                            required
                            className="bg-primary border-primary text-foreground-primary"
                        />
                    </div>
                    

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-foreground-primary">File (Optional)</Label>
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            className="bg-primary border-primary text-foreground-primary"
                        />
                    </div>

                    <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all w-full disabled:opacity-40' isLoading={submitLoading} disabled={submitLoading}>
                        {submitLoading ? "Loading..." : "Request"}
                    </Button>
                </form>
            </BigDialog>
        </>
    )
}

export default page