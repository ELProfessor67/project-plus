"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ChevronDown, HelpCircle, Info, LayoutGrid, MessageCircle, Rocket, Star, Users, Videotape, X } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { getAllProjectRequest } from "@/lib/http/project"
import Link from "next/link"
import { getsMeetingRequest } from "@/lib/http/meeting"
import { useUser } from "@/providers/UserProvider"
import RenderMembers from "@/components/RenderMembers"
import { Badge } from "@/components/ui/badge"
import moment from "moment"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loader from "@/components/Loader"
import { getPedingDocsRequest } from "@/lib/http/client"
import { getAllTaskProgressRequest } from "@/lib/http/task"
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getRecentDatesWithLabels } from "@/utils/getRecentDatesWithLabels"
import { FaFileAlt, FaFolderOpen, FaChartLine, FaComments, FaWhatsapp, FaVideo } from "react-icons/fa";
import MatterCalendar from "../CalenderMatter"

const recentMatters = [
  { id: "1", title: "Car accident for Mr. Martin B.", status: "In Progress" },
  { id: "2", title: "Property dispute - Smith vs Doe", status: "Pending" },
  { id: "3", title: "Contract review for ABC Corp", status: "Completed" },
];

export default function Dashboard() {
  const [recentlyVisitedOpen, setRecentlyVisitedOpen] = React.useState(true)
  const [updateFeedOpen, setUpdateFeedOpen] = React.useState(true)
  const [workspacesOpen, setWorkspacesOpen] = React.useState(true);
  const [projects, setProjects] = React.useState([]);
  const [meeting, setMeeting] = React.useState(null);
  const { user } = useUser();
  const [isLoading, setIsloading] = React.useState(false);
  const [pedingDocs, setPendingDocs] = React.useState([]);
  // const [progress, setProgress] = React.useState([]);
  const [dates, setDates] = React.useState(getRecentDatesWithLabels(20));
  const [selectedDate, setSelectedDate] = React.useState(dates[0].date);


  // const getProgress = React.useCallback(async () => {
  //   try {
  //     const res = await getAllTaskProgressRequest(selectedDate);
  //     setProgress(res.data.progress)
  //   } catch (error) {
  //     console.log(error?.response?.data?.meesage || error?.meesage);
  //   }
  // }, [selectedDate])

  const getProjectAllProject = React.useCallback(async () => {
    setIsloading(true)
    try {
      const [res, res2] = await Promise.all([getAllProjectRequest(), getPedingDocsRequest()]);
      const { projects, collaboratedProjects } = res.data;
      setProjects([...projects, ...collaboratedProjects]);
      setPendingDocs(res2.data);
    } catch (error) {
      setProjects(null);
      console.log(error?.response?.data?.meesage || error?.meesage);
    } finally {
      setIsloading(false)
    }
  }, []);


  const getMeetings = React.useCallback(async () => {

    try {
      const res = await getsMeetingRequest(true);

      setMeeting(res.data.meetings[0]);
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
    }
  }, []);

  React.useEffect(() => {
    getProjectAllProject();
    getMeetings();
  }, []);

  // React.useEffect(() => {
  //   getProgress();
  // }, [selectedDate])

  if (isLoading) {
    return <>
      <div className="h-screen bg-secondary m-2 rounded-md flex items-center justify-center">
        <Loader />
      </div>
    </>
  }

  return (
    <div className="flex h-screen bg-secondary m-2 rounded-md overflow-y-auto">
      <div className="flex-1 overflow-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground-primary">Dashboard</h1>
        </header>


        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded shadow p-6 hover:bg-purple-50 transition flex items-center justify-center flex-col gap-3">
            <p className="font-semibold text-lg text-accent">Total Cases</p>
            <p className="text-accent-hover text-5xl">{projects?.length}</p>
          </div>
          <div className="bg-white rounded shadow p-6 hover:bg-purple-50 transition flex items-center justify-center flex-col gap-3">
            <p className="font-semibold text-lg text-accent">Team Member</p>
            <p className="text-accent-hover text-5xl">{projects[0]?.Members?.length - 1}</p>
          </div>

          <div className="bg-white rounded shadow p-6 hover:bg-purple-50 transition flex items-center justify-center flex-col gap-3">
            <p className="font-semibold text-lg text-accent">Total Clients</p>
            <p className="text-accent-hover text-5xl">
              {projects?.reduce((total, p) => total + (p?.project?.Clients?.length || 0), 0)}
            </p>
          </div>

          <div className="bg-white rounded shadow p-6 hover:bg-purple-50 transition flex items-center justify-center flex-col gap-3">
            <p className="font-semibold text-lg text-accent">Total Tasks</p>
            <p className="text-accent-hover text-5xl">
              {projects?.reduce((total, p) => total + (p?.project?.Tasks?.length || 0), 0)}
            </p>
          </div>


        </section>

        {
          projects && projects.length > 0 &&
          <Collapsible
            open={recentlyVisitedOpen}
            onOpenChange={setRecentlyVisitedOpen}
            className="mb-6"
          >
            <CollapsibleTrigger className="flex w-full items-center gap-2">
              <ChevronDown
                className={`h-5 w-5 transition-transform text-foreground-primary ${recentlyVisitedOpen ? "rotate-180" : ""}`}
              />
              <h2 className="text-2xl font-semibold text-foreground-primary">Cases</h2>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects?.map((project, index) => (
                  <Link href={`/dashboard/project/${project.project_id}`} key={project.project_id}>
                    <Card className="group cursor-pointer bg-white hover:bg-secondary-hover transition-all">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-purple-700 text-lg">Case No. #{project?.project_id}</h3>
                          <span className="text-sm text-gray-500">{moment(project?.created_at).format("DD-MM-YYYY")}</span>
                        </div>

                        <h2 className="text-xl font-bold text-black">{project?.name}</h2>

                        <div className="text-sm text-gray-700">
                          <p><span className="font-semibold">Client:</span> {project?.Clients?.[0]?.user?.name || "NA"}</p>
                          <p><span className="font-semibold">Opposition Party:</span> {project?.opposing || "NA"}</p>
                        </div>

                        <div className="text-sm text-gray-600 mt-2 line-clamp-3">
                          {project?.description}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        }



        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Recent Matters</h2>
          <ul>
            {recentMatters.map((matter) => (
              <li
                key={matter.id}
                className="border-b last:border-b-0 border-gray-200 py-3 hover:bg-purple-50 cursor-pointer rounded"
              >
                <p className="font-medium text-purple-900">{matter.title}</p>
                <p className="text-sm text-gray-600">{matter.status}</p>
              </li>
            ))}
          </ul>
        </div>

        <MatterCalendar/>

        {/* Update Feed Section */}
        {/* {
          meeting &&
          <Collapsible
            open={updateFeedOpen}
            onOpenChange={setUpdateFeedOpen}
            className="mb-6"
          >
            <CollapsibleTrigger className="flex w-full items-center gap-2">
              <ChevronDown
                className={`h-5 w-5 transition-transform text-foreground-primary ${updateFeedOpen ? "rotate-180" : ""}`}
              />
              <h2 className="text-lg font-semibold text-foreground-primary">Schedule Meetings</h2>
              <span className="rounded-full bg-tbutton-bg px-1.5 py-0.5 text-xs text-tbutton-text">
                1
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4">
                <Card className='border-none shadow-gray-50 bg-secondary'>
                  <CardContent className='p-3'>
                    <div className='flex justify-between items-center'>
                      <h3 className='text-foreground-primary text-lg'>{meeting?.user_id == user?.user_id ? 'You created a meeting' : 'You participant a meeting'}</h3>
                      <RenderMembers members={meeting?.participants || []} />
                      <Badge className={`py-2 px-4 ${meeting?.status == 'SCHEDULED' ? "bg-green-500" : meeting?.status == 'CANCELED' ? 'bg-red-500' : 'bg-gray-500'}`}> {meeting?.status}</Badge>
                      <time className='text-foreground-secondary text-md'>{moment(meeting?.created_at).format("DD MMM YYYY")}</time>

                    </div>

                    <div className='mt-8'>
                      <h2 className='text-3xl text-foreground-primary'>{meeting?.heading}</h2>
                      <p className='mt-2 text-foreground-secondary'>{meeting?.description}</p>
                      <p className='flex items-center gap-4 text-foreground-secondary mt-2'><strong className='text-foreground-primary'>Scheduled Time:</strong> {moment(meeting?.date).format("lll")}</p>
                      {
                        meeting?.status == "SCHEDULED" && (
                          <Link className='text-accent hover:text-accent-hover my-2' href={`/meeting/${meeting?.meeting_id}`}>Join Now</Link>
                        )
                      }
                    </div>

                    <div className="mt-8">
                      <Table className="border-collapse border rounded-md">
                        <TableHeader className="border-b">
                          <TableRow>
                            <TableHead className="border-r last:border-r-0 text-tbutton-text bg-tbutton-bg">Name</TableHead>
                            <TableHead className="border-r last:border-r-0 text-tbutton-text bg-tbutton-bg">Opinion</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y">
                          {
                            meeting?.participants.map((participant) => (
                              <TableRow key={participant.meeting_participant_id}>
                                <TableCell className='border-r last:border-r-0 cursor-pointer text-foreground-primary'>
                                  {participant.user.name}
                                </TableCell>
                                <TableCell className='border-r last:border-r-0 cursor-pointer text-foreground-primary'>
                                  {participant.vote == "PENDING" ? "NO RESPONSE" : participant.vote}
                                </TableCell>
                              </TableRow>
                            ))
                          }

                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleContent>
          </Collapsible>
        } */}


        {/* {
          pedingDocs?.length != 0 &&
          <div className="mt-5">
            <h1 className="text-xl font-semibold mb-5 text-foreground-primary">Client Pending Documents</h1>
            {
              pedingDocs.map(pro => (
                <div className="mt-4" key={pro.project_id}>
                  <h1 className="text-lg font-semibold mb-2 text-foreground-primary">Project: {pro.name}</h1>
                  <div className="flex-1 overflow-auto">
                    <Table className="border-collapse border rounded-md">
                      <TableHeader className="border-b">
                        <TableRow>
                          <TableHead className="!w-[80px] border-r last:border-r-0 text-foreground-primary">#</TableHead>

                          <TableHead className="w-[300px] border-r last:border-r-0 text-foreground-primary">Client Name</TableHead>
                          <TableHead className="border-r last:border-r-0 text-foreground-primary">Document Name</TableHead>
                          <TableHead className="border-r last:border-r-0 text-foreground-primary">Description</TableHead>
                          <TableHead className="border-r last:border-r-0 text-foreground-primary">Requested Date</TableHead>
                          <TableHead className="border-r last:border-r-0 text-foreground-primary">Status</TableHead>
                          <TableHead className="border-r last:border-r-0 text-foreground-primary">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y">
                        {
                          pro.pendingDocs.map((document, index) => (
                            <TableRow key={document.document_id}>
                              <TableCell className='border-r last:border-r-0 cursor-pointer text-foreground-primary'>
                                {index + 1}
                              </TableCell>

                              <TableCell className={`border-r last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer`}>
                                {document?.projectClient?.user?.name}
                              </TableCell>
                              <TableCell className={`border-r last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer`}>
                                {document?.name}
                              </TableCell>

                              <TableCell className="border-r last:border-r-0 !p-1 text-center text-foreground-primary">
                                {document?.status}
                              </TableCell>
                              <TableCell className={`border-r last:border-r-0 !p-0 text-center text-foreground-primary cursor-pointer`}>
                                {moment(document.created_at).format("DD MMM YYYY")}
                              </TableCell>
                              <TableCell className={`border-r last:border-r-0 !p-1 text-center text-foreground-primary`}>
                                {document.status}
                              </TableCell>
                              <TableCell className={`border-r last:border-r-0 !p-1 text-center relative cursor-pointer group`}>
                                <Button className="bg-tbutton-bg text-white hover:bg-tbutton-hover hover:text-tbutton-text">Request Again</Button>
                              </TableCell>
                            </TableRow>
                          ))
                        }

                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))
            }
          </div>
        } */}






      </div>

    </div>
  )
}

