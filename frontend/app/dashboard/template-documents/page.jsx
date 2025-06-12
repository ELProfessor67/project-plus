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
import { createSignRequest, getDocuemtnRequest, getSignedRequest, requestDocuemtnRequest, updateSignedStatusRequest, updateStatusRequest, uploadDocumentRequest, uploadSignRequest } from '@/lib/http/client';
import Loader from '@/components/Loader';
import moment from 'moment';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { getTemplateFileRequest, sendToClientRequest, updateLawyerSendedDocumentRequest } from '@/lib/http/project';

const page = ({ params }) => {
    const { id } = use(params);
    const [open, setOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState({
        name: '',
        description: '',
        file: '',
        project_client_id: id
    });
    const [clients, setClients] = useState([]);
    const [selectFile, setSelectedFile] = useState(null);
    const [selectedClient, setSelectedClient] = useState('');
    const [description, setDescription] = useState('');
    const [sendingLoading, setSendingLoading] = useState(false);

    const { user } = useUser();
    const getDoucment = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getTemplateFileRequest();
            setDocuments(res?.data?.documents);
            setClients(res?.data?.clients)
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getDoucment();
    }, [id]);








    const handleUpdateStatus = useCallback(async (status, t_document_id) => {
        try {
            const formdata = {
                status
            }
            const res = await updateLawyerSendedDocumentRequest(t_document_id, formdata);
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            getDoucment();
        }
    }, []);

    const handleSendToClient = async () => {
        if (!selectedClient) {
            toast.error('Please select a client');
            return;
        }
        if (!description) {
            toast.error('Please enter a description');
            return;
        }

        setSendingLoading(true);
        try {
            // Add your API call here to send the document to client

            const formData = new FormData();
            formData.append("description", description);

            const fileResponse = await fetch(selectFile.file_url);
            const fileData = await fileResponse.arrayBuffer(); // or .blob()
            const blob = new Blob([fileData], { type: 'application/pdf' });

            formData.append("file", blob, selectFile.filename);
            formData.append("user_id", selectedClient);

            const response = await sendToClientRequest(formData);
            toast.success(response.data.message);
            setSelectedFile(null);
            setSelectedClient('');
            setDescription('');
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setSendingLoading(false);
        }
    };

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
                <div className="flex-1 overflow-auto">
                    <Table className="border-collapse border border-primary rounded-md">
                        <TableHeader className="border-b border-primary">
                            <TableRow>
                                <TableHead className="!w-[80px] border-r border-primary last:border-r-0 text-foreground-primary">#</TableHead>
                                <TableHead className="w-[300px] border-r border-primary last:border-r-0 text-foreground-primary">Description</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Date</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Status</TableHead>
                                <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">File</TableHead>
                                {
                                    user?.Role != "CLIENT" &&
                                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Action</TableHead>
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-primary">
                            {
                                documents.map((document, index) => (
                                    <TableRow>
                                        <TableCell className='border-r border-primary last:border-r-0 cursor-pointer text-foreground-primary'>
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                            {document.description}
                                        </TableCell>

                                        <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                            {moment(document.created_at).format("DD MMM YYYY")}
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-1 text-center text-foreground-primary'>
                                            <Select onValueChange={(status) => handleUpdateStatus(status, document.t_document_id)} value={document.status} className='w-full'>
                                                <SelectTrigger className="w-full text-black">
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
                                        </TableCell>
                                        <TableCell className='border-r border-primary last:border-r-0 !p-1 text-foreground-primary text-center relative cursor-pointer group'>
                                            <a target='__black' href={document.file_url} className='text-tbutton-bg hover:text-tbutton-hover underline mr-3'>OPEN</a>
                                        </TableCell>
                                        {
                                            user?.Role != "CLIENT" &&
                                            <TableCell className='border-r border-primary last:border-r-0 !p-1 text-foreground-primary text-center relative cursor-pointer group'>
                                                <Button onClick={() => setSelectedFile(document)}>Send To Client</Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </main>


            <BigDialog open={!!selectFile} onClose={() => setSelectedFile(null)}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground-primary">Send Document to Client</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-foreground-secondary">Select Client</Label>
                            <Select value={selectedClient} onValueChange={setSelectedClient}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a client" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {clients.map((client) => (
                                            <SelectItem key={client.user_id} value={client.user_id}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-foreground-secondary">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter description"
                                className="w-full text-foreground-black"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setSelectedFile(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSendToClient} disabled={sendingLoading}>
                                {sendingLoading ? 'Sending...' : 'Send to Client'}
                            </Button>
                        </div>
                    </div>
                </div>
            </BigDialog>
        </>
    )
}

export default page