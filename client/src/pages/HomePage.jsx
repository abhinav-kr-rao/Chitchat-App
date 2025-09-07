import React, { useContext } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import ChatComponent from '../components/ChatComponent'
import RIghtSidebar from '../components/RIghtSidebar'
import ChatContext from '../../context/ChatContext'


const HomePage = () => {

    const { selectedUser } = useContext(ChatContext);
    console.log("In homepage ", selectedUser);


    return (
        <div className=' border w-full h-screen sm:px-[15%] sm:py-[5%]'>
            <div className={`grid grid-cols-1 relative border-2 border-green-500 overflow-hidden rounded-2xl h-[100%]  
                ${selectedUser ? `md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]` : `md:grid-cols-2`}`}>

                <LeftSidebar />
                <ChatComponent />
                <RIghtSidebar />
            </div>
        </div>
    )
}

export default HomePage