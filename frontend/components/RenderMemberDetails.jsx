import React from 'react'
import AvatarCompoment from './AvatarCompoment'
import moment from 'moment'

const RenderMemberDetails = ({ members }) => {
    console.log(members)
    return (
        <div className='space-y-5 overflow-x-auto h-[30rem]'>
            {
                members && members.map(member => (
                    <div className='flex items-center justify-between w-full shadow-md rounded-md border border-primary bg-primary px-2'>
                        <div className='flex items-center gap-4 p-2'>
                            <AvatarCompoment name={member?.user?.name} className="!w-[4rem] !h-[4rem] text-3xl" />
                            <div>
                                <h2 className='text-foreground-primary text-lg'>{member?.user?.name}</h2>
                                <h2 className='text-foreground-secondary text-sm mt-1 uppercase'>{member?.role}</h2>
                            </div>
                        </div>

                        <div>
                            <p className='text-foreground-secondary'>Joined on</p>
                            <time className='text-foreground-secondary text-sm'>{moment(member.added_at).format("DD MMM YYYY")}</time>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default RenderMemberDetails