"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Home, LayoutDashboard, MoreHorizontal, Plus, Search, Star, Briefcase, X, PanelRight, PanelLeft, PanelsTopLeft, MessageSquareMore, Presentation, Mail, CalendarCheck, Unplug, Mails, MessagesSquare, MessageCircleMore, Projector } from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useCallback, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import BigDialog from "./Dialogs/BigDialog"
import CreateProject from "./CreateProject"
import { useUser } from "@/providers/UserProvider"

const Sidebar = ({ setSidebarOpen, sidebarOpen, className }) => {
    const [favoritesOpen, setFavoritesOpen] = useState(true);
    const [workspaceOpen, setWorkspaceOpen] = useState(true);
    const [openMail, setOpenMail] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    const [openMeeting, setOpenMeeting] = useState(false);
    const pathname = usePathname();
    const { user } = useUser();


    const connectWhatsapp = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.open('https://web.whatsapp.com', '_blank', 'width=800,height=600');
        }
    }, []);

    return (
        <>
            <aside className={`
            fixed inset-y-0 left-0 z-50 flex h-[98%] w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out m-2 rounded-md
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0
            ${className}
          `}>
                <div className="flex items-center justify-between p-4 lg:hidden">
                    <span className="text-xl font-bold">ProjectPlus.com</span>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <div className="flex flex-col gap-1 p-3">
                    {/* Home */}
                    <Link href={'/dashboard'}>
                        <Button variant={pathname == '/dashboard' ? 'secondary' : 'ghost'} className={`justify-start w-full ${pathname == '/dashboard' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800' : ''}`}>
                            <Home className="mr-2 h-4 w-4" />
                            Home
                        </Button>
                    </Link>



                    <Collapsible open={chatOpen} onOpenChange={setChatOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between">
                                <div className="flex items-center">
                                    <MessagesSquare className="mr-2 h-4 w-4" />
                                    Chat
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${chatOpen ? "rotate-180" : ""}`} />
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-4 py-2">
                            <div className="flex flex-col gap-2">

                                <Link href={'/dashboard/chat'}>
                                    <Button variant="ghost" size="sm" className="justify-start w-full">
                                        <MessageSquareMore className="mr-2 h-4 w-4" />
                                        System Chat
                                    </Button>
                                </Link>

                                <Button variant="ghost" size="sm" className="justify-start w-full" onClick={connectWhatsapp}>
                                    <MessageCircleMore className="mr-2 h-4 w-4" />

                                    Connect Whatsapp
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>


                    <Collapsible open={openMeeting} onOpenChange={setOpenMeeting}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between">
                                <div className="flex items-center">
                                    <Presentation className="mr-2 h-4 w-4" />
                                    Meetings
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openMeeting ? "rotate-180" : ""}`} />
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-4 py-2">
                            <div className="flex flex-col gap-2">

                                <Link href={'/dashboard/meeting'}>
                                    <Button variant="ghost" size="sm" className="justify-start w-full">
                                        <Projector className="mr-2 h-4 w-4" />
                                        Instant Meet
                                    </Button>
                                </Link>
                                <Link href={'/dashboard/schedule-meet'}>
                                    <Button variant="ghost" size="sm" className="justify-start w-full" >
                                        <CalendarCheck className="mr-2 h-4 w-4" />
                                        Schedule Meet
                                    </Button>
                                </Link>

                            </div>
                        </CollapsibleContent>
                    </Collapsible>


                    <Collapsible open={openMail} onOpenChange={setOpenMail}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between">
                                <div className="flex items-center">
                                    <Mails className="mr-2 h-4 w-4" />
                                    MaiL
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openMail ? "rotate-180" : ""}`} />
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-4 py-2">
                            <div className="flex flex-col gap-2">

                                <Link href={'/dashboard/mail'}>
                                    <Button variant="ghost" size="sm" className="justify-start w-full">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Mail
                                    </Button>
                                </Link>
                                <Link href={'/dashboard/connect-mail'}>
                                    <Button variant="ghost" size="sm" className="justify-start w-full" >
                                        <Unplug className="mr-2 h-4 w-4" />
                                        Connect Mail
                                    </Button>
                                </Link>

                            </div>
                        </CollapsibleContent>
                    </Collapsible>



                    <Link href={'/dashboard/projects'}>
                        <Button variant={pathname == '/dashboard/projects' ? 'secondary' : 'ghost'} className={`justify-start w-full ${pathname == '/dashboard/dashboard/my-work' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800' : ''}`}>
                            <PanelsTopLeft className="mr-2 h-4 w-4" />
                            My Project
                        </Button>
                    </Link>

                    <Button variant={'ghost'} className={`justify-start w-full`} onClick={() => setProjectDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                    </Button>

                    {/* Favorites Section */}
                    <Collapsible open={favoritesOpen} onOpenChange={setFavoritesOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between">
                                <div className="flex items-center">
                                    <Star className="mr-2 h-4 w-4" />
                                    Favorites
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${favoritesOpen ? "rotate-180" : ""}`} />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 py-2">
                            <div className="flex flex-col gap-2">
                                {
                                    user?.Projects?.map(project => (
                                        <Link href={`/dashboard/project/${project.project_id}`}>
                                            <Button variant="ghost" className="justify-start flex items-center w-full">
                                                <PanelLeft className="mr-1" />
                                                {project.name}
                                            </Button>
                                        </Link>
                                    ))
                                }
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Main Workspace */}
                    {/* <Collapsible open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between">
                                <div className="flex items-center">
                                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded bg-purple-600 text-xs font-medium text-white">
                                        M
                                    </div>
                                    All Project
                                </div>
                                <div className="flex items-center gap-1">
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${workspaceOpen ? "rotate-180" : ""}`} />

                                </div>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                           
                            <div className="flex gap-1 p-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input placeholder="Search" className="pl-8" />
                                </div>
                                <Button size="icon" className="bg-[#6C6CFF] text-white hover:bg-[#5858CC]" onClick={() => setProjectDialogOpen(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                       
                            <div className="flex flex-col gap-1 px-3">
                                {
                                    user?.Projects?.map(project => (
                                        <Link href={`/dashboard/project/${project.project_id}`}>
                                            <Button variant="ghost" className="justify-start flex items-center w-full">
                                                <PanelLeft className="mr-1" />
                                                {project.name}
                                            </Button>
                                        </Link>
                                    ))
                                }



                            </div>
                        </CollapsibleContent>
                    </Collapsible> */}
                </div>
            </aside>

            <BigDialog onClose={() => setProjectDialogOpen(false)} open={projectDialogOpen}>
                <CreateProject onClose={() => setProjectDialogOpen(false)} />
            </BigDialog>
        </>

    )
}

export default Sidebar