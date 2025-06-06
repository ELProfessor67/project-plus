import React from 'react'
import AvatarCompoment from './AvatarCompoment'
import moment from 'moment'

const RenderMemberDetails = ({ members }) => {
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
                                <h2 className='opacity-50 text-sm mt-1 uppercase'>{member?.role}</h2>
                            </div>
                        </div>

                        <div>
                            <p>Joined on</p>
                            <time className='font-light text-gray-700 text-sm'>{moment(member.added_at).format("DD MMM YYYY")}</time>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default RenderMemberDetails