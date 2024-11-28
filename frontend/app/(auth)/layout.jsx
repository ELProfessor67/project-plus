'use client'
import { useUser } from '@/providers/UserProvider';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect } from 'react'

const layout = ({children}) => {
    const {user,isAuth} = useUser();
    const router = useRouter();

    useLayoutEffect(() => {
        if(isAuth == true){
            router.push('/dashboard');
        }
    },[user,isAuth]);

    return (children)
}

export default layout