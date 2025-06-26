const { Op } = require('sequelize');
const { PrivateMessage } = require('../models');
const { getIO, getOnlineUsers } = require('../socket');

class MessagesController {
  // Enviar nova mensagem
  async sendMessage(req, res) {
    const senderUserId = req.user.id;
    const { receiverUserId, content } = req.body;

    if (!receiverUserId || !content) {
      return res.status(400).json({ error: 'receiverUserId and content are required' });
    }

    try {
      const message = await PrivateMessage.create({ senderUserId, receiverUserId, content });

      // Emitir evento para receptor se estiver online
      const io = getIO();
      const onlineUsers = getOnlineUsers();

      const receiverSockets = onlineUsers.get(receiverUserId);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('private message', {
            id: message.id,
            content: message.content,
            fromUserId: senderUserId,
            toUserId: receiverUserId,
            timestamp: message.timestamp,
            read: message.read,
          });
        });
      }

      return res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ error: 'Error sending message' });
    }
  }

  // Obter histórico da conversa com outro usuário
  async getConversation(req, res) {
    const userId = req.user.id;
    const otherUserId = parseInt(req.params.userId, 10);

    if (!otherUserId) {
      return res.status(400).json({ error: 'UserId parameter is required' });
    }

    try {
      const messages = await PrivateMessage.findAll({
        where: {
          [Op.or]: [
            { senderUserId: userId, receiverUserId: otherUserId },
            { senderUserId: otherUserId, receiverUserId: userId },
          ],
        },
        order: [['timestamp', 'ASC']],
      });
      return res.json(messages);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return res.status(500).json({ error: 'Error fetching conversation' });
    }
  }

  // Marcar mensagem como lida
  async markAsRead(req, res) {
    const userId = req.user.id;
    const messageId = parseInt(req.params.messageId, 10);

    if (!messageId) {
      return res.status(400).json({ error: 'MessageId parameter is required' });
    }

    try {
      const message = await PrivateMessage.findOne({ where: { id: messageId, receiverUserId: userId } });
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      message.read = true;
      await message.save();
      return res.json({ message: 'Message marked as read' });
    } catch (error) {
      console.error('Error marking message as read:', error);
      return res.status(500).json({ error: 'Error marking message as read' });
    }
  }

  // Obter contagem de mensagens não lidas
  async getUnreadCount(req, res) {
    const userId = req.user.id;

    try {
      const count = await PrivateMessage.count({ where: { receiverUserId: userId, read: false } });
      return res.json({ count });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return res.status(500).json({ error: 'Error getting unread count' });
    }
  }
}

module.exports = new MessagesController();