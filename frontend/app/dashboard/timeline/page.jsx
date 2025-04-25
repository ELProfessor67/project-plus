"use client"
import { getAllTaskProgressRequest } from '@/lib/http/task';
import { getRecentDatesWithLabels } from '@/utils/getRecentDatesWithLabels';
import React, { useState } from 'react'
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import moment from 'moment';
import Loader from '@/components/Loader';
import { getHourMinDiff } from '@/utils/calculateTIme';
import Timer from '@/components/Timer';
import { useUser } from '@/providers/UserProvider';

const page = () => {
  const [progress, setProgress] = React.useState([]);
  const [dates, setDates] = React.useState(getRecentDatesWithLabels(90));
  const [selectedDate, setSelectedDate] = React.useState(dates[0]);
  const [selectedEndDate, setSelectedEndDate] = React.useState(dates[0]);
  const [selectedType, setSelectedType] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { user } = useUser()


  const getProgress = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAllTaskProgressRequest(selectedDate?.date, selectedEndDate.date,selectedType, selectedProject);
      setProgress(res.data.progress)
      setTimes(res.data.times);
      setDocuments(res.data.documents)
    } catch (error) {
      console.log(error?.response?.data?.meesage || error?.meesage);
    } finally {
      setLoading(false)
    }
  }, [selectedDate?.date, selectedType, selectedProject,selectedEndDate?.date]);


  React.useEffect(() => {
    getProgress();
  }, [selectedDate?.date, selectedType,selectedProject,selectedEndDate?.date]);


  console.log(selectedDate, selectedEndDate)
  if (loading) {
    return <>
      <div className=" h-screen bg-white m-2 rounded-md flex items-center justify-center">

        <Loader />
      </div>
    </>
  }

  return (
    <div className="h-screen bg-white m-2 rounded-md overflow-y-auto p-2">
      <div className="flex justify-between flex-1 mt-5">
        <h1 className="text-3xl text-black uppercase">{selectedDate?.label} Working Hour</h1>
        <div className="flex gap-2 justify-end">
          <Select onValueChange={(value) => setSelectedDate(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"Start Date"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Dates</SelectLabel>
                {
                  dates.map(date => (
                    <SelectItem value={date} key={date.date}>{date.label}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedEndDate(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"End Date"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Dates</SelectLabel>
                {
                  dates.map(date => (
                    <SelectItem value={date} key={date.date}>{date.label}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedProject(value)} value={selectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={"Select Project"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Project</SelectLabel>
                <SelectItem value={null}>All</SelectItem>
                {
                  user?.Projects.map(project => (
                    <SelectItem value={project.project_id} key={project.project_id}>{project.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {
        times.map(project => (
          <div className='mt-5'>
            <h1 className='text-2xl text-red-500'>{project.name}</h1>


            <div className="flex-1 overflow-auto mt-2">
              <Table className="border-collapse border rounded-md">
                <TableHeader className="border-b">
                  <TableRow>
                    <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                    <TableHead className="border-r last:border-r-0">Task</TableHead>
                    <TableHead className="border-r last:border-r-0">User</TableHead>
                    <TableHead className="border-r last:border-r-0">START</TableHead>
                    <TableHead className="border-r last:border-r-0">DESCRIPTION</TableHead>
                    <TableHead className="border-r last:border-r-0">Date</TableHead>
                    <TableHead className="border-r last:border-r-0">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableHeader>
                  {
                    project.Time.map((time, index) => (
                      <TableRow>
                        <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                          {index + 1}
                        </TableCell>

                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                          {time.task?.name}
                        </TableCell>
                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                          {time.user?.name}
                        </TableCell>

                        <TableCell className="border-r last:border-r-0 !p-1 text-center">
                          {
                            time.status != "PROCESSING" &&
                            <>{moment(time.start).format("h:mm A")} - {moment(time?.end).format("h:mm A")}</>
                          }
                          {
                            time.status == "PROCESSING" &&
                            <>{moment(time.start).format("h:mm A")} - Working...</>
                          }
                        </TableCell>
                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                          {time.work_description || "NA"}
                        </TableCell>
                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                          {moment(time.created_at).format("DD MMM YYYY")}
                        </TableCell>
                        <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>

                          {
                            time.status != "PROCESSING" &&
                            <>{getHourMinDiff(time.start, time.end)}</>
                          }
                          {
                            time.status == "PROCESSING" &&
                            <span className='text-green-500'><Timer startTime={time.start} /></span>
                          }
                        </TableCell>

                      </TableRow>
                    ))
                  }
                </TableHeader>


              </Table>
            </div>
          </div>
        ))
      }
      {/* progress  */}

      <div className="flex justify-between flex-1 mt-16">
        <h1 className="text-3xl text-black uppercase">{selectedDate?.label} Progress</h1>
        <div className="flex gap-2 justify-end">
          <Select onValueChange={(value) => setSelectedType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                <SelectItem value={null}>ALL</SelectItem>
                <SelectItem value={"MAIL"}>MAIL</SelectItem>
                <SelectItem value={"MEETING"}>MEETING</SelectItem>
                <SelectItem value={"CHAT"}>CHAT</SelectItem>
                <SelectItem value={"CALL"}>CALL</SelectItem>
                <SelectItem value={"COMMENT"}>COMMENT</SelectItem>
                <SelectItem value={"TRANSCRIBTION"}>TRANSCRIBTION</SelectItem>
                <SelectItem value={"STATUS_CHANGED"}>STATUS_CHANGED</SelectItem>
                <SelectItem value={"MEDIA"}>MEDIA</SelectItem>
                <SelectItem value={"OTHER"}>OTHER</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>


        </div>
      </div>

      {
        progress.map(project => (
          <div className='mt-5'>
            <h1 className='text-2xl text-red-500'>{project.name}</h1>


            <div className="flex-1 overflow-auto mt-2">
              <Table className="border-collapse border rounded-md">
                <TableHeader className="border-b">
                  <TableRow>
                    <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                    <TableHead className="w-[300px] border-r last:border-r-0">Task Name</TableHead>
                    <TableHead className="border-r last:border-r-0">User Name</TableHead>
                    <TableHead className="border-r last:border-r-0">Message</TableHead>
                    <TableHead className="border-r last:border-r-0">Type</TableHead>
                    <TableHead className="border-r last:border-r-0">Date</TableHead>
                  </TableRow>
                </TableHeader>
                {
                  project.Tasks.map(task => (
                    <>
                      {
                        task.Progress.map((progress, index) => (
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
                            <TableCell className="border-r last:border-r-0 !p-1 text-center">
                              {progress?.type}
                            </TableCell>
                            <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                              {moment(progress.created_at).format("DD MMM YYYY")}
                            </TableCell>

                          </TableRow>
                        ))
                      }
                    </>
                  ))
                }


              </Table>
            </div>
          </div>
        ))
      }



      {/* documents  */}

      <div className="flex justify-between flex-1 mt-16">
        <h1 className="text-3xl text-black uppercase">{selectedDate?.label} Documents</h1>

      </div>

      {
        documents.map(project => (
          <div className='mt-5'>
            <h1 className='text-2xl text-red-500'>{project.name}</h1>


            <div className="flex-1 overflow-auto mt-2">
              <Table className="border-collapse border rounded-md">
                <TableHeader className="border-b">
                  <TableRow>
                    <TableHead className="!w-[80px] border-r last:border-r-0">#</TableHead>

                    <TableHead className="w-[300px] border-r last:border-r-0">Name</TableHead>
                    <TableHead className="border-r last:border-r-0">Description</TableHead>
                    <TableHead className="border-r last:border-r-0">Date</TableHead>
                    <TableHead className="border-r last:border-r-0">Status</TableHead>
                    <TableHead className="border-r last:border-r-0">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {
                  project.Clients.map(client => (
                    <>
                      {
                        client.Documents.map((document, index) => (
                          <TableRow>
                            <TableCell className=' border-r last:border-r-0 cursor-pointer'>
                              {index + 1}
                            </TableCell>

                            <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                              {document.name}
                            </TableCell>

                            <TableCell className="border-r last:border-r-0 !p-1 text-center">
                              {document.description}
                            </TableCell>
                            <TableCell className={`border-r last:border-r-0 !p-0 text-center text-black cursor-pointer`}>
                              {moment(document.created_at).format("DD MMM YYYY")}
                            </TableCell>
                            <TableCell className={`border-r last:border-r-0 !p-1 text-center`}>




                              {
                                user?.Role == "PROVIDER" &&
                                (
                                  <Select onValueChange={(status) => handleUpdateStatus(status, document.document_id)} value={document.status} className='w-full'>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="PENDING">PENDING</SelectItem>
                                        <SelectItem value="REJECTED">REJECTED</SelectItem>
                                        <SelectItem value="APPROVED">APPROVED</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )
                              }
                              {
                                user?.Role == "CLIENT" &&
                                (
                                  <span>{document.status}</span>
                                )
                              }
                            </TableCell>
                            <TableCell className={`border-r last:border-r-0 !p-1 text-black text-center relative cursor-pointer group`}>
                              {
                                user?.Role == "PROVIDER" &&
                                (
                                  <>
                                    {

                                      document.filename &&
                                      <a target='__black' href={document.file_url} className='text-blue-500 underline'>{document.filename}</a>
                                    }

                                    {
                                      !document.filename &&
                                      <span>No Document Uploaded</span>
                                    }
                                  </>
                                )
                              }
                              {
                                user?.Role == "CLIENT" &&
                                (
                                  <div className='flex items-center gap-3'>
                                    {
                                      document.filename &&
                                      <a target='__black' href={document.file_url} className='text-blue-500 underline'>{document.filename}</a>
                                    }
                                    <Input
                                      type="file"
                                      onChange={(e) => hadleUpload(e, document.document_id)}
                                    />
                                  </div>
                                )
                              }
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </>
                  ))
                }


              </Table>
            </div>
          </div>
        ))
      }


    </div>
  )
}

export default page