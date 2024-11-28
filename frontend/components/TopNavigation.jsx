
'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu } from 'lucide-react'
import { useUser } from '@/providers/UserProvider'

const TopNavigation = ({setSidebarOpen}) => {
    const {user,userAvatar} = useUser();
    return (
        <header className="bg-gray-100 shadow">
            
            <div className="flex h-16 items-center justify-between px-4">
                <h2 className='font-medium text-2xl hidden lg:block'>ProjectPlus.com</h2>
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
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Avatar>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback className="bg-orange-500 text-white">{userAvatar}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}

export default TopNavigation