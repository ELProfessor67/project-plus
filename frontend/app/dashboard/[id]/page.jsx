'use client'
import { Button } from '@/components/Button';
import { getOverviewRequest, getPedingDocsByIdRequest, uploadDocumentRequest } from '@/lib/http/client';
import { useUser } from '@/providers/UserProvider';
import { getRecentDatesWithLabels } from '@/utils/getRecentDatesWithLabels';
import { Info, Search } from 'lucide-react';
import React, { use, useCallback, useEffect, useState } from 'react'
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import moment from 'moment';
import Link from 'next/link';

const ClientDashbaord = ({ params, searchParams }) => {
    const [updates, setUpdates] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [pendingDocuments, setPendingDocuments] = useState([]);
    const [mails, setMails] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [calls, setCalls] = useState([]);
    const [callDurations, setCallDurations] = useState("0");

    const [dates, setDates] = useState(getRecentDatesWithLabels(20));
    const [selectedDate, setSelectedDate] = useState(dates[0].date);

    const { id } = use(params);
    const { client_id } = use(searchParams);
    const { user } = useUser();

    const getOverview = useCallback(async () => {
        try {
            const res = await getOverviewRequest(selectedDate, user.user_id, id);
            setUpdates(res.data.overview.updates);
            setDocuments(res.data.overview.documents);
            setMails(res.data.overview.mails);
            setMeetings(res.data.overview.meetings);
            setCalls(res.data.overview.calls);
            setCallDurations(res.data.overview.callDurations);
        } catch (error) {
            console.log(error.message, error?.response?.data?.message)
        }
    }, [id, selectedDate, user]);

    useEffect(() => {
        if (user) {
            getOverview()
        }
    }, [user, selectedDate]);



    const getDocument = useCallback(async () => {

        try {
            const res = await getPedingDocsByIdRequest(id);
            setPendingDocuments(res?.data);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    }, [id]);

    useEffect(() => {
        getDocument();
    }, [id]);




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
        } finally {
            getDocument()
        }
    }, []);
    return (
        <div className="flex h-screen flex-col bg-white m-2 rounded-md overflow-y-auto">
            <div className="flex flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold">Overview</h1>
                        <Info className="h-4 w-4 text-gray-400" />
                    </div>
                </div>

                <div className="flex items-center justify-end">

                    <div className="flex items-center gap-2 justify-end">

                        <Select onValueChange={(value) => setSelectedDate(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Today</SelectLabel>
                                    <SelectItem value={null}>ALL</SelectItem>
                                    {
                                        dates.map(date => (
                                            <SelectItem value={date.date} key={date.date}>{date.label}</SelectItem>
                                        ))
                                    }

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-3 p-8 gap-8'>
                <Link href={`/dashboard/updates/${client_id}`}>
                    <div className='h-[15rem] rounded-md bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center flex-col gap-3 cursor-pointer'>
                        <h3 className='text-white text-xl opacity-80'>Total Updates</h3>
                        <h1 className='text-white text-9xl'>{updates.length}</h1>
                    </div>
                </Link>
                <Link href={`/dashboard/documents/${client_id}`}>
                    <div className='h-[15rem] rounded-md bg-gradient-to-r from-rose-400 to-red-500 flex items-center justify-center flex-col gap-3 cursor-pointer'>
                        <h3 className='text-white text-xl opacity-80'>Total Documets</h3>
                        <h1 className='text-white text-9xl'>{documents.length}</h1>
                    </div>
                </Link>
                <Link href={`/dashboard/mail`}>
                    <div className='h-[15rem] rounded-md bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center flex-col gap-3 cursor-pointer'>
                        <h3 className='text-white text-xl opacity-80'>Total Mails</h3>
                        <h1 className='text-white text-9xl'>{mails.length}</h1>
                    </div>
                </Link>
                <Link href={`/dashboard/meeting`}>
                    <div className='h-[15rem] rounded-md bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center flex-col gap-3 cursor-pointer'>
                        <h3 className='text-white text-xl opacity-80'>Total Meetings</h3>
                        <h1 className='text-white text-9xl'>{meetings.length}</h1>
                    </div>
                </Link>
                <div className='h-[15rem] rounded-md bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center flex-col gap-3'>
                    <h3 className='text-white text-xl opacity-80'>Total Calls</h3>
                    <h1 className='text-white text-9xl'>{calls.length}</h1>
                </div>
                <div className='h-[15rem] rounded-md bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center flex-col gap-3'>
                    <h3 className='text-white text-xl opacity-80'>Total Call Duration</h3>
                    <h1 className='text-white text-9xl flex items-end'>{callDurations} <span className='text-4xl mb-4'>min</span></h1>
                </div>
            </div>


            <div>
                <h2>Pending Documents</h2>
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
                                pendingDocuments && pendingDocuments.map((document, index) => (
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            }

                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ClientDashbaord