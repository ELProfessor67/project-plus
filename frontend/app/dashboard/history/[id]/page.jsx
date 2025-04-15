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
            <div className=" h-screen bg-white m-2 rounded-md flex items-center justify-center">
                <Loader />
            </div>
        </>
    }

    return (
        <div className="flex h-screen flex-col bg-white m-2 rounded-md overflow-y-auto items-start p-8">
            <h1 className='text-3xl font-medium'>Client History</h1>
            <div className='flex items-center h-[3rem] rounded-md bg-gray-200 w-full mt-5 gap-2'>
                <Button className={'bg-blue-500'} onClick={() => setSelectedTab("document")}>
                    Documents
                </Button>
                <Button className={'bg-blue-500'} onClick={() => setSelectedTab("signed")}>
                    Signature
                </Button>
                <Button className={'bg-blue-500'} onClick={() => setSelectedTab("bill")}>
                    Bills
                </Button>
                <Button className={'bg-blue-500'} onClick={() => setSelectedTab("updates")}>
                    Updates
                </Button>
                <Button className={'bg-blue-500'} onClick={() => setSelectedTab("filed")}>
                    Filed
                </Button>
            </div>

            {
                selectedTab == "document" &&
                <div className='mt-4 w-full'>

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
                                                <span>{document.status}</span>
                                            </TableCell>
                                            <TableCell className={`border-r last:border-r-0 !p-1 text-black text-center relative cursor-pointer group`}>
                                                {

                                                    document.filename &&
                                                    <a target='__black' href={document.file_url} className='text-blue-500 underline'>{document.filename}</a>
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
                                    signed.map((document, index) => (
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
                                                <span>{document.status}</span>
                                            </TableCell>
                                            <TableCell className={`border-r last:border-r-0 !p-1 text-black text-center relative cursor-pointer group`}>

                                                {

                                                    document.sign_file_url &&
                                                    <>
                                                        <a target='__black' href={document.sign_file_url} className='text-blue-500 underline mr-3'>OPEN</a>
                                                        <Link href={`/dashboard/signature/${document.signed_id}?file=${document.sign_file_url ? document.sign_file_url : document.file_url}&type=${document.mimeType}`} className='text-blue-500 underline'>Signature</Link>
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
                        <Table className="border-collapse border rounded-md">
                            <TableHeader className="border-b">
                                <TableRow>
                                    <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                                    <TableHead className="w-[300px] border-r last:border-r-0">Description</TableHead>
                                    <TableHead className="border-r last:border-r-0">Date</TableHead>
                                    <TableHead className="border-r last:border-r-0">Status</TableHead>
                                    <TableHead className="border-r last:border-r-0">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y">
                                {
                                    bills && bills.map((bill, index) => (
                                        <TableRow>
                                            <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                                                {index + 1}
                                            </TableCell>

                                            <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                                {bill.description}
                                            </TableCell>
                                            <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                                {bill.start_date} - {bill.end_date}
                                            </TableCell>

                                            <TableCell className={`border-r last:border-r-0 !p-1 text-black text-center relative cursor-pointer group`}>
                                                <span>{bill.status}</span>
                                            </TableCell>

                                            <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
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
                                                        ) :
                                                        "No FIle Attach"
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
                        <Table className="border-collapse border rounded-md">
                            <TableHeader className="border-b">
                                <TableRow>
                                    <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                                    <TableHead className="w-[300px] border-r last:border-r-0">Name</TableHead>
                                    <TableHead className="border-r last:border-r-0">Description</TableHead>
                                    <TableHead className="border-r last:border-r-0">Date</TableHead>
                                    <TableHead className="border-r last:border-r-0">Progress</TableHead>
                                    <TableHead className="border-r last:border-r-0">Status</TableHead>
                                    <TableHead className="border-r last:border-r-0">Document</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y">
                                {
                                    filed.map((file, index) => (
                                        <TableRow>
                                            <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                                                {index + 1}
                                            </TableCell>

                                            <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                                {file.name}
                                            </TableCell>

                                            <TableCell className="border-r last:border-r-0 !p-1 text-center">
                                                {file.description}
                                            </TableCell>
                                            <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                                {moment(file.date).format("DD MMM YYYY")}
                                            </TableCell>
                                            <TableCell className="border-r last:border-r-0 !p-1 text-center">
                                                {file.progress}
                                            </TableCell>
                                            <TableCell className={`border-r last:border-r-0 !p-1 text-center`}>

                                                <span>{file.status}</span>
                                            </TableCell>

                                            <TableCell className={`border-r last:border-r-0 !p-1 text-center`}>

                                                {

                                                    file.filename &&
                                                    <a target='__black' href={file.file_url} className='text-blue-500 underline'>{file.filename}</a>
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