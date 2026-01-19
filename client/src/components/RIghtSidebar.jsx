import React, { useContext, useState, useEffect } from 'react'
import ChatContext from '../../context/ChatContext'
import AuthContext from '../../context/AuthContext';

const RIghtSidebar = () => {

    const { selectedUser, messages } = useContext(ChatContext);
    const { logout, onlineUsers } = useContext(AuthContext);
    const [msgImages, setMsgImages] = useState([]);

    // function to get images from messages and add to state
    useEffect(() => {
        if (messages) {
            setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image))
        }
    }, [messages])


    return selectedUser ? (
        <div className={`h-full bg-slate-800 border-l border-slate-700/50 text-white w-full flex flex-col`}>

            {/* User Profile Header */}
            <div className="pt-10 pb-6 px-4 flex flex-col items-center gap-3">
                <div className="relative">
                    <img
                        src={selectedUser?.profilePic || `userLogo.png`}
                        alt="pic"
                        className='w-24 h-24 rounded-full object-cover border-4 border-slate-700 shadow-xl'
                    />
                    {onlineUsers.includes(selectedUser._id) && (
                        <span className='absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-slate-800 bg-green-500'></span>
                    )}
                </div>

                <div className="text-center space-y-1">
                    <h1 className='text-xl font-bold text-white tracking-wide'>
                        {selectedUser.fullName}
                    </h1>
                    <p className='text-sm text-slate-400 px-4 line-clamp-2'>
                        {selectedUser.bio || "No bio available"}
                    </p>
                </div>
            </div>

            <div className="px-6 my-2">
                <div className="h-px bg-slate-700/50 w-full"></div>
            </div>

            {/* Shared Media Section */}
            <div id="media-display" className="flex-1 px-6 py-4 overflow-y-auto min-h-0">
                <div className="flex items-center justify-between mb-4">
                    <h3 className='text-sm font-semibold text-slate-300 uppercase tracking-wider'>
                        Shared Media
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-md">
                        {msgImages.length}
                    </span>
                </div>

                {msgImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {msgImages.map((url, index) => (
                            <div
                                key={index}
                                onClick={() => window.open(url)}
                                className="aspect-square cursor-pointer rounded-lg overflow-hidden group relative"
                            >
                                <img
                                    src={url}
                                    alt="media"
                                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-600 text-sm italic">
                        No shared media yet
                    </div>
                )}
            </div>

            {/* Footer / Logout */}
            <div className="p-6 mt-auto">
                <button
                    onClick={() => logout()}
                    className='w-full bg-slate-700 hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 text-sm font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:stroke-rose-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    ) : (
        <div className="h-full bg-slate-800 border-l border-slate-700/50 flex items-center justify-center text-slate-500">
            <p>Select a user</p>
        </div>
    )
}

export default RIghtSidebar
