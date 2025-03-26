import React from 'react'
import { Button } from './Button';
import AvatarCompoment from './AvatarCompoment';
import { Phone } from 'lucide-react';

const CallHistoryComponent = ({ history, makeCall }) => {
    return (
        <div className='space-y-5 mt-8'>

            {
                history && history.map(con => (
                    <div className='flex items-center justify-between w-full shadow-md rounded-md border border-gray-50 px-2'>
                        <div className='flex items-center gap-4 p-2'>
                            <AvatarCompoment name={con.name || "U"} className="!w-[4rem] !h-[4rem] text-3xl" />
                            <div>
                                <h2 className='opacity-80 text-lg'>{con.name || "Unkown"}</h2>
                                <h2 className='opacity-50 text-sm mt-1'>{con.number}</h2>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => makeCall(con.name, con.number)}>
                            <Phone/>
                        </Button>


                       
                    </div>
                ))
            }
        </div>

    )
}

export default CallHistoryComponent