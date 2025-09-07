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
        <div className=' h-full overflow-scroll relative backdrop-blur-lg'>
            <div id='user-info' className=" flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
                <img src={selectedUser.profilePic || `userLogo.png`} alt='pic' className=' w-8 rounded-full' />
                <p className=' flex-1 text-lg text-white items-center gap-2'>
                    {selectedUser.fullName}
                    {onlineUsers.includes(selectedUser._id) && <span className=' w-2 h-2 rounded-full bg-green-500'>
                    </span>}
                </p>
                <img onClick={() => setSelectedUser(null)} src="null" alt="arrow"
                    className=' md:hidden max-w-7' />

                <img src='null' alt='help'
                    className=' max-md:hidden max-w-5' />
            </div>
            <div id='chat-area' className=" flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && `flex-row-reverse`}`}>
                        {msg.image ? (<img src={msg.image} alt=''
                            className=' max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all
                            bg-violet-600 text-white ${msg.senderId === authUser._id ? ` rounded-br-none` : ` rounded-bl-none`}`}>
                                {msg.text}
                            </p>
                        )}
                        <div className=" text-center text-xs">
                            <img src={msg.senderId === authUser._id ? authUser?.profilePic || `/userLogo.png` : selectedUser?.profilePic || `/userLogo.png`} alt="avatar" className=' w-7 rounded-full' />
                            <p className=' text-gray-500'>
                                {formatMsgTime(msg.createdAt)}
                            </p>
                        </div>

                    </div>
                ))}
                <div ref={scrollEnd} className="">
                </div>

                {/* This is message typing area */}
                <div id='typing-area' className=" absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
                    <div className=" flex-1 flex items-center bg-gray-100 px-3 rounded-full">

                        <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null} type="text" placeholder='Send a message' className=' flex-1 text-sm  p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />
                        <input onChange={handleSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
                        <label htmlFor="image">
                            <img src="gallery_icon.svg" alt="icon" className=' w-5 mr-2 cursor-pointer' />
                        </label>
                    </div>
                    <img onClick={handleSendMessage} src="/sendButton.png" alt="Send" className='w-7 cursor-pointer' />
                </div>
            </div>
        </div>
    ) : (
        <div className=" bg-purple-500">
            <img src="null" alt="" className=' max-w-16' />
            <p className=' text-lg font-medium text-white'>
                Chat with your friends
            </p>
        </div>
    )
}

export default ChatComponent