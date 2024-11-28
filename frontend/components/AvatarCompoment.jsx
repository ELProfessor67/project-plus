import { getNameAvatar } from '@/utils/getNameAvatar'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const AvatarCompoment = ({ name,color,...props}) => {
    return (
        <Avatar  {...props} className={`!w-[2rem] !h-[2rem] ${props.className}`}>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" /> 
            <AvatarFallback className="bg-blue-500 text-white" style={color ? {background: color} : {}}>
                {getNameAvatar(name)}
            </AvatarFallback>
        </Avatar>
    )
}

export default AvatarCompoment