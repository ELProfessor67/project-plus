import React, { useMemo, useState } from 'react'
import { Button } from './Button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AvatarCompoment from './AvatarCompoment';
import moment from 'moment';

const RenderTranscibtionChat = ({ transcribtion }) => {
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

    const viewLenght = useMemo(() => (isTranscriptOpen ? transcribtion?.length : 3), [isTranscriptOpen]);
    return (
        <>
            {
                transcribtion.slice(0, viewLenght).map((transcribe) => (
                    <div className='flex justify-center gap-2 flex-col'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <AvatarCompoment name={transcribe.user.name} />
                                <h2 className='text-lg font-medium text-gray-700'>{transcribe?.user?.name}</h2>
                            </div>
                            <time className='font-light text-gray-700 text-sm'>{moment(transcribe?.created_at).calendar()}</time>
                        </div>
                        <p className='text-gray-700 font-light leading-6 mt-2 px-2'>
                            {transcribe.transcribe}
                        </p>

                    </div>
                ))
            }
            {
                transcribtion.length > 3 &&
                <div className='flex items-center'>
                    <Button
                        variant="ghost"
                        className="text-primary"
                        onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                    >
                        {isTranscriptOpen ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Show More
                            </>
                        )}
                    </Button>
                </div>
            }

        </>
    )
}

export default RenderTranscibtionChat