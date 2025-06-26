const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let io;
const onlineUsers = new Map(); // userId → Set<socketId>

function init(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware de autenticação Socket.IO via JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Autenticação necessária'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // armazena userId no socket
      next();
    } catch (err) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`Usuário conectado: ${userId} (socketId: ${socket.id})`);

    // Adiciona socket ao mapa de usuários online
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Evento para enviar mensagem via socket (opcional)
    socket.on('private message', ({ toUserId, content }) => {
      const receiverSockets = onlineUsers.get(toUserId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('private message', {
            fromUserId: userId,
            content,
            timestamp: new Date(),
          });
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Usuário desconectado: ${userId} (socketId: ${socket.id})`);
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io não inicializado!');
  return io;
}

function getOnlineUsers() {
  return onlineUsers;
}

module.exports = { init, getIO, getOnlineUsers };