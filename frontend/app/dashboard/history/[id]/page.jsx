'use client'
import { Button } from '@/components/Button'
import { getHistoryRequest } from '@/lib/http/client';
import moment from 'moment';
import React, { useState, useEffect, use, useCallback } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import Link from 'next/link';

const page = ({ params }) => {
    const { id } = use(params);
    const [documents, setDocuments] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [filed, setFiled] = useState([]);
    const [bills, setBilling] = useState([]);
    const [signed, setSigned] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedTab, setSelectedTab] = useState("document");

    const getDocument = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getHistoryRequest(id);

            setDocuments(res?.data?.documents);
            setUpdates(res?.data?.updates);
            setBilling(res?.data?.billings);
            setSigned(res?.data?.signed);
            setFiled(res?.data?.filed);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getDocument();
    }, [id]);


    if (loading) {
        return <>
            <div className="h-screen bg-secondary m-2 rounded-md flex items-center justify-center">
                <Loader />
            </div>
        </>
    }

    return (
        <div className="flex h-screen flex-col bg-secondary m-2 rounded-md overflow-y-auto items-start p-8">
            <h1 className='text-3xl font-medium text-foreground-primary'>Client History</h1>
            <div className='flex items-center h-[3rem] rounded-md bg-primary w-full mt-5 gap-2'>
                <Button 
                    className={`${selectedTab === "document" ? 'bg-tbutton-bg text-tbutton-text' : 'bg-primary text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text'} transition-all`} 
                    onClick={() => setSelectedTab("document")}
                >
                    Documents
                </Button>
                <Button 
                    className={`${selectedTab === "signed" ? 'bg-tbutton-bg text-tbutton-text' : 'bg-primary text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text'} transition-all`} 
                    onClick={() => setSelectedTab("signed")}
                >
                    Signature
                </Button>
                <Button 
                    className={`${selectedTab === "bill" ? 'bg-tbutton-bg text-tbutton-text' : 'bg-primary text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text'} transition-all`} 
                    onClick={() => setSelectedTab("bill")}
                >
                    Bills
                </Button>
                <Button 
                    className={`${selectedTab === "updates" ? 'bg-tbutton-bg text-tbutton-text' : 'bg-primary text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text'} transition-all`} 
                    onClick={() => setSelectedTab("updates")}
                >
                    Updates
                </Button>
                <Button 
                    className={`${selectedTab === "filed" ? 'bg-tbutton-bg text-tbutton-text' : 'bg-primary text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text'} transition-all`} 
                    onClick={() => setSelectedTab("filed")}
                >
                    Filed
                </Button>
            </div>

            {
                selectedTab == "document" &&
                <div className='mt-4 w-full'>
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
                                                <span>{document.status}</span>
                                            </TableCell>
                                            <TableCell className='border-r border-primary last:border-r-0 !p-1 text-foreground-primary text-center relative cursor-pointer group'>
                                                {
                                                    document.filename &&
                                                    <a target='__black' href={document.file_url} className='text-tbutton-bg hover:text-tbutton-hover underline'>{document.filename}</a>
                                                }

                                                {
                                                    !document.filename &&
                                                    <span>No Document Uploaded</span>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            }

            {
                selectedTab == "signed" &&
                <div className='mt-4 w-full'>
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
                                    signed.map((document, index) => (
                                        <TableRow key={document.signed_id}>
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
                                                <span>{document.status}</span>
                                            </TableCell>
                                            <TableCell className='border-r border-primary last:border-r-0 !p-1 text-foreground-primary text-center relative cursor-pointer group'>
                                                {
                                                    document.sign_file_url &&
                                                    <>
                                                        <a target='__black' href={document.sign_file_url} className='text-tbutton-bg hover:text-tbutton-hover underline mr-3'>OPEN</a>
                                                        <Link href={`/dashboard/signature/${document.signed_id}?file=${document.sign_file_url ? document.sign_file_url : document.file_url}&type=${document.mimeType}`} className='text-tbutton-bg hover:text-tbutton-hover underline'>Signature</Link>
                                                    </>
                                                }

                                                {
                                                    !document.sign_file_url &&
                                                    <span>NA</span>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            }

            {
                selectedTab == "bill" &&
                <div className='mt-4 w-full'>
                    <div className="flex-1 overflow-auto">
                        <Table className="border-collapse border border-primary rounded-md">
                            <TableHeader className="border-b border-primary">
                                <TableRow>
                                    <TableHead className="!w-[80px] border-r border-primary last:border-r-0 text-foreground-primary">#</TableHead>
                                    <TableHead className="w-[300px] border-r border-primary last:border-r-0 text-foreground-primary">Description</TableHead>
                                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Date</TableHead>
                                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Status</TableHead>
                                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-primary">
                                {
                                    bills && bills.map((bill, index) => (
                                        <TableRow key={bill.billing_id}>
                                            <TableCell className='border-r border-primary last:border-r-0 cursor-pointer text-foreground-primary'>
                                                {index + 1}
                                            </TableCell>

                                            <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                                {bill.description}
                                            </TableCell>
                                            <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                                {bill.start_date} - {bill.end_date}
                                            </TableCell>

                                            <TableCell className='border-r border-primary last:border-r-0 !p-1 text-foreground-primary text-center relative cursor-pointer group'>
                                                <span>{bill.status}</span>
                                            </TableCell>

                                            <TableCell className='border-r border-primary last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer'>
                                                {bill.amount}$
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            }

            {
                selectedTab == "updates" &&
                <div className='mt-4 w-full'>
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
                                        <TableRow key={document.update_id}>
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
                                                        ) :
                                                        "No File Attach"
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            }

            {
                selectedTab == "filed" &&
                <div className='mt-4 w-full'>
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
                                        <TableRow key={file.filed_id}>
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
                                                <span>{file.status}</span>
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
                </div>
            }
        </div>
    )
}

export default page