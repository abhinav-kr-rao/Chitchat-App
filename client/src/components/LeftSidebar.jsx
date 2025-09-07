import { useNavigate } from 'react-router-dom'
import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../../context/AuthContext.jsx';
import ChatContext from '../../context/ChatContext.jsx';


const LeftSidebar = () => {



    const { getUsers, users, selectedUser, setSelectedUser, unseenMsgs, setUnseenMsgs } = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState(false);


    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    if (filteredUsers) {
        console.log("Got users", filteredUsers);
    }
    else {
        console.log("Error get users");

    }
    if (selectedUser) {
        console.log("Current user", selectedUser);

    }
    else {
        console.log("Not getting selected user");

    }

    console.log("Unseen msgs", unseenMsgs);


    useEffect(() => {
        getUsers();

    }, [onlineUsers])


    const navigate = useNavigate();
    return (
        <div className={` bg-violet-700 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? `max-md:hidden` : ""}`}>
            <div className=" pb-5">
                <div className=" flex justify-between items-center">
                    <img src="/appIcon.png" alt='logo' className=' max-w-40 w-20 h-auto rounded-2xl' />
                    <div className=" relative py-2 group">
                        <img src='/userLogo.png' alt='menu' className=' max-h-5 cursor-pointer' />
                        <div className=" absolute top-full right-0 z-20 w-32 p-5 rounded-md  border border-yellow-400 text-blue-600 hidden group-hover:block">
                            <p onClick={() => navigate('/profile')} className=' text-sm cursor-pointer'>
                                Edit Profile
                            </p>
                            <hr className=' my-2 border-t border-black' />
                            <p onClick={() => logout()} className=' cursor-pointer text-sm'>
                                Logout
                            </p>
                        </div>
                    </div>
                </div>

                <div id='search-bar' className=" mt-5 bg-gray-500 rounded-full flex items-center gap-2 py-3 px-4">
                    <img src="/searchIcon.jpg" alt="Search" className='w-5 m-1 h-auto rounded-4xl' />
                    <input onChange={(e) => setInput(e.target.value)} type="text" name="" id="input"
                        className=' bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
                        placeholder='Search User...' />
                </div>
            </div>
            <div id=' user-list' className=" flex flex-col">
                {filteredUsers.map((user, idx) => {
                    return (<div onClick={() => {

                        setSelectedUser(user); setUnseenMsgs((prev) => ({ ...prev, [user._id]: 0 }))
                    }

                    } key={idx} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
                     ${selectedUser?._id === user._id && ` bg-amber-600`}`}>
                        <img src={user?.profilePic || `/userLogo.png`} alt="pic"
                            className=' w-[35px] h-auto aspect-[1/1] rounded-full' />
                        <div id='user-name' className=" flex flex-col leading-5">
                            <p>
                                {user.fullName}
                            </p>
                            {
                                onlineUsers.includes(user._id) ?
                                    <span className=' text-green-400 text-xs'>
                                        Online
                                    </span> :
                                    <span className=' text-neutral-400 text-xs'>
                                        Offline
                                    </span>
                            }
                        </div>
                        {unseenMsgs[user._id] > 0 &&
                            <p className=' absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500'>
                                {unseenMsgs[user._id]}
                            </p>}
                    </div>)
                })}
            </div>
        </div >
    )
}

export default LeftSidebar