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
            <div className={`grid grid-cols-1 gap-4 w-full h-full md:h-[90vh] 
                ${selectedUser ? `md:grid-cols-[240px_1fr_240px] lg:grid-cols-[280px_1fr_280px]` : `md:grid-cols-[320px_1fr]`}`}>

                <div className="h-full rounded-3xl overflow-hidden shadow-xl border border-slate-700 bg-slate-800">
                    <LeftSidebar />
                </div>

                <div className="h-full rounded-3xl overflow-hidden shadow-xl border border-slate-700 bg-slate-800">
                    <ChatComponent />
                </div>

                {selectedUser && (
                    <div className='hidden md:block h-full rounded-3xl overflow-hidden shadow-xl border border-slate-700 bg-slate-800'>
                        <RIghtSidebar />
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage