import React from 'react'
import { Card, CardContent } from './ui/card'
import RenderMembers from './RenderMembers'
import moment from 'moment'
import { Clock } from 'lucide-react'
import RenderTranscibtionChat from './RenderTranscibtionChat'
import { Badge } from './ui/badge'

const RenderMeeting = ({ meetings }) => {
    return (
        <div className='px-2 py-4 space-y-16'>
            {
                meetings?.map((meeting) => (
                    <Card className='border-none shadow-gray-50'>
                        <CardContent className='p-3'>
                            <div className='flex justify-between items-center'>
                                <h3 className='text-gray-700 text-lg'>{meeting.created_by == 1 ? 'You created a meeting' : 'You joined a meeting'}</h3>
                                <RenderMembers members={meeting.participants} />
                                <p className='flex items-center gap-3 text-gray-600'><Clock size={16} /> {meeting.duration}min</p>
                                <Badge className={`py-2 px-4 ${meeting.status == 'SCHEDULED' ? "bg-green-500" : meeting.status == 'CANCELED' ? 'bg-red-500' : 'bg-gray-500'}`}> {meeting.status}</Badge>
                                <time className='font-light text-gray-700 text-sm'>{moment(meeting.created_at).format("DD MMM YYYY")}</time>
                            </div>

                            <div className='mt-12'>
                                <h2 className='text-3xl'>{meeting.heading}</h2>
                                <p className='mt-2 text-gray-600'>{meeting.description}</p>
                                <p className=' text-gray-600 mt-5'><strong>Start At:</strong> {moment(meeting.start_time).format('LLL')}</p>
                                <p className='mt-2 text-gray-600'><strong>End At:</strong> {meeting?.end_time ? moment(meeting.end_time).format('LLL') : 'Proccessing'}</p>
                            </div>

                            {
                                meeting.transcribtions != 0 &&
                                <div className='py-2 px-2 space-y-8 mt-6'>
                                    <RenderTranscibtionChat transcribtion={meeting.transcribtions} />
                                </div>
                            }

                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}

export default RenderMeeting