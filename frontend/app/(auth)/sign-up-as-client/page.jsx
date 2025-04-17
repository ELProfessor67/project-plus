'use client'

import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginRequest, registerRequest } from '@/lib/http/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

export default function SingUpAsClient() {
    const [formdata, setFormdata] = useState({
        email: '',
        password: '',
        name: '',
        role: 'CLIENT'
    });
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter();
    const searchParams = useSearchParams();
    const next_to = searchParams.get('next_to');

    const onFormDataChange = useCallback((e) => {
        setFormdata(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSignUp = useCallback(async (e) => {
        e.preventDefault()
        setIsLoading(true)
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
            setIsLoading(false)
        }
    }, [formdata]);



    const handleGoogleLogin = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/auth/google?role=CLIENT`;
        }
    }, []);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left Column */}
            <div className="w-full flex-1 p-8 lg:p-16 flex flex-col relative">
                <Image src="/assets/logo-full-big.avif" alt="flexywexy.com Logo" width={200} height={70} className="mb-12" />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="w-full max-w-[400px] space-y-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-semibold text-gray-800">Sign Up AS Cient</h1>
                            <p className="text-gray-600">Sign up now to receive important updates and exclusive content.</p>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formdata.name}
                                    onChange={onFormDataChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formdata.email}
                                    onChange={onFormDataChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formdata.password}
                                    onChange={onFormDataChange}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600"
                                disabled={(!formdata.email || !formdata.password) || isLoading}
                                isLoading={isLoading}
                            >
                                Sign Up
                            </Button>
                        </form>

                         {/*<div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                       <div className="grid grid-cols-1">
                            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                                <Image src="https://dapulse-res.cloudinary.com/image/upload/remote_logos/995426/google-icon.svg" alt="Google" width={20} height={20} className="mr-2" />
                                <span className="text-gray-700">Continue with Google</span>
                            </Button>

                        </div>*/}

                        <div className="text-center text-sm text-gray-700">
                            Already have an account ?{" "} <Link href={`/sign-in${next_to ? `?next_to=${next_to}` : ''}`} className="text-[#0073ea] hover:underline">
                                Sign In
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

