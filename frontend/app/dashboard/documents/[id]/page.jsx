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
                        <h1 className="text-3xl font-semibold text-gray-800">Projects Documents</h1>
                        <Button className='bg-blue-500 border border-white text-white hover:bg-gray-200 ' onClick={() => setOpen(true)}>
                            Request Document
                        </Button>
                    </div>
                }

                <div className="flex-1 overflow-auto">
                    <Table className="border-collapse border rounded-md">
                        <TableHeader className="border-b">
                            <TableRow>
                                <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                                <TableHead className="w-[300px] border-r last:border-r-0">Name</TableHead>
                                <TableHead className="border-r last:border-r-0">Description</TableHead>
                                <TableHead className="border-r last:border-r-0">Date</TableHead>
                                <TableHead className="border-r last:border-r-0">Status</TableHead>
                                <TableHead className="border-r last:border-r-0">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y">
                            {
                                documents.map((document, index) => (
                                    <TableRow>
                                        <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                            {document.name}
                                        </TableCell>

                                        <TableCell className="border-r last:border-r-0 !p-1 text-center">
                                            {document.description}
                                        </TableCell>
                                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                            {moment(document.created_at).format("DD MMM YYYY")}
                                        </TableCell>
                                        <TableCell className={`border-r last:border-r-0 !p-1 text-center`}>




                                            {
                                                user?.Role == "PROVIDER" &&
                                                (
                                                    <Select onValueChange={(status) => handleUpdateStatus(status,document.document_id)} value={document.status} className='w-full'>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Status</SelectLabel>
                                                                <SelectItem value="PENDING">PENDING</SelectItem>
                                                                <SelectItem value="REJECTED">REJECTED</SelectItem>
                                                                <SelectItem value="APPROVED">APPROVED</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )
                                            }
                                            {
                                                user?.Role == "CLIENT" &&
                                                (
                                                    <span>{document.status}</span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell className={`border-r last:border-r-0 !p-1 text-black text-center relative cursor-pointer group`}>
                                            {
                                                user?.Role == "PROVIDER" &&
                                                (
                                                    <>
                                                        {

                                                            document.filename &&
                                                            <a target='__black' href={document.file_url} className='text-blue-500 underline'>{document.filename}</a>
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
                                                            <a target='__black' href={document.file_url} className='text-blue-500 underline'>{document.filename}</a>
                                                        }
                                                        <Input
                                                            type="file"
                                                            onChange={(e) => hadleUpload(e, document.document_id)}
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
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Document Name"
                            value={formdata.name}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            type="text"
                            name="description"
                            placeholder="Document Description"
                            value={formdata.description}
                            onChange={handleFormChange}
                            required
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