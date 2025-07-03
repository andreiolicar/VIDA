import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";

export function useSocket(token) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Limpar conexão anterior antes de criar nova
    if (socket) {
      disconnectSocket();
      setSocket(null);
    }

    if (!token) {
      // Se não há token, garantir desconexão
      disconnectSocket();
      setSocket(null);
      return;
    }

    // Pequeno delay para garantir limpeza
    const timeoutId = setTimeout(() => {
      const socketConnection = connectSocket(token);
      setSocket(socketConnection);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      disconnectSocket();
      setSocket(null);
    };
  }, [token]);

  return socket;
}