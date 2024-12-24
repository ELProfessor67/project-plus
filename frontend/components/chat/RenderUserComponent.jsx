import React from 'react'
import AvatarCompoment from '../AvatarCompoment'

const RenderUserComponent = ({ users, handleSelectChat }) => {
    return (
        <>
            {
                users?.map((user) => (
                    <div key={user.email} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={() => handleSelectChat(user)}>
                        <AvatarCompoment name={user.name} />
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">Last message...</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default RenderUserComponent