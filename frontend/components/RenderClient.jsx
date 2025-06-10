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
                    <div className='flex items-center justify-between w-full shadow-md rounded-md border border-primary bg-primary'>
                        <div className='flex items-center gap-4 p-2 w-[15rem]'>
                            <AvatarCompoment name={member?.user?.name} className="!w-[4rem] !h-[4rem] text-3xl" />
                            <div>
                                <h2 className='text-foreground-primary text-lg'>{member?.user?.name}</h2>
                                <time className='text-foreground-secondary text-sm'>{moment(member.added_at).format("DD MMM YYYY")}</time>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 p-2 flex-wrap'>
                            <Link href={`/dashboard/filed/${member?.project_client_id}`}>
                                <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all'>
                                    Filed
                                </Button>
                            </Link>
                            <Link href={`/dashboard/updates/${member?.project_client_id}`}>
                                <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all'>
                                    Updates
                                </Button>
                            </Link>
                            <Link href={`/dashboard/documents/${member?.project_client_id}`}>
                                <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all'>
                                    Documents
                                </Button>
                            </Link>
                            <Link href={`/dashboard/bills/${member?.project_client_id}`}>
                                <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all'>
                                    Bill
                                </Button>
                            </Link>
                            <Link href={`/dashboard/sign/${member?.project_client_id}`}>
                                <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all'>
                                    Signature
                                </Button>
                            </Link>
                            <Link href={`/dashboard/history/${member?.project_client_id}`}>
                                <Button className='bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all'>
                                    History
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