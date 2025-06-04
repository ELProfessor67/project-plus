import React from 'react'
import { Card, CardContent } from './ui/card'
import RenderMembers from './RenderMembers'
import moment from 'moment'
import { Clock } from 'lucide-react'
import RenderTranscibtionChat from './RenderTranscibtionChat'
import { Badge } from './ui/badge'

const RenderMeeting = ({ meetings }) => {
    return (
        <div className='px-2 py-4 space-y-8'>
            {
                meetings?.map((meeting) => (
                    <Card className='border border-primary bg-primary shadow-sm hover:shadow-md transition-all duration-300'>
                        <CardContent className='p-6'>
                            <div className='flex flex-wrap justify-between items-center gap-4'>
                                <div className='flex items-center gap-4'>
                                    <h3 className='text-foreground-primary text-lg font-medium'>{meeting.created_by == 1 ? 'You created a meeting' : 'You joined a meeting'}</h3>
                                    <Badge className={`py-2 px-4 ${
                                        meeting.status == 'SCHEDULED' 
                                            ? "bg-green-500 text-white" 
                                            : meeting.status == 'CANCELED' 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-tbutton-bg text-tbutton-text'
                                    }`}> {meeting.status}</Badge>
                                </div>
                                <div className='flex items-center gap-6'>
                                    <RenderMembers members={meeting.participants} />
                                    <p className='flex items-center gap-2 text-foreground-secondary'><Clock size={16} /> {meeting.duration}min</p>
                                    <time className='font-light text-foreground-secondary text-sm'>{moment(meeting.created_at).format("DD MMM YYYY")}</time>
                                </div>
                            </div>

                            <div className='mt-8 space-y-4'>
                                <div className='space-y-2'>
                                    <h2 className='text-3xl font-semibold text-foreground-primary'>{meeting.heading}</h2>
                                    <p className='text-foreground-secondary leading-relaxed'>{meeting.description}</p>
                                </div>
                                
                                <div className='flex flex-wrap gap-6 text-foreground-secondary'>
                                    <div className='flex items-center gap-2'>
                                        <strong className='text-foreground-primary'>Start At:</strong> 
                                        <span>{moment(meeting.start_time).format('LLL')}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <strong className='text-foreground-primary'>End At:</strong> 
                                        <span>{meeting?.end_time ? moment(meeting.end_time).format('LLL') : 'Processing'}</span>
                                    </div>
                                </div>
                            </div>

                            {
                                meeting.transcribtions != 0 &&
                                <div className='py-4 px-2 space-y-8 mt-8 border-t border-primary/20'>
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