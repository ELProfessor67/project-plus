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
            <div className=" h-screen bg-white m-2 rounded-md flex items-center justify-center">
                <Loader />
            </div>
        </>
    }


    return (
        <>
            <main className="flex-1 overflow-auto p-8 bg-white m-2 rounded-md">
                {
                    user?.Role == "PROVIDER" &&
                    <div className="mb-8  flex items-center justify-between">
                        <h1 className="text-3xl font-semibold text-gray-800">Project Updates</h1>
                        <Button className='bg-blue-500 border border-white text-white hover:bg-gray-200 ' onClick={() => setOpen(true)}>
                            Give Update
                        </Button>
                    </div>
                }

                <div className="flex-1 overflow-auto">
                    <Table className="border-collapse border rounded-md">
                        <TableHeader className="border-b">
                            <TableRow>
                                <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                                <TableHead className="w-[300px] border-r last:border-r-0">Message</TableHead>
                                <TableHead className="border-r last:border-r-0">Date</TableHead>
                                <TableHead className="border-r last:border-r-0">File</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y">
                            {
                                updates.map((document, index) => (
                                    <TableRow>
                                        <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                            {document.message}
                                        </TableCell>
                                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                            {moment(document.created_at).format("DD MMM YYYY")}
                                        </TableCell>
                                        <TableCell className={`border-r last:border-r-0 !p-1 text-black text-center relative cursor-pointer group`}>
                                            {
                                                document.filename ?
                                                (
                                                    <Link href={document.file_url} className='text-blue-500 underline'>{document.filename}</Link>
                                                ):
                                                "No FIle Attach"
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
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            type="text"
                            name="message"
                            placeholder="Update"
                            value={formdata.message}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    

                    <div className="space-y-2">
                        <Label htmlFor="message">File (Optional)</Label>
                        <Input
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>

                    <Button className={`bg-blue-500 hover:bg-blue-600 w-full disabled:opacity-40`} isLoading={submitLoading} disabled={submitLoading}>
                        {submitLoading ? "Loading..." : "Request"}
                    </Button>
                </form>
            </BigDialog>
        </>
    )
}

export default page