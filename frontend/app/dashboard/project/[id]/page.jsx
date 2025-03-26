"use client"

import { useEffect, useCallback, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpDown,
  CircleUser,
  Ellipsis,
  FileText,
  FilterIcon,
  LayoutGrid,
  List,
  Plus,
  SearchIcon,
} from "lucide-react"
import Link from "next/link"
import { getProjectRequest } from "@/lib/http/project"
import { getNameAvatar } from "@/utils/getNameAvatar"
import BigDialog from "@/components/Dialogs/BigDialog"
import CreateTask from "@/components/Dialogs/CreateTask"
import Kanban from "@/components/Kanban"
import TableView from "@/components/TableView"
import Loader from "@/components/Loader"
import RenderMembers from "@/components/RenderMembers"
import InviteComponet from "@/components/InviteComponet"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import RenderMemberDetails from "@/components/RenderMemberDetails"
import RenderClient from "@/components/RenderClient"

const statusColors = {
  "Not Started": "bg-gray-100 text-gray-800",
  "Working": "bg-blue-100 text-blue-800",
  "Stuck": "bg-red-100 text-red-800",
  "Done": "bg-green-100 text-green-800",
}
const statuses = ["Not Started", "Working", "Stuck", "Done"]

export default function Page({ params }) {
  const [project, setProject] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [viewMember, setViewMember] = useState(false);
  const [viewClient, setViewClient] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const getProjectDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProjectRequest(params.id);
      setProject(res?.data?.project);
    } catch (error) {
      setProject(null);
      console.log(error?.response?.data?.meesage || error?.meesage);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    getProjectDetails();
  }, []);


  if (isLoading) {
    return <>
      <div className=" h-screen bg-white m-2 rounded-md flex items-center justify-center">

        <Loader />
      </div>
    </>
  }

  return (
    <>
      <main className="flex-1 overflow-auto p-4 bg-white m-2 rounded-md">
        {/* Toolbar */}
        <div className="mb-8  flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">{project?.name}</h1>
          <div className="flex items-center gap-4">

            <button onClick={() => setViewClient(true)}>
                  <RenderMembers members={project?.Clients || []} />
                </button>

                <Button className='bg-blue-500 border border-white text-white hover:bg-gray-200 ' onClick={() => { setInviteOpen(true); setIsClient(true) }}>
                  Add Client
                </Button>

            <button onClick={() => setViewMember(true)}>
              <RenderMembers members={project?.Members || []} />
            </button>

            <Button className='bg-blue-500 border border-white text-white hover:bg-gray-200 ' onClick={() => { setInviteOpen(true); setIsClient(false) }}>
              Invite/{project?.Members?.length}
            </Button>


            <button className='bg-transparent hover:bg-gray-200 text-white p-2 rounded-sm'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className='hover:bg-transparent text-black'>
                  <Ellipsis size={25} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-2 mt-2">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href={`/dashboard/projects/media/${project?.project_id}`} className='flex items-center justify-start gap-2 w-full'>
                        <FileText />
                        <span className='text-black/70'>Media Box</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

            </button>
          </div>
        </div>

        {/* Tabs for Kanban and Table views */}
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="kanban">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Kanban
            </TabsTrigger>

            <TabsTrigger value="table">
              <List className="mr-2 h-4 w-4" />
              Table
            </TabsTrigger>

            <Button variant="ghost" size="icon" className="hover:bg-white ml-2 py-1 h-[2rem] rounded-sm">
              <Plus className="h-4 w-4" />
            </Button>
          </TabsList>

          <div className="flex items-center justify-start my-4 gap-4">
            <Button className="text-white bg-blue-500 hover:bg-blue-600" onClick={() => setCreateTaskDialogOpen(true)}>
              New Task
            </Button>

            <Button variant="ghost" className="text-black/70">
              <SearchIcon />
              Search
            </Button>
            <Button variant="ghost" className="text-black/70">
              <CircleUser />
              Person
            </Button>
            <Button variant="ghost" className="text-black/70">
              <FilterIcon />
              Filter
            </Button>
            <Button variant="ghost" className="text-black/70">
              <ArrowUpDown />
              Sort
            </Button>
            <Button variant="ghost" className="text-black/70">
              <Ellipsis />
            </Button>
          </div>

          <TabsContent value="kanban">
            <Kanban project={project} />
          </TabsContent>
          <TabsContent value="table">

            <TableView project={project} reloadProject={getProjectDetails} />


          </TabsContent>
        </Tabs>
      </main>

      <BigDialog open={createTaskDialogOpen} onClose={() => setCreateTaskDialogOpen(false)} width={34}>
        <CreateTask project={project} onClose={() => setCreateTaskDialogOpen(false)} getProjectDetails={getProjectDetails} />
      </BigDialog>
      <InviteComponet open={inviteOpen} onClose={() => setInviteOpen(false)} project={project} isClient={isClient} />


      <BigDialog open={viewMember} onClose={() => setViewMember(false)} width={34}>
        <RenderMemberDetails members={project?.Members || []} />
      </BigDialog>

      <BigDialog open={viewClient} onClose={() => setViewClient(false)} width={40}>
        <RenderClient members={project?.Clients || []} />
      </BigDialog>
    </>
  )
}