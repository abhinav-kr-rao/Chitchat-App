import React, { useContext } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import ChatComponent from '../components/ChatComponent'
import RIghtSidebar from '../components/RIghtSidebar'
import ChatContext from '../../context/ChatContext'


const HomePage = () => {

    const { selectedUser } = useContext(ChatContext);
    console.log("In homepage ", selectedUser);


    return (
        <div className='w-full h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 md:p-8'>
            <div className={`grid grid-cols-1 w-full max-w-[1600px] h-full md:h-[90vh] bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700
                ${selectedUser ? `md:grid-cols-[280px_1fr_280px] lg:grid-cols-[320px_1fr_320px]` : `md:grid-cols-[320px_1fr]`}`}>

                <LeftSidebar />
                <ChatComponent />
                {selectedUser && <div className='hidden md:block border-l border-slate-700 bg-slate-900/50'> <RIghtSidebar /> </div>}
            </div>
        </div>
    )
}

export default HomePage