import React, { useEffect, useState, useRef } from 'react'
import { formatMsgTime } from '../lib/utils';
import { useContext } from 'react';
import ChatContext from '../../context/ChatContext';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';


const ChatComponent = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);

    const { authUser, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState('');

    const scrollEnd = useRef();

    // function to send message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '')
            return null;
        await sendMessage({ text: input.trim() });
        setInput("");
    }

    // Sending image function
    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Select an image file");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessage({ image: reader.result });
            e.target.value = "";
        }

        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behaviour: 'smooth' })
        }
    }, [messages])

    return selectedUser ? (
        <div className='h-full flex flex-col relative bg-slate-900/50 backdrop-blur-sm'>
            {/* Chat Header */}
            <div id='user-info' className="flex items-center gap-4 px-6 py-4 border-b border-slate-700/50 bg-slate-900/80 sticky top-0 z-10 backdrop-blur-md">
                <div className="relative">
                    <img
                        src={selectedUser.profilePic || `userLogo.png`}
                        alt='pic'
                        className='w-10 h-10 rounded-full object-cover border border-slate-600'
                    />
                    {onlineUsers.includes(selectedUser._id) && (
                        <span className='absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 bg-green-500'></span>
                    )}
                </div>
                <div className="flex-1">
                    <h2 className='text-white font-semibold flex items-center gap-2'>
                        {selectedUser.fullName}
                    </h2>
                    <p className='text-xs text-slate-400 font-medium'>
                        {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setSelectedUser(null)} className='md:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors'>
                        <span className="sr-only">Back</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button className='max-md:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages Area - Flex 1 to take available space */}
            <div id='chat-area' className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.map((msg, index) => {
                    const isMyMessage = msg.senderId === authUser._id;
                    return (
                        <div key={index} className={`flex items-end gap-3 ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                            <img
                                src={isMyMessage ? authUser?.profilePic || `/userLogo.png` : selectedUser?.profilePic || `/userLogo.png`}
                                alt="avatar"
                                className='w-8 h-8 rounded-full border border-slate-700 object-cover mb-1'
                            />

                            <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[70%]`}>
                                {msg.image ? (
                                    <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-lg mb-1">
                                        <img src={msg.image} alt='shared' className='max-w-full sm:max-w-xs object-cover' />
                                    </div>
                                ) : (
                                    <div className={`
                                        p-3 sm:px-4 sm:py-3 rounded-2xl shadow-sm text-sm sm:text-base break-words
                                        ${isMyMessage
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-slate-700 text-slate-100 rounded-bl-none'}
                                    `}>
                                        <p>{msg.text}</p>
                                    </div>
                                )}
                                <span className={`text-[10px] sm:text-xs font-medium mt-1 px-1 ${isMyMessage ? 'text-indigo-300' : 'text-slate-500'}`}>
                                    {formatMsgTime(msg.createdAt)}
                                </span>
                            </div>
                        </div>
                    )
                })}
                <div ref={scrollEnd} className=""></div>
            </div>

            {/* Message Input Area - Relative/Sticky at bottom naturally */}
            <div id='typing-area' className="p-4 bg-slate-900/50 backdrop-blur-md border-t border-slate-700/50">
                <div className="w-full flex items-center gap-2 bg-slate-800 p-2 rounded-full border border-slate-700 shadow-xl shadow-black/20">
                    <div className="flex-1 flex items-center gap-2 pl-3">
                        <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
                        <label htmlFor="image" className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </label>

                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null}
                            type="text"
                            placeholder='Type a message...'
                            className='flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 border-none outline-none'
                        />
                        <button
                            onClick={handleSendMessage}
                            className={`p-3 rounded-full transition-all duration-200 ${input.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    ) : (
        <div className="h-full flex flex-col items-center justify-center bg-slate-900/50 text-center p-8 space-y-6">
            <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center shadow-2xl skew-y-3">
                <span className="text-5xl">💬</span>
            </div>
            <div className="space-y-2">
                <h2 className='text-3xl font-bold text-white'>Welcome to ChitChat</h2>
                <p className='text-slate-400 max-w-sm mx-auto leading-relaxed'>
                    Select a conversation from the sidebar to start messaging.
                    <br />Connect with your friends instantly.
                </p>
            </div>
        </div>
    )
}

export default ChatComponent
