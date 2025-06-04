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
                    <div 
                        key={user.email} 
                        className="flex items-center space-x-3 p-2 hover:bg-secondary-hover rounded-lg cursor-pointer transition-colors" 
                        onClick={() => handleSelectUser(user)}
                    >
                        <AvatarCompoment name={user.name} />
                        <div>
                            <p className="font-medium text-foreground-primary">{user.name}</p>
                            <p className="text-sm text-foreground-secondary">{user.active_status}</p>
                        </div>
                    </div>
                ))
            }

            {
                !searchLoading && query && searchUser.length == 0 &&
                <div className='h-full flex items-center justify-center'>
                    <h2 className='text-xl font-normal text-foreground-primary'>NO USER FOUND</h2>
                </div>
            }

            {
                searchLoading && query && searchUser.length == 0 &&
                <div className='h-full flex items-center justify-center'>
                    <h2 className='text-xl font-normal text-foreground-primary'>Searching...</h2>
                </div>
            }

            {
                !query && users?.map((user) => (
                    <div 
                        key={user.email} 
                        className="flex items-center space-x-3 p-2 hover:bg-secondary-hover rounded-lg cursor-pointer transition-colors" 
                        onClick={() => handleSelectChat(user)}
                    >
                        <AvatarCompoment name={user.name} />
                        <div>
                            <p className="font-medium text-foreground-primary">{user.name}</p>
                            <p className="text-sm text-foreground-secondary">{user.active_status}</p>
                        </div>
                    </div>
                ))
            }

            {
                !query && users.length == 0 &&
                <div className='h-full flex items-center justify-center'>
                    <h2 className='text-xl font-normal text-foreground-primary'>NO CHAT FOUND SEARCH USER AND START CHAT</h2>
                </div>
            }
        </>
    )
}

export default RenderUserComponent