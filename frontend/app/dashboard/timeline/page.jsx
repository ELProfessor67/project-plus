"use client"
import { getAllTaskProgressRequest } from '@/lib/http/task';
import { getRecentDatesWithLabels } from '@/utils/getRecentDatesWithLabels';
import React, { useMemo, useState } from 'react'
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import moment from 'moment';
import Loader from '@/components/Loader';
import { getHourMinDiff } from '@/utils/calculateTIme';
import Timer from '@/components/Timer';
import { useUser } from '@/providers/UserProvider';
import { Input } from '@/components/ui/input';

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
  const [username, setUsername] = useState("");
  const [progressUsername, setProgressUsername] = useState("");
  const { user } = useUser();

  const filterTimes = useMemo(() => {
    if (!username) return times;

    return times.map(project => ({
      ...project,
      Time: project.Time.filter(time => time.user?.name.toLowerCase().includes(username.toLowerCase()))
    })).filter(project => project.Time.length > 0);
  },[times, username]);

  const filterProgress = useMemo(() => {
    if (!progressUsername) return progress;
    return progress.map(project => ({
      ...project,
      Tasks: project.Tasks.map(task => ({
        ...task,
        Progress: task.Progress.filter(progress => progress.user?.name.toLowerCase().includes(progressUsername.toLowerCase()))
      })).filter(task => task.Progress.length > 0)
    })).filter(project => project.Tasks.some(task => task.Progress.length > 0));
  }, [progress, progressUsername]);


  const getProgress = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAllTaskProgressRequest(selectedDate?.date, selectedEndDate.date, selectedType, selectedProject);
      setProgress(res.data.progress)
      setTimes(res.data.times);
      setDocuments(res.data.documents)
    } catch (error) {
      console.log(error?.response?.data?.meesage || error?.meesage);
    } finally {
      setLoading(false)
    }
  }, [selectedDate?.date, selectedType, selectedProject, selectedEndDate?.date]);

  React.useEffect(() => {
    getProgress();
  }, [selectedDate?.date, selectedType, selectedProject, selectedEndDate?.date]);

  if (loading) {
    return <>
      <div className="h-screen bg-secondary m-2 rounded-md flex items-center justify-center">
        <Loader />
      </div>
    </>
  }

  return (
    <div className="h-screen bg-secondary m-2 rounded-md overflow-y-auto p-8">
      <div className="flex justify-between flex-1 mt-5">
        <h1 className="text-4xl text-foreground-primary uppercase font-bold">Timeline</h1>
        <div className="flex gap-2 justify-end">
          <Select onValueChange={(value) => setSelectedDate(value)}>
            <SelectTrigger className="w-[180px] bg-white border-primary text-black">
              <SelectValue placeholder={"Start Date"} />
            </SelectTrigger>
            <SelectContent className="bg-white border-primary">
              <SelectGroup>
                <SelectLabel className="text-gray-400">Dates</SelectLabel>
                {
                  dates.map(date => (
                    <SelectItem 
                      value={date} 
                      key={date.date}
                      className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text"
                    >
                      {date.label}
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedEndDate(value)}>
            <SelectTrigger className="w-[180px] bg-white border-primary text-black">
              <SelectValue placeholder={"End Date"} />
            </SelectTrigger>
            <SelectContent className="bg-white border-primary">
              <SelectGroup>
                <SelectLabel className="text-gray-400">Dates</SelectLabel>
                {
                  dates.map(date => (
                    <SelectItem 
                      value={date} 
                      key={date.date}
                      className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text"
                    >
                      {date.label}
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedProject(value)} value={selectedProject}>
            <SelectTrigger className="w-[180px] bg-white border-primary text-black">
              <SelectValue placeholder={"Select Project"} />
            </SelectTrigger>
            <SelectContent className="bg-white border-primary">
              <SelectGroup>
                <SelectLabel className="text-gray-400">Select Project</SelectLabel>
                <SelectItem 
                  value={null}
                  className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text"
                >
                  All
                </SelectItem>
                {
                  user?.Projects.map(project => (
                    <SelectItem 
                      value={project.project_id} 
                      key={project.project_id}
                      className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text"
                    >
                      {project.name}
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between flex-1 mt-10">
        <h1 className="text-3xl text-foreground-primary uppercase">{selectedDate?.label} Working Hour</h1>
        <div className="flex gap-2 justify-end">
          <Input
            type="text"
            placeholder="Search User by Name"
            className="bg-white border-primary text-black w-[180px]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      {
        filterTimes.map(project => (
          <div className='mt-5'>
            <h1 className='text-2xl text-foreground-primary'>{project.name}</h1>

            <div className="flex-1 overflow-auto mt-2">
              <Table className="border-collapse border border-primary rounded-md">
                <TableHeader className="border-b border-primary bg-primary/10">
                  <TableRow>
                    <TableHead className="!w-[80px] border-r border-primary last:border-r-0 text-foreground-primary font-semibold">#</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Task</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">User</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">START</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">DESCRIPTION</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Date</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    project.Time.map((time, index) => (
                      <TableRow key={index}>
                        <TableCell className='border-r border-primary last:border-r-0 text-foreground-secondary'>
                          {index + 1}
                        </TableCell>
                        <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                          {time.task?.name}
                        </TableCell>
                        <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                          {time.user?.name}
                        </TableCell>
                        <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                          {
                            time.status != "PROCESSING" &&
                            <>{moment(time.start).format("h:mm A")} - {moment(time?.end).format("h:mm A")}</>
                          }
                          {
                            time.status == "PROCESSING" &&
                            <>{moment(time.start).format("h:mm A")} - Working...</>
                          }
                        </TableCell>
                        <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                          {time.work_description || "NA"}
                        </TableCell>
                        <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                          {moment(time.created_at).format("DD MMM YYYY")}
                        </TableCell>
                        <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
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
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      }

      <div className="flex justify-between flex-1 mt-16">
        <h1 className="text-3xl text-foreground-primary uppercase">{selectedDate?.label} Progress</h1>
        <div className="flex gap-2 justify-end">
          <Input
            type="text"
            placeholder="Search User by Name"
            className="bg-white border-primary text-black w-[180px]"
            value={progressUsername}
            onChange={(e) => setProgressUsername(e.target.value)}
          />

          <Select onValueChange={(value) => setSelectedType(value)}>
            <SelectTrigger className="w-[180px] bg-white border-primary text-black">
              <SelectValue placeholder="Select a Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-primary">
              <SelectGroup>
                <SelectLabel className="text-gray-400">Type</SelectLabel>
                <SelectItem value={null} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">ALL</SelectItem>
                <SelectItem value={"MAIL"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">MAIL</SelectItem>
                <SelectItem value={"MEETING"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">MEETING</SelectItem>
                <SelectItem value={"CHAT"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">CHAT</SelectItem>
                <SelectItem value={"CALL"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">CALL</SelectItem>
                <SelectItem value={"COMMENT"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">COMMENT</SelectItem>
                <SelectItem value={"TRANSCRIBTION"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">TRANSCRIBTION</SelectItem>
                <SelectItem value={"STATUS_CHANGED"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">STATUS_CHANGED</SelectItem>
                <SelectItem value={"MEDIA"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">MEDIA</SelectItem>
                <SelectItem value={"OTHER"} className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">OTHER</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {
        filterProgress.map(project => (
          <div className='mt-5'>
            <h1 className='text-2xl text-foreground-primary'>{project.name}</h1>

            <div className="flex-1 overflow-auto mt-2">
              <Table className="border-collapse border border-primary rounded-md">
                <TableHeader className="border-b border-primary bg-primary/10">
                  <TableRow>
                    <TableHead className="!w-[80px] border-r border-primary last:border-r-0 text-foreground-primary font-semibold">#</TableHead>
                    <TableHead className="w-[300px] border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Task Name</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">User Name</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Message</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Type</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    project.Tasks.map(task => (
                      <>
                        {
                          task.Progress.map((progress, index) => (
                            <TableRow key={index}>
                              <TableCell className='border-r border-primary last:border-r-0 text-foreground-secondary'>
                                {index + 1}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {progress.task?.name}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {progress.user?.name}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {progress?.message}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {progress?.type}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {moment(progress.created_at).format("DD MMM YYYY")}
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      }

      <div className="flex justify-between flex-1 mt-16">
        <h1 className="text-3xl text-foreground-primary uppercase">{selectedDate?.label} Documents</h1>
      </div>

      {
        documents.map(project => (
          <div className='mt-5'>
            <h1 className='text-2xl text-foreground-primary'>{project.name}</h1>

            <div className="flex-1 overflow-auto mt-2">
              <Table className="border-collapse border border-primary rounded-md">
                <TableHeader className="border-b border-primary bg-primary/10">
                  <TableRow>
                    <TableHead className="!w-[80px] border-r border-primary last:border-r-0 text-foreground-primary font-semibold">#</TableHead>
                    <TableHead className="w-[300px] border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Name</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Description</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Date</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Status</TableHead>
                    <TableHead className="border-r border-primary last:border-r-0 text-foreground-primary font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    project.Clients.map(client => (
                      <>
                        {
                          client.Documents.map((document, index) => (
                            <TableRow key={index}>
                              <TableCell className='border-r border-primary last:border-r-0 text-foreground-secondary'>
                                {index + 1}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {document.name}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {document.description}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {moment(document.created_at).format("DD MMM YYYY")}
                              </TableCell>
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {
                                  user?.Role == "PROVIDER" &&
                                  (
                                    <Select 
                                      onValueChange={(status) => handleUpdateStatus(status, document.document_id)} 
                                      value={document.status} 
                                      className='w-full'
                                    >
                                      <SelectTrigger className="w-full bg-white border-primary text-black">
                                        <SelectValue placeholder="Select a status" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-white border-primary">
                                        <SelectGroup>
                                          <SelectLabel className="text-gray-400">Status</SelectLabel>
                                          <SelectItem value="PENDING" className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">PENDING</SelectItem>
                                          <SelectItem value="REJECTED" className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">REJECTED</SelectItem>
                                          <SelectItem value="APPROVED" className="text-black hover:!bg-tbutton-bg hover:!text-tbutton-text">APPROVED</SelectItem>
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
                              <TableCell className="border-r border-primary last:border-r-0 text-foreground-secondary">
                                {
                                  user?.Role == "PROVIDER" &&
                                  (
                                    <>
                                      {
                                        document.filename &&
                                        <a target='__black' href={document.file_url} className='text-primary hover:text-primary/80 underline'>{document.filename}</a>
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
                                        <a target='__black' href={document.file_url} className='text-primary hover:text-primary/80 underline'>{document.filename}</a>
                                      }
                                      <Input
                                        type="file"
                                        onChange={(e) => hadleUpload(e, document.document_id)}
                                        className="bg-white border-primary text-black"
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
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default page