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


    return (
        <div className="flex min-h-screen bg-primary">
            {/* Left Column */}
            <div className="w-full flex-1 p-16 flex relative">
                <div className="flex items-center justify-center px-4 mx-auto bg-secondary rounded-md h-[45rem] mt-10">
                    <div className="w-[35rem] space-y-6 rounded-md p-4">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-semibold text-foreground-primary">Sign Up as Client</h1>
                            <p className="text-foreground-secondary">Create your account to get started.</p>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-4 text-foreground-primary">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <input
                                    id="name"
                                    type="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formdata.name}
                                    onChange={onFormDataChange}
                                    className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                    required
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
                                    className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formdata.password}
                                    onChange={onFormDataChange}
                                    className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-tbutton-bg text-white disabled:opacity-40 hover:bg-tbutton-hover"
                                disabled={(!formdata.email || !formdata.password) || isLoading}
                                isLoading={isLoading}
                            >
                                Sign Up
                            </Button>
                        </form>

                        <div className="text-center text-sm text-foreground-secondary">
                            Already have an account?{" "}
                            <Link href={`/sign-in${next_to ? `?next_to=${next_to}` : ''}`} className="text-accent hover:text-accent-hover">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

