import React from 'react'
import AvatarCompoment from './AvatarCompoment'
import moment from 'moment'
import { Button } from './Button'
import Link from 'next/link'

const RenderClient = ({ members }) => {
    console.log(members)
    return (
        <div className='space-y-5 overflow-x-auto h-[30rem]'>
            {
                members && members.map(member => (
                    <div className='flex items-center justify-between w-full shadow-md rounded-md border border-gray-50'>
                        <div className='flex items-center gap-4 p-2'>
                            <AvatarCompoment name={member?.user?.name} className="!w-[4rem] !h-[4rem] text-3xl" />
                            <div>
                                <h2 className='opacity-80 text-lg'>{member?.user?.name}</h2>
                                <time className='font-light text-gray-700 text-sm'>{moment(member.added_at).format("DD MMM YYYY")}</time>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 p-2'>
                            <Link href={`/dashboard/updates/${member?.project_client_id}`}>
                                <Button className='bg-blue-500 border border-white text-white hover:bg-gray-200 '>
                                    Updates
                                </Button>
                            </Link>
                            <Link href={`/dashboard/documents/${member?.project_client_id}`}>
                                <Button className='bg-blue-500 border border-white text-white hover:bg-gray-200 '>
                                    Documents
                                </Button>
                            </Link>
                            <Link href={`/dashboard/bills/${member?.project_client_id}`}>
                                <Button className='bg-blue-500 border border-white text-white hover:bg-gray-200 '>
                                    Bill
                                </Button>
                            </Link>
                        </div>

                    </div>
                ))
            }
        </div>
    )
}

export default RenderClient