
'use client'
import React, { useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Brain, DoorOpen, Menu, User } from 'lucide-react'
import { useUser } from '@/providers/UserProvider'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUserRequest } from '@/lib/http/auth'
import { toast } from 'react-toastify'

const TopNavigation = ({ setSidebarOpen }) => {
    const { user, userAvatar,setUser,setIsAuth } = useUser();


    const handleClick = useCallback(async () => {
        try {
            const res = await logoutUserRequest();
            toast.success(res.data.message);
            setIsAuth(false);
            setUser(null);
        } catch (error) {
            toast.error(error.response?.data.message || error.message);
        }
    },[]);
    return (
        <header className="bg-gray-100 shadow">

            <div className="flex h-16 items-center justify-between px-4">
                <h2 className='font-medium text-2xl hidden lg:block'>flexywexy.com</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </Button>


                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                        <Brain className="h-5 w-5" />
                    </Button>
                    {/* <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button> */}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                <AvatarFallback className="bg-orange-500 text-white cursor-pointer">{userAvatar}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mr-2">
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer">
                                    <User />
                                    <span className='text-black/70'>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={handleClick}>
                                    <DoorOpen />
                                    <span className='text-black/70'>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </header>
    )
}

export default TopNavigation