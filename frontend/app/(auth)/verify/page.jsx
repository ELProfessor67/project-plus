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
    <div className="flex min-h-screen bg-primary">
      {/* Left Column */}
      <div className="w-full flex-1 p-16 flex relative">
        <div className="flex items-center justify-center px-4 mx-auto bg-secondary rounded-md h-[35rem] mt-10">
          <div className="w-[30rem] space-y-8 rounded-md p-8">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-semibold text-foreground-primary">Verify Your Account</h1>
              <p className="text-foreground-secondary">We've sent a 6-digit code to your email. Enter it below to confirm your account.</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleBackspace(e, index)}
                    className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              <Button 
                className="w-full h-12 bg-tbutton-bg text-white disabled:opacity-40 hover:bg-tbutton-hover" 
                onClick={handleVerify} 
                disabled={otp.join('').length !== 6 || isLoading}
                isLoading={isLoading}
              >
                Verify OTP
              </Button>

              <div className="text-center">
                <p className="text-sm text-foreground-secondary">
                  Didn't receive the code? 
                  {isResendDisabled ? (
                    <span className="ml-1 text-foreground-primary">Resend in {timeLeft}s</span>
                  ) : (
                    <Button 
                      variant="link" 
                      className="ml-1 p-0 h-auto text-accent hover:text-accent-hover" 
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </Button>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="text-center text-sm text-foreground-secondary">
                By verifying, you agree to the{" "}
                <Link href="#" className="text-accent hover:text-accent-hover">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-accent hover:text-accent-hover">
                  Privacy Policy
                </Link>
              </div>

              <div className="text-center text-sm text-foreground-secondary">
                Need help?{" "}
                <Link href="/contact-support" className="text-accent hover:text-accent-hover">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

