import React from 'react'
import { Card, CardContent } from './ui/card'
import RenderMembers from './RenderMembers'
import moment from 'moment'
import {  Clock } from 'lucide-react'
import { useUser } from '@/providers/UserProvider'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from './Button'
import Link from 'next/link'
import { Badge } from './ui/badge'

const RenderScheduleMeeting = ({ meetings }) => {
    const { user } = useUser();
    return (
        <div className='px-2 py-4 space-y-20 mt-10'>
            {
                meetings?.map((meeting) => (
                    <Card className='border-none shadow-gray-50'>
                        <CardContent className='p-3'>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-gray-700 text-lg'>{meeting.user_id == user?.user_id ? 'You created a meeting' : 'You participant a meeting'}</h3>
                                <RenderMembers members={meeting.participants} />
                               <Badge className={`py-2 px-4 ${meeting.status == 'SCHEDULED' ? "bg-green-500" : meeting.status == 'CANCELED' ? 'bg-red-500' : 'bg-gray-500' }`}> {meeting.status}</Badge>
                                <time className='text-gray-600 text-md'>{moment(meeting.created_at).format("DD MMM YYYY")}</time>

                            </div>

                            <div className='mt-8'>
                                <h2 className='text-3xl'>{meeting.heading}</h2>
                                <p className='mt-2 text-gray-600'>{meeting.description}</p>
                                <p className='flex items-center gap-4 text-gray-600 mt-2'><strong className='text-black'>Scheduled Time:</strong> {moment(meeting.date).format("lll")}</p>
                                {
                                    meeting.status == "SCHEDULED" && (
                                        <Link className={'text-blue-500 my-2'} href={`/meeting/${meeting.meeting_id}`}>Join Now</Link>
                                    )
                                }
                            </div>

                            <div className="mt-8">
                                <Table className="border-collapse border rounded-md">
                                    <TableHeader className="border-b">
                                        <TableRow>
                                            <TableHead className="border-r last:border-r-0 text-white bg-yellow-600">Name</TableHead>
                                            <TableHead className="border-r last:border-r-0 text-white bg-red-600">Opinion</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y">
                                        {
                                            meeting?.participants.map((participant) => (
                                                <TableRow key={participant.meeting_participant_id}>
                                                    <TableCell className='border-r last:border-r-0 cursor-pointer text-gray-600'>
                                                        {participant.user.name}
                                                    </TableCell>
                                                    <TableCell className='border-r last:border-r-0 cursor-pointer text-gray-600'>
                                                        {participant.vote == "PENDING" ? "NO RESPONSE" : participant.vote}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }

                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}

export default RenderScheduleMeeting