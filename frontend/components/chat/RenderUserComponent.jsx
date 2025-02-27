import React, { useCallback } from 'react'
import AvatarCompoment from '../AvatarCompoment'

const RenderUserComponent = ({ users, handleSelectChat, searchUser, query, setUser, setQuery, searchLoading }) => {
    const handleSelectUser = useCallback((user) => {
        setUser(prev => [...prev, user]);
        handleSelectChat(user);
        setQuery("");
    }, [])
    return (
        <>

            {
                query && searchUser.length != 0 && searchUser?.map((user) => (
                    <div key={user.email} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={() => handleSelectUser(user)}>
                        <AvatarCompoment name={user.name} />
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.active_status}</p>
                        </div>
                    </div>
                ))

            }

            {
                !searchLoading && query && searchUser.length == 0 &&
                <div className='h-full flex items-center justify-center'>
                    <h2 className='text-xl font-normal'>NO USER FOUND</h2>
                </div>
            }

            {
                searchLoading && query && searchUser.length == 0 &&
                <div className='h-full flex items-center justify-center'>
                    <h2 className='text-xl font-normal'>Searching...</h2>
                </div>
            }

            {
                !query && users?.map((user) => (
                    <div key={user.email} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={() => handleSelectChat(user)}>
                        <AvatarCompoment name={user.name} />
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.active_status}</p>
                        </div>
                    </div>
                ))
            }


            {
                !query && users.length == 0 &&
                <div className='h-full flex items-center justify-center'>
                    <h2 className='text-xl font-normal'>NO CHAT FOUND SEARCH USER AND START CHAT</h2>
                </div>
            }
        </>
    )
}

export default RenderUserComponent