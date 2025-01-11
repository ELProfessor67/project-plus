'use client'
import { getNameAvatar } from '@/utils/getNameAvatar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getColorByFirstLetter } from '@/utils/getColorByFirstLetter'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

const CallStatus = {
    processing: 'processing',
    ringing: 'ringing',
    call_coming: 'call_coming',
    rejected: 'rejected',
    no_response: 'no_response',
}

const CallDialog = ({ open, setCurrentCallUser, currentCallUser, isCallByMe = true }) => {
    const ringAudioRef = useRef(null);
    // ringing,processing,rejected,no_response
    const [status, setStatus] = useState(isCallByMe ? CallStatus.ringing : CallStatus.call_coming);

    const handlePlayRing = useCallback(() => {
        if (typeof window !== 'undefined') {
            if(ringAudioRef.current) ringAudioRef.current.pause();
            ringAudioRef.current = new Audio('/calling-ringtone.wav');
            ringAudioRef.current.play();
            ringAudioRef.current.onended = () => {
                setStatus(CallStatus.no_response);
            }
        }
    }, []);


    const handleCallAgain = useCallback(() => {
        handlePlayRing();
        setStatus(CallStatus.ringing);
    }, []);

    useEffect(() => {
        handlePlayRing();

        return () => {
            ringAudioRef.current?.pause();
            
        }
    }, []);
    return (
        <div className={`absolute top-0 left-0 right-0 bottom-0 overflow-y-auto z-50 p-5 bg-black/10 transition-all flex items-center justify-center`}>
            <div className={`bg-white shadow-sm rounded-md min-h-[16rem] mx-auto p-4 relative w-[20rem]`}>
                <div className='flex items-center justify-center flex-col gap-4'>
                    <Avatar className={`w-[5rem] h-[5rem]`}>
                        <AvatarImage alt="User" />
                        <AvatarFallback className={`text-white text-4xl`} style={{ background: getColorByFirstLetter(currentCallUser?.name || "A A") }}>
                            {getNameAvatar(currentCallUser?.name || "A A")}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className='text-3xl'>{currentCallUser?.name}</h3>

                    {
                        status == CallStatus.ringing &&
                        <p className='text-green-500'>Ringing...</p>
                    }

                    {
                        status == CallStatus.no_response &&
                        <p className='text-red-500'>No Response</p>
                    }

                    {
                        status == CallStatus.rejected &&
                        <p className='text-red-500'>Rejected</p>
                    }
                </div>

                {
                    (status == CallStatus.ringing || status == CallStatus.call_coming || status == CallStatus.processing) &&
                    <div className='mt-4 flex items-center gap-20 justify-center'>
                        {
                            status == CallStatus.call_coming &&
                            <Button className={'bg-green-500 rounded-full hover:bg-green-600'} size='icon'>
                                <Phone />
                            </Button>
                        }

                        <Button className={'bg-red-500 rounded-full hover:bg-red-600'} size='icon'>
                            <Phone />
                        </Button>
                    </div>
                }


                {
                    (status == CallStatus.no_response || status == CallStatus.rejected) &&
                    <div className='mt-4 flex items-center  justify-between gap-5'>
                        <Button className="bg-gray-500 hover:bg-gray-600 flex-1" onClick={() => setCurrentCallUser(null)}>Go Back</Button>
                        <Button className="bg-blue-500 hover:bg-blue-600 flex-1" onClick={handleCallAgain}>Call Again!</Button>
                    </div>
                }

            </div>
        </div>
    )
}

export default CallDialog