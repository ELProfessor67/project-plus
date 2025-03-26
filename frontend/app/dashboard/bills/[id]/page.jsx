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
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

import { useUser } from '@/providers/UserProvider';
import { Button } from '@/components/Button';
import BigDialog from '@/components/Dialogs/BigDialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { createBillingRequest, getBillingRequest, getByDateRange, getDocuemtnRequest, getUpdatesRequest, giveUpdateRequest, requestDocuemtnRequest, updateBillingStatusRequest, updateStatusRequest, uploadDocumentRequest } from '@/lib/http/client';
import Loader from '@/components/Loader';
import moment from 'moment';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const page = ({ params }) => {
    const { id } = use(params);
    const [open, setOpen] = useState(false);
    const [bills, setBills] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false)
    const [formdata, setFormdata] = useState({
        description: '',
        project_client_id: id,
        calls: {
            count: 0,
            amount: 0,
            duration: 0
        },
        chats: {
            count: 0,
            amount: 0
        },
        meetings: {
            count: 0,
            amount: 0
        },
        mails: {
            count: 0,
            amount: 0
        },
        updates: {
            count: 0,
            amount: 0
        },
        documents: {
            count: 0,
            amount: 0
        },
        total: 0,
    });

    const [info, setInfo] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { user } = useUser();

    const getBills = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getBillingRequest(id);
            setBills(res.data.billings)
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getBills();
    }, [id]);




    const handleCreateBill = useCallback(async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const formData = {
                project_client_id: id, start_date: startDate, end_date: endDate, amount: formdata.total, description: formdata.description
            }
            const res = await createBillingRequest(formData);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
        } finally {
            setSubmitLoading(false);
            setOpen(false);
            getBills();
        }
    }, [formdata, id, startDate, endDate]);



    const getInfo = useCallback(async () => {
        try {
            const res = await getByDateRange(startDate, endDate, id);
            setInfo(res.data.info);
            const data = res.data.info;
            setFormdata(prev => ({ ...prev, calls: { count: data.calls.length, duration: data.callDurations, amount: 0 } }));
            setFormdata(prev => ({ ...prev, mails: { count: data.mails.length, amount: 0 } }));
            setFormdata(prev => ({ ...prev, meetings: { count: data.meetings.length, amount: 0 } }));
            setFormdata(prev => ({ ...prev, chats: { count: data.chats.length, amount: 0 } }));
            setFormdata(prev => ({ ...prev, documents: { count: data.documents.length, amount: 0 } }));
            setFormdata(prev => ({ ...prev, updates: { count: data.updates.length, amount: 0 } }));
        } catch (error) {
            console.log(error.response.data.message);
        }
    }, [id, startDate, endDate]);


    const handleUpdateStatus = useCallback(async (status, billing_id) => {
        try {
            const formdata = {
                status,
                billing_id
            }
            const res = await updateBillingStatusRequest(formdata);
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            getBills();
        }
    }, [])

    useEffect(() => {
        if (startDate && endDate && id) {
            getInfo();
        }
    }, [id, startDate, endDate]);


    useEffect(() => {
        const newTotal =
            +formdata.calls.amount +
            +formdata.chats.amount +
            +formdata.meetings.amount +
            +formdata.mails.amount +
            +formdata.updates.amount +
            +formdata.documents.amount;

        setFormdata(prevState => ({
            ...prevState,
            total: newTotal
        }));
    }, [formdata.calls.amount, formdata.chats.amount, formdata.meetings.amount, formdata.mails.amount, formdata.updates.amount, formdata.documents.amount]);


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
                        <h1 className="text-3xl font-semibold text-gray-800">Project Bills</h1>
                        <Button className='bg-blue-500 border border-white text-white hover:bg-gray-200 ' onClick={() => setOpen(true)}>
                            Create Bill
                        </Button>
                    </div>
                }



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
                                            {
                                                user?.Role == "PROVIDER" &&
                                                (
                                                    <Select onValueChange={(status) => handleUpdateStatus(status, bill.billing_id)} value={bill.status} className='w-full'>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Status</SelectLabel>
                                                                <SelectItem value="PAID">PAID</SelectItem>
                                                                <SelectItem value="UNPAID">UNPAID</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )
                                            }
                                            {
                                                user?.Role == "CLIENT" &&
                                                (
                                                    <span>{bill.status}</span>
                                                )
                                            }
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
            </main>


            <BigDialog open={open} onClose={() => setOpen(false)} width={'38'}>
                <h1 className='text-center text-3xl font-medium'>Create Bill</h1>
                <form className='space-y-8 mt-4 px-5' onSubmit={handleCreateBill}>
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            id="startDate"
                            type="date"
                            name="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                            id="endDate"
                            type="date"
                            name="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className='flex items-start justify-center flex-col gap-4'>
                        <h3>Edit Bills</h3>
                        <div className='w-full grid grid-cols-3 place-items-end gap-5'>
                            <div className='flex flex-col gap-2'>
                                <label>Total Call is {formdata.calls.count} and duration is {formdata.calls.duration} min</label>
                                <Input type="number" min={0} placeholder="Amount" value={formdata.calls.amount} onChange={(e) => setFormdata(prev => ({ ...prev, calls: { ...formdata.calls, amount: e.target.value } }))} />
                            </div>


                            <div className='flex flex-col gap-2'>
                                <label>Total Mails is {formdata.mails.count}</label>
                                <Input type="number" min={0} placeholder="Amount" value={formdata.mails.amount} onChange={(e) => setFormdata(prev => ({ ...prev, mails: { ...formdata.mails, amount: e.target.value } }))} />
                            </div>


                            <div className='flex flex-col gap-2'>
                                <label>Total Meeting is {formdata.meetings.count}</label>
                                <Input type="number" min={0} placeholder="Amount" value={formdata.meetings.amount} onChange={(e) => setFormdata(prev => ({ ...prev, meetings: { ...formdata.meetings, amount: e.target.value } }))} />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label>Total Chats is {formdata.chats.count}</label>
                                <Input type="number" min={0} placeholder="Amount" value={formdata.chats.amount} onChange={(e) => setFormdata(prev => ({ ...prev, chats: { ...formdata.chats, amount: e.target.value } }))} />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label>Total Documents is {formdata.documents.count}</label>
                                <Input type="number" min={0} placeholder="Amount" value={formdata.documents.amount} onChange={(e) => setFormdata(prev => ({ ...prev, documents: { ...formdata.documents, amount: e.target.value } }))} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label>Total Updates is {formdata.updates.count}</label>
                                <Input type="number" min={0} placeholder="Amount" value={formdata.updates.amount} onChange={(e) => setFormdata(prev => ({ ...prev, updates: { ...formdata.updates, amount: e.target.value } }))} />
                            </div>
                        </div>

                        <h2>Total: ${formdata.total}</h2>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={formdata.description}
                            onChange={(e) => setFormdata(prev => ({ ...prev, description: e.target.value }))}
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