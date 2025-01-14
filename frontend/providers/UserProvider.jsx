'use client';
import { loadUserRequest } from '@/lib/http/auth';
import {createContext, useCallback, useContext, useLayoutEffect, useState} from 'react';

export const UserContext = createContext();


export const UserProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [userAvatar,setUserAvatar] = useState('EX');
  

    const loadUser = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await loadUserRequest();
            setIsAuth(true);
            setUser(res?.data?.user);
            const name = res?.data?.user?.name;

            if(name){
                const [firstname,lastname] = name.split(' ');
                setUserAvatar(`${firstname?.slice(0,1)?.toUpperCase() || ''}${lastname?.slice(0,1)?.toUpperCase() || ''}`)
            }
        } catch (error) {
            setIsAuth(false);
            console.log(error?.response?.data?.message || error.message)
        }finally{
            setIsLoading(false);
        }
    },[]);




    useLayoutEffect(() => {
        loadUser();
    },[])

    return <UserContext.Provider value={{user,setUser,isAuth,setIsAuth,isLoading,setIsLoading,userAvatar,loadUser}}>
        {children}
    </UserContext.Provider>
}

export const useUser = () => {
    return useContext(UserContext);
}