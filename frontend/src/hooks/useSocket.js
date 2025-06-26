import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";

export function useSocket(token) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    const socketConnection = connectSocket(token);
    setSocket(socketConnection);

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [token]);

  return socket;
}