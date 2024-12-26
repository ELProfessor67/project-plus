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
    const [isContinueButtonDisable,setIsContinueButtonDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const next_to = searchParams.get('next_to');
    
    const [formdata,setFormdata] = useState({
        email: '',
        name: '',
        password: '',
        account_name: '',
        bring: '',
        teams_member_count: '',
        focus: [],
        hear_about_as: ''
    });

    const Step = useMemo(() => Steps[selectedStep], [selectedStep]);


    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await registerRequest(formdata);
            toast.success(res?.data?.message);
            if(typeof window != 'undefined'){
                window.localStorage.setItem('email',formdata.email);
            }
          
            router.push(`/verify${next_to ? `?next_to=${next_to}` : ''}`);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }finally{
            setIsLoading(false);
        }
    },[formdata]);

    const handleNextStep = useCallback(() => {
        if (selectedStep < 5) {
            setSelectedStep(prev => prev + 1);
            return;
        }

        handleSubmit();
    }, [selectedStep])

    const handlePrevStep = useCallback(() => {
        if (selectedStep > 0) {
            setSelectedStep(prev => prev - 1);
            return;
        }
    }, [selectedStep]);


    const onFormDataChange = useCallback((e) => {
        setFormdata(prev => ({...prev,[e.target.name]: e.target.value}));
    },[]);


    //continue button check
    useEffect(() => {
        if(selectedStep == 0 && !formdata.email){
            setIsContinueButtonDisable(true);
            return
        }

        if(selectedStep == 1 && (!formdata.name || !formdata.password || !formdata.account_name)){
            setIsContinueButtonDisable(true);
            return
        }

        if(selectedStep == 2 && !formdata.bring){
            setIsContinueButtonDisable(true);
            return
        }

        if(selectedStep == 3 && !formdata.teams_member_count){
            setIsContinueButtonDisable(true);
            return
        }

        if(selectedStep == 4 && formdata.focus.length == 0){
            setIsContinueButtonDisable(true);
            return
        }

        if(selectedStep == 5 && !formdata.hear_about_as){
            setIsContinueButtonDisable(true);
            return
        }

        setIsContinueButtonDisable(false);
    },[selectedStep,JSON.stringify(formdata)]);




    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left Column */}
            <div className="w-full flex-1 p-8 lg:p-16 flex flex-col relative h-screen">
                <Image src="/assets/logo-full-big.avif" alt="ProjectPlus.com Logo" width={200} height={70}  className="mb-12" />
                <Step  selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} formdata={formdata} setFormdata={setFormdata} onFormDataChange={onFormDataChange} handleNextStep={handleNextStep} isContinueButtonDisable={isContinueButtonDisable}/>
                
                {
                    selectedStep != 0 && 
                    <div className="mt-6 flex justify-between absolute bottom-16 right-16 left-16">
                        <Button 
                            className="py-2 px-4 border border-gray-300 rounded text-sm bg-transparent text-black hover:bg-transparent hover:border-black"
                            onClick={handlePrevStep}
                        >
                            ← Back
                        </Button>

                        <Button
                            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40"
                            onClick={handleNextStep}
                            disabled={isContinueButtonDisable}
                            isLoading={isLoading}
                        >
                            Continue
                        </Button>

                    </div>
                }
            </div>

            {/* Right Column */}
            
            <div className="hidden lg:block w-[40%] relative">
                <div className="h-full flex items-center justify-center">
                    <Image src={StepsImages[selectedStep]} alt="Decorative Image" width={400} height={400} className='h-screen w-full object-fill'/>
                </div>
            </div>
            
            
        </div>
    )
}