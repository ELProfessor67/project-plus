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
  Users,
  UserPlus,
  Mail,
  MailPlus,
  Image,
  PlusIcon,
  Users2,
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
import { DropdownMenuContent, DropdownMenuItem, DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import RenderMemberDetails from "@/components/RenderMemberDetails"
import RenderClient from "@/components/RenderClient"
import CreateMeeting from "@/components/CreateMeeting"
import CreateMeetingClient from "@/components/CreateMeetingClient"
import SendMail from "@/components/SendMail"
import SendMailClient from "@/components/SendMailClient"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import moment from "moment"
import TaskComments from "@/components/TaskComments"

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
  const [createMeeting, setCreateMeeting] = useState(false);
  const [createMeetingClient, setCreateMeetingClient] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [sendMailClient, setSendMailClient] = useState(false);
  const [selectedTaskOpen, setSelectedTaskOpen] = useState(false);

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
      <div className="h-screen bg-secondary m-2 rounded-md flex items-center justify-center">
        <Loader />
      </div>
    </>
  }

  return (
    <>
      <main className="flex-1 overflow-auto p-4 bg-secondary m-2 rounded-md">
        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-foreground-primary">{project?.name}</h1>
          <div className="flex items-center gap-4">

            <Button className={'bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all'} onClick={() => setSelectedTaskOpen(true)}>
              Notes
            </Button>

            <Button
              className="bg-tbutton-bg text-tbutton-text hover:bg-tbutton-hover hover:text-tbutton-text transition-all"
              onClick={() => setCreateTaskDialogOpen(true)}
            >
              New Task
            </Button>

            <button onClick={() => setViewClient(true)} className="flex items-center gap-2">
              <RenderMembers members={project?.Clients || []} />
            </button>

            <span className="bg-foreground-primary w-[2px] h-5"></span>

            <button onClick={() => setViewMember(true)}>
              <RenderMembers members={project?.Members || []} />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className='hover:bg-transparent text-foreground-primary'>
                <Ellipsis size={25} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2 mt-2 bg-primary border-primary">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-foreground-primary">Action</DropdownMenuLabel>
                  <DropdownMenuItem className="cursor-pointer text-foreground-secondary hover:!bg-tbutton-bg hover:!text-tbutton-text" onClick={() => { setInviteOpen(true); setIsClient(false) }}>
                    <Users2 className="mr-2 h-4 w-4" />
                    <span className=''>Invite Team Member</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-foreground-secondary hover:!bg-tbutton-bg hover:!text-tbutton-text" onClick={() => { setInviteOpen(true); setIsClient(true) }}>
                    <Users2 className="mr-2 h-4 w-4" />
                    <span className=''>Invite Client</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer text-foreground-secondary hover:!bg-tbutton-bg hover:!text-tbutton-text" onClick={() => setCreateMeeting(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    <span className=''>Create Team Meeting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-foreground-secondary hover:!bg-tbutton-bg hover:!text-tbutton-text" onClick={() => setCreateMeetingClient(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span className=''>Create Client Meeting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-foreground-secondary hover:!bg-tbutton-bg hover:!text-tbutton-text" onClick={() => setSendMail(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span className=''>Send Team Mail</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-foreground-secondary hover:!bg-tbutton-bg hover:!text-tbutton-text" onClick={() => setSendMailClient(true)}>
                    <MailPlus className="mr-2 h-4 w-4" />
                    <span className=''>Send Client Mail</span>
                  </DropdownMenuItem>

                </DropdownMenuGroup>

                <Separator className="my-2" />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-foreground-primary">Links</DropdownMenuLabel>
                  <DropdownMenuItem className="cursor-pointer text-foreground-secondary hover:!bg-tbutton-bg hover:!text-tbutton-text">
                    <Link href={`/dashboard/create-document/${project?.project_id}`} className='flex items-center justify-start gap-2 w-full'>
                      <FileText className="mr-2 h-4 w-4" />
                      <span className=''>Template Document</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-foreground-secondary hover:!bg-tbutton-bg hover:!text-tbutton-text">
                    <Link href={`/dashboard/projects/media/${project?.project_id}`} className='flex items-center justify-start gap-2 w-full'>
                      <Image className="mr-2 h-4 w-4" />
                      <span className=''>Media Box</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Cases Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="text-lg font-medium">{project?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Case Number</p>
              <p className="text-lg font-medium">{project?.project_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="text-lg font-medium">{project?.Clients[0]?.user?.name || "NA"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Opposing Party</p>
              <p className="text-lg font-medium">{project?.opposing}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Filing Date</p>
              <p className="text-lg font-medium">{moment(project?.created_at).format("DD-MM-YYYY")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Case Status</p>
              <p
                className={`text-lg font-medium ${true === "Open" ? "text-green-600" : "text-red-600"
                  }`}
              >
                Open
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-base text-gray-700">{project?.description || "NA"}</p>
          </div>
        </div>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold text-foreground-primary mb-4">Tasks</h1>
          <Kanban project={project} />
        </div>
      </main>

      <BigDialog open={createTaskDialogOpen} onClose={() => setCreateTaskDialogOpen(false)} width={34}>
        <CreateTask project={project} onClose={() => setCreateTaskDialogOpen(false)} getProjectDetails={getProjectDetails} />
      </BigDialog>
      <InviteComponet open={inviteOpen} onClose={() => setInviteOpen(false)} project={project} isClient={isClient} />

      <BigDialog open={viewMember} onClose={() => setViewMember(false)} width={34}>
        <RenderMemberDetails members={project?.Members || []} />
      </BigDialog>

      <BigDialog open={viewClient} onClose={() => setViewClient(false)} width={45}>
        <RenderClient members={project?.Clients || []} />
      </BigDialog>

      <CreateMeeting open={createMeeting} onClose={() => setCreateMeeting(false)} isScheduled={false} getMeetings={() => { }} project_id={params.id} />
      <CreateMeetingClient open={createMeetingClient} onClose={() => setCreateMeetingClient(false)} isScheduled={false} getMeetings={() => { }} project_id={params.id} />

      <SendMail open={sendMail} onClose={() => setSendMail(false)} getAllMail={() => { }} project_id={params.id} />
      <SendMailClient open={sendMailClient} onClose={() => setSendMailClient(false)} getAllMail={() => { }} project_id={params.id} />


      {
        selectedTaskOpen &&
        <TaskComments open={selectedTaskOpen} onClose={() => setSelectedTaskOpen(false)} project_id={project?.project_id} />
      }
    </>
  )
}