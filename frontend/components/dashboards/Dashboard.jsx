"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, HelpCircle, Info, LayoutGrid, MessageCircle, Rocket, Star, Users, X } from 'lucide-react'
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


export default function Dashboard() {
  const [recentlyVisitedOpen, setRecentlyVisitedOpen] = React.useState(true)
  const [updateFeedOpen, setUpdateFeedOpen] = React.useState(true)
  const [workspacesOpen, setWorkspacesOpen] = React.useState(true);
  const [projects, setProjects] = React.useState([]);
  const [meeting, setMeeting] = React.useState(null);
  const { user } = useUser();
  const [isLoading, setIsloading] = React.useState(false);
  const [pedingDocs, setPendingDocs] = React.useState([]);
  const [progress, setProgress] = React.useState([]);
  const [dates, setDates] = React.useState(getRecentDatesWithLabels(20));
  const [selectedDate, setSelectedDate] = React.useState(dates[0].date);


  const getProgress = React.useCallback(async () => {
    try {
      const res = await getAllTaskProgressRequest(selectedDate);
      setProgress(res.data.progress)
    } catch (error) {
      console.log(error?.response?.data?.meesage || error?.meesage);
    }
  }, [selectedDate])

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

  React.useEffect(() => {
    getProgress();
  }, [selectedDate])

  if (isLoading) {
    return <>
      <div className=" h-screen bg-white m-2 rounded-md flex items-center justify-center">

        <Loader />
      </div>
    </>
  }

  return (
    <div className="flex h-screen bg-white m-2 rounded-md overflow-y-auto">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Welcome Message */}
        {/* <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Good evening, User!</h1>
            <p className="text-sm text-gray-600">
              Quickly access your recent boards, inbox and workspaces
            </p>
          </div>
        </div> */}

        {/* Recently Visited Section */}

        {
          projects && projects.length > 0 &&
          <Collapsible
            open={recentlyVisitedOpen}
            onOpenChange={setRecentlyVisitedOpen}
            className="mb-6"
          >
            <CollapsibleTrigger className="flex w-full items-center gap-2">
              <ChevronDown
                className={`h-5 w-5 transition-transform ${recentlyVisitedOpen ? "rotate-180" : ""
                  }`}
              />
              <h2 className="text-lg font-semibold">Recently visited</h2>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects?.map((project, index) => (
                  <Link href={`/dashboard/project/${project.project_id}`}>

                    <Card key={project.project_id} className="group cursor-pointer">
                      <CardContent className="p-4">
                        <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
                          <img
                            src={"https://cdn.monday.com/images/quick_search_recent_dashboard.svg"}
                            alt={project.name}
                            className="object-cover transition-transform group-hover:scale-105 w-full h-full"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-gray-600">
                              work management {'>'} Main workspace
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        }


        {
          projects && projects.length == 0 &&
          <h1 className="text-3xl">No Project Created</h1>
        }

        {/* Update Feed Section */}
        {
          meeting &&
          <Collapsible
            open={updateFeedOpen}
            onOpenChange={setUpdateFeedOpen}
            className="mb-6"
          >
            <CollapsibleTrigger className="flex w-full items-center gap-2">
              <ChevronDown
                className={`h-5 w-5 transition-transform ${updateFeedOpen ? "rotate-180" : ""
                  }`}
              />
              <h2 className="text-lg font-semibold">Schedule Meetings</h2>
              <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white">
                1
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4">
                <Card className='border-none shadow-gray-50'>
                  <CardContent className='p-3'>
                    <div className='flex justify-between items-center'>
                      <h3 className='text-gray-700 text-lg'>{meeting?.user_id == user?.user_id ? 'You created a meeting' : 'You participant a meeting'}</h3>
                      <RenderMembers members={meeting?.participants || []} />
                      <Badge className={`py-2 px-4 ${meeting?.status == 'SCHEDULED' ? "bg-green-500" : meeting?.status == 'CANCELED' ? 'bg-red-500' : 'bg-gray-500'}`}> {meeting?.status}</Badge>
                      <time className='text-gray-600 text-md'>{moment(meeting?.created_at).format("DD MMM YYYY")}</time>

                    </div>

                    <div className='mt-8'>
                      <h2 className='text-3xl'>{meeting?.heading}</h2>
                      <p className='mt-2 text-gray-600'>{meeting?.description}</p>
                      <p className='flex items-center gap-4 text-gray-600 mt-2'><strong className='text-black'>Scheduled Time:</strong> {moment(meeting?.date).format("lll")}</p>
                      {
                        meeting?.status == "SCHEDULED" && (
                          <Link className={'text-blue-500 my-2'} href={`/meeting/${meeting?.meeting_id}`}>Join Now</Link>
                        )
                      }
                    </div>

                    <div className="mt-8">
                      <Table className="border-collapse border rounded-md">
                        <TableHeader className="border-b">
                          <TableRow>
                            <TableHead className="border-r last:border-r-0 text-white bg-yellow-600">Name</TableHead>
                            <TableHead className="border-r last:border-r-0 text-white bg-red-600">Opinion</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y">
                          {
                            meeting?.participants.map((participant) => (
                              <TableRow key={participant.meeting_participant_id}>
                                <TableCell className='border-r last:border-r-0 cursor-pointer text-gray-600'>
                                  {participant.user.name}
                                </TableCell>
                                <TableCell className='border-r last:border-r-0 cursor-pointer text-gray-600'>
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
        }


        {
          pedingDocs?.length != 0 &&
          <div className="mt-5">
            <h1 className="text-xl font-semibold mb-5">Client Pending Documents</h1>
            {
              pedingDocs.map(pro => (
                <div className="mt-4">
                  <h1 className="text-lg font-semibold mb-2">Project: {pro.name}</h1>
                  <div className="flex-1 overflow-auto">
                    <Table className="border-collapse border rounded-md">
                      <TableHeader className="border-b">
                        <TableRow>
                          <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                          <TableHead className="w-[300px] border-r last:border-r-0">Client Name</TableHead>
                          <TableHead className="border-r last:border-r-0">Document Name</TableHead>
                          <TableHead className="border-r last:border-r-0">Description</TableHead>
                          <TableHead className="border-r last:border-r-0">Requested Date</TableHead>
                          <TableHead className="border-r last:border-r-0">Status</TableHead>
                          <TableHead className="border-r last:border-r-0">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y">
                        {
                          pro.pendingDocs.map((document, index) => (
                            <TableRow>
                              <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                                {index + 1}
                              </TableCell>

                              <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                {document?.projectClient?.user?.name}
                              </TableCell>
                              <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                {document?.name}
                              </TableCell>

                              <TableCell className="border-r last:border-r-0 !p-1 text-center">
                                {document?.status}
                              </TableCell>
                              <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                                {moment(document.created_at).format("DD MMM YYYY")}
                              </TableCell>
                              <TableCell className={`border-r last:border-r-0 !p-1 text-center`}>
                                {document.status}
                              </TableCell>
                              <TableCell className={`border-r last:border-r-0 !p-1 text-black text-center relative cursor-pointer group`}>
                                <Button className="bg-blue-500 text-white">Request Again</Button>
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
        }



        <div className="mt-10">

          <div className="flex items-center justify-between">
            <h1 className="text-3xl text-black">Today Progress</h1>
            <div className="flex items-center gap-2 justify-end">

              <Select onValueChange={(value) => setSelectedDate(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Today</SelectLabel>
                    {
                      dates.map(date => (
                        <SelectItem value={date.date} key={date.date}>{date.label}</SelectItem>
                      ))
                    }

                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>



          <div className="flex-1 overflow-auto mt-5">
            <Table className="border-collapse border rounded-md">
              <TableHeader className="border-b">
                <TableRow>
                  <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                  <TableHead className="w-[300px] border-r last:border-r-0">Task Name</TableHead>
                  <TableHead className="border-r last:border-r-0">User Name</TableHead>
                  <TableHead className="border-r last:border-r-0">Message</TableHead>
                  <TableHead className="border-r last:border-r-0">Date</TableHead>
                </TableRow>
              </TableHeader>
              {
                progress.length != 0 &&
                <TableBody className="divide-y">
                  {
                    progress.map((progress, index) => (
                      <TableRow>
                        <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                          {index + 1}
                        </TableCell>

                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                          {progress.task?.name}
                        </TableCell>
                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                          {progress.user?.name}
                        </TableCell>

                        <TableCell className="border-r last:border-r-0 !p-1 text-center">
                          {progress?.message}
                        </TableCell>
                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                          {moment(progress.created_at).format("DD MMM YYYY")}
                        </TableCell>

                      </TableRow>
                    ))
                  }

                </TableBody>
              }

              {
                progress.length === 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No Progress on {selectedDate}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )
              }


            </Table>
          </div>
        </div>


      </div>

    </div>
  )
}

