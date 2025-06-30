const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { GroupMember } = require('./models'); // ajuste o caminho conforme seu projeto

let io;
const onlineUsers = new Map(); // userId → Set<socketId>

async function joinUserGroupsRooms(userId, socket) {
  try {
    const memberships = await GroupMember.findAll({ where: { userId } });
    memberships.forEach(({ groupId }) => {
      const roomName = `group:${groupId}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} entrou na sala ${roomName}`);
    });
  } catch (err) {
    console.error('Erro ao entrar nas salas dos grupos:', err);
  }
}

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

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`Usuário conectado: ${userId} (socketId: ${socket.id})`);

    // Adiciona socket ao mapa de usuários online
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Entrar nas salas dos grupos que o usuário participa
    await joinUserGroupsRooms(userId, socket);

    // Evento para enviar mensagem privada (existente)
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

    // Evento para enviar mensagem em grupo
    socket.on('group message', ({ groupId, content }) => {
      const roomName = `group:${groupId}`;
      // Emite para todos na sala, incluindo o remetente
      io.to(roomName).emit('group message', {
        groupId,
        senderUserId: userId,
        content,
        timestamp: new Date(),
      });
    });

    // Outros eventos de grupo podem ser adicionados aqui (ex: membro entrou, saiu, grupo atualizado)

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

// Função para adicionar todos os sockets de um usuário a uma room de grupo
async function addUserToGroupRoom(userId, groupId) {
  if (!io) {
    console.error('Socket.io não inicializado!');
    return;
  }

  const sockets = onlineUsers.get(userId);
  if (sockets) {
    sockets.forEach(socketId => {
      const socketInstance = io.sockets.sockets.get(socketId);
      if (socketInstance) {
        socketInstance.join(`group:${groupId}`);
        console.log(`Socket ${socketId} entrou na sala group:${groupId} via addUserToGroupRoom`);
      }
    });
  }
}

// Função para remover todos os sockets de um usuário de uma room de grupo
async function removeUserFromGroupRoom(userId, groupId) {
  if (!io) {
    console.error('Socket.io não inicializado!');
    return;
  }

  const sockets = onlineUsers.get(userId);
  if (sockets) {
    sockets.forEach(socketId => {
      const socketInstance = io.sockets.sockets.get(socketId);
      if (socketInstance) {
        socketInstance.leave(`group:${groupId}`);
        console.log(`Socket ${socketId} saiu da sala group:${groupId}`);
      }
    });
  }
}

module.exports = {
  init,
  getIO,
  getOnlineUsers,
  addUserToGroupRoom,
  removeUserFromGroupRoom,
};