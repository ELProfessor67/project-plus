'use client'
import { Button } from '@/components/Button'
import Step0 from '@/components/sign-up/Step0'
import Step1 from '@/components/sign-up/Step1'
import Step2 from '@/components/sign-up/Step2'
import Step3 from '@/components/sign-up/Step3'
import Step4 from '@/components/sign-up/Step4'
import Step5 from '@/components/sign-up/Step5'
import { registerRequest } from '@/lib/http/auth'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

const Steps = {
    0: Step0,
    1: Step1,
    2: Step2,
    3: Step3,
    4: Step4,
    5: Step5
}


const StepsImages = {
    0: "/assets/step-0.avif",
    1: "/assets/step-1.avif",
    2: "/assets/step-2.avif",
    3: "/assets/step-3.avif",
    4: "/assets/step-4.avif",
    5: "/assets/step-5.avif"
}


export default function Page() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStep, setSelectedStep] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isContinueButtonDisable, setIsContinueButtonDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const next_to = searchParams.get('next_to');

    const [formdata, setFormdata] = useState({
        email: '',
        name: '',
        password: '',
        account_name: 'test',
        bring: 'test',
        teams_member_count: '10',
        focus: ["focus"],
        hear_about_as: 'A'
    });

    const Step = useMemo(() => Steps[selectedStep], [selectedStep]);


    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await registerRequest(formdata);
            toast.success(res?.data?.message);
            if (typeof window != 'undefined') {
                window.localStorage.setItem('email', formdata.email);
            }

            router.push(`/verify${next_to ? `?next_to=${next_to}` : ''}`);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setIsLoading(false);
        }
    }, [formdata]);

    const handleNextStep = useCallback(() => {
        handleSubmit();
    }, [selectedStep,formdata])


    const onFormDataChange = useCallback((e) => {
        setFormdata(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, [formdata]);


    //continue button check
    useEffect(() => {
        if (selectedStep == 0 && (!formdata.name || !formdata.password || !formdata.email)) {
            setIsContinueButtonDisable(true);
            return
        }
        setIsContinueButtonDisable(false);

    }, [selectedStep, JSON.stringify(formdata)]);




    return (
        <div className="flex min-h-screen bg-primary">
            {/* Left Column */}
            <div className="w-full flex-1 p-16 flex  relative">
                <Step selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} formdata={formdata} setFormdata={setFormdata} onFormDataChange={onFormDataChange} handleNextStep={handleNextStep} isContinueButtonDisable={isContinueButtonDisable} />
            </div>

        </div>
    )
}