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
import { getDocuemtnRequest, requestDocuemtnRequest, updateStatusRequest, uploadDocumentRequest } from '@/lib/http/client';
import Loader from '@/components/Loader';
import moment from 'moment';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const page = ({ params }) => {
    const { id } = use(params);
    const [open, setOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        name: '',
        description: '',
        project_client_id: id
    });
    const { user } = useUser();
    const getDocument = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDocuemtnRequest(id);
            setDocuments(res?.data?.documents);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getDocument();
    }, [id]);

    const handleFormChange = useCallback((e) => {
        setFormdata(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);


    const handleDocumentRequest = useCallback(async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await requestDocuemtnRequest(formdata);
            toast.success(res.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setOpen(false);
            setSubmitLoading(false);
            getDocument();
        }
    }, [formdata]);

    const hadleUpload = useCallback(async (e, document_id) => {
        try {
            const [file] = e.target.files;
            const formdata = {
                file,
                document_id
            }

            const res = await uploadDocumentRequest(formdata);
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }finally{
            getDocument()
        }
    }, []);


    const handleUpdateStatus = useCallback(async (status,document_id) => {
        try {
            const formdata = {
                status,
                document_id
            }

            const res = await updateStatusRequest(formdata);
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }finally{
            getDocument();
        }
    },[])


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
                        <h1 className="text-3xl font-semibold text-foreground-primary">Projects Documents</h1>
                        <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all' onClick={() => setOpen(true)}>
                            Request Document
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
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Status</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-primary">
                            {
                                documents.map((document, index) => (
                                    <TableRow key={document.document_id}>
                                        <TableCell className='border-r border-primary last:border-r-0 cursor-pointer text-foreground-primary'>
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                            {document.name}
                                        </TableCell>

                                        <TableCell className="border-r border-primary last:border-r-0 !p-1 text-center text-foreground-primary">
                                            {document.description}
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                            {moment(document.created_at).format("DD MMM YYYY")}
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-1 text-center text-foreground-primary'>
                                            {
                                                user?.Role == "PROVIDER" &&
                                                (
                                                    <Select onValueChange={(status) => handleUpdateStatus(status,document.document_id)} value={document.status} className='w-full'>
                                                        <SelectTrigger className="w-full bg-primary text-foreground-primary">
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-primary">
                                                            <SelectGroup>
                                                                <SelectLabel className="text-foreground-primary">Status</SelectLabel>
                                                                <SelectItem value="PENDING" className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">PENDING</SelectItem>
                                                                <SelectItem value="REJECTED" className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">REJECTED</SelectItem>
                                                                <SelectItem value="APPROVED" className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">APPROVED</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )
                                            }
                                            {
                                                user?.Role == "CLIENT" &&
                                                (
                                                    <span className="text-foreground-primary">{document.status}</span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-1 text-foreground-primary text-center relative cursor-pointer group'>
                                            {
                                                user?.Role == "PROVIDER" &&
                                                (
                                                    <>
                                                        {
                                                            document.filename &&
                                                            <a target='__black' href={document.file_url} className='text-tbutton-bg hover:text-tbutton-hover underline'>{document.filename}</a>
                                                        }

                                                        {
                                                            !document.filename &&
                                                            <span>No Document Uploaded</span>
                                                        }
                                                    </>
                                                )
                                            }
                                            {
                                                user?.Role == "CLIENT" &&
                                                (
                                                    <div className='flex items-center gap-3'>
                                                        {
                                                            document.filename &&
                                                            <a target='__black' href={document.file_url} className='text-tbutton-bg hover:text-tbutton-hover underline'>{document.filename}</a>
                                                        }
                                                        <Input
                                                            type="file"
                                                            onChange={(e) => hadleUpload(e, document.document_id)}
                                                            className="bg-primary text-foreground-primary"
                                                        />
                                                    </div>
                                                )
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

                <form className='space-y-8 mt-20 px-5' onSubmit={handleDocumentRequest}>

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground-primary">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Document Name"
                            value={formdata.name}
                            onChange={handleFormChange}
                            required
                            className="bg-primary text-foreground-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground-primary">Description</Label>
                        <Textarea
                            id="description"
                            type="text"
                            name="description"
                            placeholder="Document Description"
                            value={formdata.description}
                            onChange={handleFormChange}
                            required
                            className="bg-primary text-foreground-primary"
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