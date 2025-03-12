/* eslint-disable react-refresh/only-export-components */

import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const { user } = useSelector((state) => state.user);

  const socket = useMemo(() => {
    if (!user) return null;

    const socketInstance = io(import.meta.env.VITE_API_URL, {
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      timeout: 10000,
      withCredentials: true,
    });

    return socketInstance;
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleConnect = () => {
      console.log("Socket connected");
      setConnectionStatus("connected");
      socket.emit("register", user._id);
    };

    const handleDisconnect = (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      setConnectionStatus("disconnected");
    };

    const handleOnlineUsers = (data) => {
      setOnlineUsers(data);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("onlineUsers", handleOnlineUsers);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("onlineUsers", handleOnlineUsers);

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user, socket]);

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        isUserOnline,
        connectionStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
