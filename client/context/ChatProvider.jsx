import { useState, useEffect } from 'react';
import ChatContext from './ChatContext'
import toast from 'react-hot-toast';
import { useAuth } from './useAuth.js';


const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMsgs, setUnseenMsgs] = useState({});

    const { socket, axios } = useAuth();

    // function to get all users for left sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMsgs(data.unseenMsgs);
            }
        }
        catch (err) {
            toast.error(err.message);
            console.log("Error getting users ", err);

        }
    }

    // function to get messages for the selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
            console.log("Error getting messages", error);
        }
    }

    // function to send message to user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMsg) => [...prevMsg, data.newMessage]);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log("Error sending messages", error);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        try {
            if (!socket)
                return;
            socket.on("newMessage", (newMsg) => {
                if (selectedUser && newMsg.senderId === selectedUser._id) {
                    newMsg.seen = true;
                    setMessages((prevMsg) => [...prevMsg, newMsg]);
                    axios.put(`/api/messages/mark/${newMsg._id}`);
                }
                else {
                    // if msg for other user arrives then update the msgCount for that user by 1
                    setUnseenMsgs((prevUnseenMsgs) => ({
                        ...prevUnseenMsgs, [newMsg.senderId]: prevUnseenMsgs[newMsg.senderId] ? prevUnseenMsgs[newMsg.senderId] + 1 : 1
                    }))
                }
            })
        } catch (error) {
            console.log("error ", error);
            return;
        }
    }


    // function to unsubscribe from messages
    const unsubscribeFromMsgs = () => {
        if (socket)
            socket.off("newMessage");
    }

    useEffect(() => {

        subscribeToMessages();

        return () => unsubscribeFromMsgs();
    }, [socket, selectedUser]);



    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMsgs, setUnseenMsgs
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider