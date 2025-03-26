'use client'
import { Button } from '@/components/Button'
import { joinProjectRequest } from '@/lib/http/project';
import { useUser } from '@/providers/UserProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { toast } from 'react-toastify';

const page = ({ params }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {user, isAuth} = useUser();
  const router = useRouter();
  const serachParam = useSearchParams();
  const role = serachParam.get('role'); 

  useLayoutEffect(() => {
    if(isAuth == false){
      if(typeof window != 'undefined'){
        const url = window.location.href;
        if(role == 'client'){
          router.push(`/sign-up-as-client?next_to=${url}`);
        }else{
          router.push(`/sign-in?next_to=${url}`);
        }
      }
      
    }
  },[user,isAuth,role]);

  const handleJoin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const formdata = {
        token: params.token
      };
      const res = await joinProjectRequest(formdata);
      toast.success(res.data.message);
      router.push(`/dashboard/project/${res.data.projectMember.project_id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }finally{
      setIsLoading(false)
    }
  },[])

  return (
    <section className='flex items-center justify-center h-screen'>
      <div className='space-y-5 w-[20rem]'>
        <h1 className='text-3xl font-medium text-gray-700 text-center'>JOIN NOW</h1>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full" isLoading={isLoading} disabled={isLoading} onClick={handleJoin}>
          Join Now
        </Button>
      </div>
    </section>
  )
}

export default page