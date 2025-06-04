import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import React from 'react'
import { Label } from '@/components/ui/label'

const Step0 = ({ formdata, onFormDataChange, handleNextStep, isContinueButtonDisable }) => {
    const searchParams = useSearchParams();
    const next_to = searchParams.get('next_to');
    return (
        <div className="flex items-center justify-center px-4 mx-auto bg-secondary rounded-md h-[45rem] mt-10">
            <div className="w-[35rem] space-y-6  rounded-md p-4">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-foreground-primary">Welcome to flexywexy.com</h1>
                    <p className="text-foreground-secondary">Get started - it's free. No credit card needed.</p>
                </div>

                <div className="space-y-4">

                    <div className='space-y-4 text-foreground-primary'>
                        <div className="space-y-2">
                            <Label htmlFor="email">Full Name</Label>
                            <input
                                type="text"
                                id="fullName"
                                name='name'
                                className="w-full h-12 px-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your full name"
                                value={formdata.name}
                                onChange={onFormDataChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formdata.email}
                                onChange={onFormDataChange}
                                className="w-full h-12 px-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <input
                                type="password"
                                id="password"
                                name='password'
                                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter at least 8 characters"
                                value={formdata.password}
                                onChange={onFormDataChange}
                            />
                        </div>
                    </div>



                    <button className="w-full h-12 bg-tbutton-bg text-white rounded-md hover:bg-tbutton-hover transition-colors disabled:opacity-40" onClick={handleNextStep} disabled={isContinueButtonDisable}>
                        Continue
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-secondary text-gray-500">Or</span>
                        </div>
                    </div>

                    <button
                        className="w-full flex items-center justify-center space-x-2 h-12 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors bg-white"
                    >
                        <Image
                            src="https://dapulse-res.cloudinary.com/image/upload/remote_logos/995426/google-icon.svg"
                            alt="Google logo"
                            width={20}
                            height={20}
                        />
                        <span className="text-gray-700">Continue with Google</span>
                    </button>

                    
                </div>

                <div className="text-center text-sm text-foreground-secondary">
                    By proceeding, you agree to the{" "}
                    <Link href="#" className="text-accent hover:text-accent-hover">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-accent hover:text-accent-hover">
                        Privacy Policy
                    </Link>
                </div>

                <div className="text-center text-sm text-foreground-secondary">
                    Already have an account?{" "}
                    <Link href={`/sign-in${next_to ? `?next_to=${next_to}` : ''}`} className="text-accent hover:text-accent-hover">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Step0