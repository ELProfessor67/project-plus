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
import { createFiledRequest, getFilledRequest, updateFiledStatusRequest, updateStatusRequest } from '@/lib/http/client';
import Loader from '@/components/Loader';
import moment from 'moment';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const page = ({ params }) => {
    const { id } = use(params);
    const [open, setOpen] = useState(false);
    const [filed, setFiled] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        name: '',
        description: '',
        date: '',
        progress: '',
        project_client_id: id,
        file: null,
    });
    const { user } = useUser();
    const getFiled = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getFilledRequest(id);
            setFiled(res?.data?.filed);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getFiled();
    }, [id]);

    const handleFormChange = useCallback((e) => {
        setFormdata(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);


    const handleCreateFiled = useCallback(async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await createFiledRequest(formdata);
            toast.success(res.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setOpen(false);
            setSubmitLoading(false);
            getFiled();
        }
    }, [formdata]);




    const handleUpdateStatus = useCallback(async (status, filled_id) => {
        try {
            const formdata = {
                status,
                filled_id
            }

            const res = await updateFiledStatusRequest(formdata);
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            getFiled();
        }
    }, [])

    const handleDocumentChange = useCallback((e) => {
        const file = e.target.files[0];
        setFormdata(prev => ({ ...prev, file }));
    }, []);


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
                        <h1 className="text-3xl font-semibold text-foreground-primary">Project Filed</h1>
                        <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all' onClick={() => setOpen(true)}>
                            Create Filed
                        </Button>
                    </div>
                }

                <div className="flex-1 overflow-auto">
                    <Table className="border-collapse border border-primary rounded-md">
                        <TableHeader className="border-b border-primary">
                            <TableRow>
                                <TableHead className="!w-[80px] border-r border-primary last:border-r-0 text-foreground-primary">#</TableHead>
                                <TableHead className="w-[300px] border-r border-primary last:border-r-0 text-foreground-primary">Name</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Description</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Date</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Progress</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Status</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Document</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-primary">
                            {
                                filed.map((file, index) => (
                                    <TableRow>
                                        <TableCell className='border-r border-primary last:border-r-0 cursor-pointer text-foreground-primary'>
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                            {file.name}
                                        </TableCell>

                                        <TableCell className="border-r border-primary last:border-r-0 !p-1 text-center text-foreground-primary">
                                            {file.description}
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                            {moment(file.date).format("DD MMM YYYY")}
                                        </TableCell>
                                        <TableCell className="border-r border-primary last:border-r-0 !p-1 text-center text-foreground-primary">
                                            {file.progress}
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-1 text-center text-foreground-primary'>
                                            {
                                                user?.Role == "PROVIDER" &&
                                                (
                                                    <Select onValueChange={(status) => handleUpdateStatus(status, file.filled_id)} value={file.status} className='w-full'>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Status</SelectLabel>
                                                                <SelectItem value="PENDING">PENDING</SelectItem>
                                                                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                                                <SelectItem value="STUCK">STUCK</SelectItem>
                                                                <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                                                                <SelectItem value="CANCELED">CANCELED</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )
                                            }
                                            {
                                                user?.Role == "CLIENT" &&
                                                (
                                                    <span>{file.status}</span>
                                                )
                                            }
                                        </TableCell>

                                        <TableCell className='border-r border-primary last:border-r-0 !p-1 text-center text-foreground-primary'>
                                            {
                                                file.filename &&
                                                <a target='__black' href={file.file_url} className='text-tbutton-bg hover:text-tbutton-hover underline'>{file.filename}</a>
                                            }
                                            {
                                                !file.filename &&
                                                <span>NA</span>
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
                <form className='space-y-8 mt-5 px-5' onSubmit={handleCreateFiled}>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground-primary">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formdata.name}
                            onChange={handleFormChange}
                            required
                            className="bg-primary border-primary text-foreground-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-foreground-primary">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            name="date"
                            placeholder="Date"
                            value={formdata.date}
                            onChange={handleFormChange}
                            required
                            className="bg-primary border-primary text-foreground-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground-primary">Description</Label>
                        <Textarea
                            id="description"
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={formdata.description}
                            onChange={handleFormChange}
                            required
                            className="bg-primary border-primary text-foreground-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="progress" className="text-foreground-primary">Progress</Label>
                        <Textarea
                            id="progress"
                            type="text"
                            name="progress"
                            placeholder="Progress"
                            value={formdata.progress}
                            onChange={handleFormChange}
                            required
                            className="bg-primary border-primary text-foreground-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="document" className="text-foreground-primary">Document (optional)</Label>
                        <Input
                            id="document"
                            type="file"
                            name="document"
                            placeholder="document"
                            onChange={handleDocumentChange}
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