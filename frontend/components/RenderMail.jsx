import React from 'react'
import { Card, CardContent } from './ui/card'
import RenderMembers from './RenderMembers'
import moment from 'moment'
import { Clock } from 'lucide-react'
import RenderTranscibtionChat from './RenderTranscibtionChat'
import AvatarCompoment from './AvatarCompoment'

const RenderMail = ({mails, selectedMail, setSelectedMail} ) => {
  return (
    <div className='px-2 py-4 space-y-6'>
        {
            mails?.map((mail) => (
                <Card className=' border-none shadow-gray-50 cursor-pointer' onClick={() => setSelectedMail(mail)}>
                    <CardContent className='p-3'>
                        <div className='flex justify-between items-center'>
                            
                            <div className='flex items-center gap-2'>
                                <AvatarCompoment name={mail.user.name}/>
                                <h3 className='text-gray-700 text-md font-medium'>{mail.user.name}</h3>
                            </div>
                            <time className='text-gray-400 text-sm ml-3'>{moment(mail.created_at).format("DD MMM YYYY")}</time>
                        </div>
                        <h3 className='text-xl text-gray-700 mt-4'>{mail.subject}</h3>
                        <p className='text-gray-500 leading-5 mt-2 text-md'>{mail.content.slice(0,200)}</p>
                    </CardContent>
                </Card>
            ))
        }
    </div>
  )
}

export default RenderMail