import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import React from 'react'

const Step0 = ({formdata,onFormDataChange,handleNextStep,isContinueButtonDisable}) => {
    const searchParams = useSearchParams();
    const next_to = searchParams.get('next_to');
    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-[400px] space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Welcome to ProjectPlus.com</h1>
                    <p className="text-gray-600">Get started - it's free. No credit card needed.</p>
                </div>

                <div className="space-y-4">
                    <button
                        className="w-full flex items-center justify-center space-x-2 h-12 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <Image
                            src="https://dapulse-res.cloudinary.com/image/upload/remote_logos/995426/google-icon.svg"
                            alt="Google logo"
                            width={20}
                            height={20}
                        />
                        <span className="text-gray-700">Continue with Google</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    <input
                        type="email"
                        placeholder="name@company.com"
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formdata.email}
                        name='email'
                        onChange={onFormDataChange}
                    />

                    <button className="w-full h-12 bg-[#0073ea] text-white rounded-md hover:bg-[#0060c0] transition-colors disabled:opacity-40" onClick={handleNextStep} disabled={isContinueButtonDisable}>
                        Continue
                    </button>
                </div>

                <div className="text-center text-sm text-gray-500">
                    By proceeding, you agree to the{" "}
                    <Link href="#" className="text-[#0073ea] hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-[#0073ea] hover:underline">
                        Privacy Policy
                    </Link>
                </div>

                <div className="text-center text-sm text-gray-700">
                    Already have an account?{" "}
                    <Link href={`/sign-in${next_to ? `?next_to=${next_to}` : ''}`} className="text-[#0073ea] hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Step0