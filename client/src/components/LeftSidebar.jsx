import { useNavigate } from 'react-router-dom'
import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../../context/AuthContext.jsx';
import ChatContext from '../../context/ChatContext.jsx';


const LeftSidebar = () => {



    const { getUsers, users, selectedUser, setSelectedUser, unseenMsgs, setUnseenMsgs } = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState(false);


    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();

    }, [onlineUsers])


    const navigate = useNavigate();
    return (
        <div className={`h-full flex flex-col bg-slate-800 ${selectedUser ? `max-md:hidden` : "w-full"}`}>
            {/* Header Section */}
            <div className="p-4 sm:p-6 border-b border-slate-700/50">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">ChitChat</h1>
                    </div>

                    <div className="relative group">
                        <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                            <img src='/userLogo.png' alt='menu' className='w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity' />
                        </button>

                        <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 hidden group-hover:block">
                            <button onClick={() => navigate('/profile')} className='w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors flex items-center gap-2'>
                                <span>Edit Profile</span>
                            </button>
                            <div className='my-1 border-t border-slate-700/50'></div>
                            <button onClick={() => logout()} className='w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2'>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder='Search users...'
                        className='w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500'
                    />
                    <img src="/searchIcon.jpg" alt="Search" className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 rounded-full' />
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {filteredUsers.map((user, idx) => {
                    const isOnline = onlineUsers.includes(user._id);
                    const isSelected = selectedUser?._id === user._id;
                    const hasUnseen = unseenMsgs[user._id] > 0;

                    return (
                        <div
                            key={idx}
                            onClick={() => {
                                setSelectedUser(user);
                                setUnseenMsgs((prev) => ({ ...prev, [user._id]: 0 }))
                            }}
                            className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                                ${isSelected ? 'bg-indigo-600 shadow-md shadow-indigo-900/20' : 'hover:bg-slate-700/50'}
                            `}
                        >
                            <div className="relative">
                                <img
                                    src={user?.profilePic || `/userLogo.png`}
                                    alt="pic"
                                    className={`w-12 h-12 rounded-full object-cover border-2 transition-colors ${isSelected ? 'border-indigo-400' : 'border-slate-600 group-hover:border-slate-500'}`}
                                />
                                {isOnline && (
                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${isSelected ? 'border-indigo-600 bg-white' : 'border-slate-800 bg-green-500'}`}></span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`font-semibold truncate text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                        {user.fullName}
                                    </h3>
                                    {hasUnseen && (
                                        <span className="w-5 h-5 flex items-center justify-center bg-indigo-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                                            {unseenMsgs[user._id]}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                                    {isOnline ? 'Active now' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default LeftSidebar
