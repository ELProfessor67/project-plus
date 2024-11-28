"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  ChevronDown,
  Clock,
  Info,
  LayoutGrid,
  Plus,
  Search,
  Settings,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


export default function Page() {
  const sections = [
    { 
      title: "Past Dates", 
      items: 1,
      color: "text-red-500",
      tasks: [{
        id: "1",
        title: "Task 1",
        group: "To-Do",
        board: "test",
        date: "6 Nov",
        status: "Working on it",
        priority: "High"
      }]
    },
    { title: "Today", items: 0, color: "text-green-500" },
    { title: "This week", items: 0, color: "text-blue-500" },
    { title: "Next week", items: 0, color: "text-purple-500" },
    { title: "Later", items: 0, color: "text-yellow-500" },
    { title: "Without a date", items: 0, color: "text-gray-500" }
  ]

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">My Work</h1>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline">Customize</Button>
          </div>
        </div>

        {/* View Tabs */}
        <Tabs defaultValue="table" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New item
              </Button>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input className="w-64 pl-8" placeholder="Search" />
              </div>
              <Button variant="outline">
                Date view
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="table" className="mt-4">
            {/* Table Header */}
            <Card>
              <div className="grid grid-cols-[1fr,100px,120px,120px,100px,120px,100px] gap-4 border-b p-2 text-sm font-medium text-gray-500">
                <div>Task</div>
                <div>Group</div>
                <div>Board</div>
                <div>People</div>
                <div>Date</div>
                <div>Status</div>
                <div>Priority</div>
              </div>

              {/* Sections */}
              {sections.map((section) => (
                <Collapsible key={section.title}>
                  <CollapsibleTrigger className="flex w-full items-center gap-2 p-2 hover:bg-gray-50">
                    <ChevronDown className="h-4 w-4" />
                    <Clock className="h-4 w-4" />
                    <span className={`font-medium ${section.color}`}>{section.title}</span>
                    <span className="text-sm text-gray-500">
                      {section.items} {section.items === 1 ? 'item' : 'items'}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {section.tasks?.map((task) => (
                      <div
                        key={task.id}
                        className="grid grid-cols-[1fr,100px,120px,120px,100px,120px,100px] gap-4 border-t p-2 text-sm hover:bg-gray-50"
                      >
                        <div>{task.title}</div>
                        <div>{task.group}</div>
                        <div>{task.board}</div>
                        <div>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg?height=24&width=24" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>{task.date}</div>
                        <div>
                          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                            {task.status}
                          </span>
                        </div>
                        <div>
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                    {section.items === 0 && (
                      <div className="border-t p-2 text-center text-sm text-gray-500">
                        No items
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}

              {/* Add Item Button */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 rounded-none border-t p-2 text-gray-500 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                Add item
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="flex h-[500px] items-center justify-center text-gray-500">
              Calendar view coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}