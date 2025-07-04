import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
    console.log("🔌 Conectando socket com token:", token ? "presente" : "ausente");

    socket = io("http://localhost:5000", {
        auth: {
            token,
        },
    });

    socket.on("connect", () => {
        console.log("✅ Conectado ao Socket.IO, socketId:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Erro na conexão Socket.IO:", err.message);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log("🔌 Desconectando socket:", socket.id);
        socket.disconnect();
        socket = null;
        console.log("✅ Socket desconectado");
    }
};

export const getSocket = () => socket;