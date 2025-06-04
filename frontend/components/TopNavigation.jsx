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
        <header className="bg-secondary shadow">
            <div className="flex h-16 items-center justify-between px-4">
                <h2 className='font-medium text-2xl hidden lg:block text-foreground-primary'>flexywexy.com</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text"
                >
                    <Menu className="h-6 w-6" />
                </Button>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-foreground-primary hover:bg-tbutton-bg hover:text-tbutton-text">
                        <Brain className="h-5 w-5" />
                    </Button>
                    {/* <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button> */}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                <AvatarFallback className="bg-tbutton-bg text-white cursor-pointer">{userAvatar}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mr-2 bg-secondary border border-secondary">
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-foreground-primary hover:!bg-tbutton-bg hover:!text-tbutton-text" onClick={handleClick}>
                                    <DoorOpen className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
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