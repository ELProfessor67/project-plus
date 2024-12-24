'use client'
import { ChatSidebar } from '@/components/ChattingComponent'
import Sibebar from '@/components/Sidebar'
import TopNavigation from '@/components/TopNavigation'
import { Button } from '@/components/ui/button'
import ProtectedRouteProvider from '@/providers/ProtectedRouteProvider'
import { MessageCircle } from 'lucide-react'
import React, { useState } from 'react'

const layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false)
    return (
        <ProtectedRouteProvider>
            <div>
                <TopNavigation setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
                <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-100">
                    <Sibebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <div className="flex flex-1 flex-col overflow-hidden">

                        {/* Main Content Area */}
                        {children}
                    </div>
                </div>
            </div>
        </ProtectedRouteProvider>
    )
}

export default layout