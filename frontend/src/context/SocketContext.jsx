import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () =>{
    return useContext(SocketContext);
}

export const SocketContextProvider = ({children}) =>{
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        if (user?._id) {
          const socket = io("http://localhost:5000", {
            query: {
              userId: user._id, // Pass user ID from the authenticated user
            },
          });
      
          setSocket(socket);
      
          // Get online users from the server
          socket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users); // Update state with the list of online users
            console.log("Online users:", users); // Debug log
          });
      
          return () => {
            socket.disconnect(); // Clean up when component unmounts
          };
        }
      }, [user?._id]);
      
    console.log("online users",onlineUsers)
    return <SocketContext.Provider value={{socket,onlineUsers}}>{children}</SocketContext.Provider>;

};