'use client'

import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'
import { resendotpRequest, verifyotpRequest } from '@/lib/http/auth'
import { useUser } from '@/providers/UserProvider'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Page() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {user,setUser,setIsAuth} = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next_to = searchParams.get('next_to');

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft])

  const handleOtpChange = useCallback((index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Move to next input
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  },[otp]);

  const handleBackspace = useCallback((event, index) => {
    if (event.key === 'Backspace') {
      if (index > 0 && otp[index] === '') {
        const nextInput = document.getElementById(`otp-${index - 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  },[otp]);

  const handlePaste = useCallback((event) => {
    let paste = (event.clipboardData).getData("text");
    if(paste.length == 6 && !isNaN(paste)){
        setOtp(paste.split(''));
    }
  },[otp]);



  const handleVerify = useCallback(async () => {
    setIsLoading(true)
    try {
        const formdata = {
            OTP: Number(otp.join(''))
        }
        const res = await verifyotpRequest(formdata);
        toast.success(res?.data.message);
        setUser(res?.data?.user);
        setIsAuth(true);

        if(next_to){
            router.push(next_to);
        }else if(res?.data?.user?.Projects.length == 0){
            router.push('/dashboard');
        }else{
            router.push('/dashboard');
        }

    } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false)
    }
  }, [otp])

  const handleResendOtp = useCallback(async () => {
    setIsResendDisabled(true);
    try {
        let email;
        if(typeof window != 'undefined'){
            email = window.localStorage.getItem('email');
        }

        if(!email) return toast.success('Please try logging in again.');

        const formdata = {
            email
        }
        const res = await resendotpRequest(formdata);
        toast.success(res?.data?.message);
        setTimeLeft(30);
    } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
    }
    
  }, [])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Column */}
      <div className="w-full flex-1 p-8 lg:p-16 flex flex-col relative">
        <Image src="/assets/logo-full-big.avif" alt="flexytext.com Logo" width={150} height={40} className="mb-12" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-[400px] space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold text-gray-800">Verify Your Account</h1>
              <p className="text-gray-600">We've sent a 6-digit code to your email. Enter it below to confirm your account.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleBackspace(e, index)}
                    className="w-12 h-12 text-center text-2xl"
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              <Button 
                className="w-full h-12 bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600" 
                onClick={handleVerify} 
                disabled={otp.join('').length !== 6 || isLoading}
                isLoading={isLoading}
              >
                Verify OTP
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the code? 
                  {isResendDisabled ? (
                    <span className="ml-1 text-gray-700">Resend in {timeLeft}s</span>
                  ) : (
                    <Button 
                      variant="link" 
                      className="ml-1 p-0 h-auto text-[#0073ea]" 
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </Button>
                  )}
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              By verifying, you agree to the{" "}
              <Link href="#" className="text-[#0073ea] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#0073ea] hover:underline">
                Privacy Policy
              </Link>
            </div>

            <div className="text-center text-sm text-gray-700">
              Need help?{" "}
              <Link href="/contact-support" className="text-[#0073ea] hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden lg:block w-[40%] relative">
        <div className="h-full flex items-center justify-center">
          <Image 
            src="/assets/step-4.avif" 
            alt="Decorative Image" 
            layout="fill" 
            objectFit="cover" 
            className="rounded-l-2xl"
          />
        </div>
      </div>
    </div>
  )
}

