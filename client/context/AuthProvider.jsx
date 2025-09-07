import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"
import AuthContext from "./AuthContext";


const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // check if user is authenticated and if yes, set user data and connect the socket

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check")
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }

        } catch (error) {
            toast.error(error.message);
            console.log("Error in auth", error);
        }
    }

    //Login function to handle user authen. and socket connection

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }
            else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
            console.log("error loggin in ", error);

        }
    }

    // logout function
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
        // to be chekced later (if socket-null)
        socket.disconnect();
    }


    // Update profile function

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user)
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
            console.log("Error updating profile", error);
        }
    }

    // Connect socket function to handle socket connection and online users updates

    const connectSocket = (userData) => {
        if (!userData || socket?.connected)
            return;

        const newSocket = io(backendURL, {
            query: {
                userId: userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })

    }

    useEffect(() => {

        if (token) {
            axios.defaults.headers.common["token"] = token;
        }

        checkAuth();
    }, [])



    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    };

    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>);
};
