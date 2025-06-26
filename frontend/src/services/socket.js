import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
    socket = io("http://localhost:5000", {
        auth: {
            token,
        },
    });

    socket.on("connect", () => {
        console.log("Conectado ao Socket.IO, socketId:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("Erro na conexão Socket.IO:", err.message);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;