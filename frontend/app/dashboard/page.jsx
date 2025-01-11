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

export default function Page() {
  const [recentlyVisitedOpen, setRecentlyVisitedOpen] = React.useState(true)
  const [updateFeedOpen, setUpdateFeedOpen] = React.useState(true)
  const [workspacesOpen, setWorkspacesOpen] = React.useState(true);
  const [projects, setProjects] = React.useState([]);
  const [meeting, setMeeting] = React.useState(null);
  const { user } = useUser();




  const getProjectAllProject = React.useCallback(async () => {

    try {
      const res = await getAllProjectRequest();
      const { projects, collaboratedProjects } = res.data;
      setProjects([...projects, ...collaboratedProjects]);
    } catch (error) {
      setProjects(null);
      console.log(error?.response?.data?.meesage || error?.meesage);
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

  return (
    <div className="flex h-screen bg-white m-2 rounded-md overflow-y-auto">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Welcome Message */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Good evening, User!</h1>
            <p className="text-sm text-gray-600">
              Quickly access your recent boards, inbox and workspaces
            </p>
          </div>
        </div>

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

        

      </div>

     
    </div>
  )
}

