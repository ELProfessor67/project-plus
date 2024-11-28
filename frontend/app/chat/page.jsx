import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bell, MessageCircle, Moon, PenSquare, Search, Send, Users, Video } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white p-4 border-r">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chat ONN</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Moon className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><PenSquare className="h-5 w-5" /></Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="secondary" className="w-full justify-start">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chats
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </Button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input className="pl-8" placeholder="Search" />
        </div>
        <div className="space-y-2">
          {['Ankit Mishra', 'Akansha Sinha', 'Harshit Nagar', 'Kirti Yadav', 'Ashish Singh'].map((name) => (
            <div key={name} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/32?u=${name}`} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">Last message...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/32?u=Kirti%20Yadav" />
              <AvatarFallback>KY</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Kirti Yadav</p>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Card className="p-3 max-w-[80%] ml-auto bg-purple-500 text-white">
            Hey! Let's plan something for this weekend. What do you say?
          </Card>
          <Card className="p-3 max-w-[80%]">
            I'm free on Saturday. Any ideas?
          </Card>
          <Card className="p-3 max-w-[80%] ml-auto bg-purple-500 text-white">
            How about a picnic at the park? The weather's supposed to be nice.
          </Card>
        </div>
        <div className="bg-white p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input className="flex-1" placeholder="Type a message here" />
            <Button size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Notifications (hidden on mobile) */}
      <div className="hidden lg:block w-64 bg-white p-4 border-l">
        <h2 className="font-bold mb-4">Notifications</h2>
        <div className="space-y-2">
          {['Alice', 'Bob', 'Charlie', 'David'].map((name) => (
            <div key={name} className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/32?u=${name}`} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm">{name} mentioned you in a chat</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}