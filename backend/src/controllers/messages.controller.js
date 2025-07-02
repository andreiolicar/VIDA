const messageService = require('../services/messages.service');
const { getIO, getOnlineUsers } = require('../socket');

class MessagesController {
  async sendMessage(req, res) {
    try {
      const senderUserId = req.user.id;
      const { receiverUserId, content } = req.body;

      const message = await messageService.sendPrivateMessage({
        senderUserId,
        receiverUserId,
        content,
      });

      // Emitir via socket se o receptor estiver online
      const io = getIO();
      const onlineUsers = getOnlineUsers();
      const receiverSockets = onlineUsers.get(receiverUserId);

      if (receiverSockets) {
        receiverSockets.forEach((socketId) => {
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
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getConversation(req, res) {
    try {
      const userId = req.user.id;
      const otherUserId = parseInt(req.params.userId, 10);

      if (!otherUserId) {
        return res.status(400).json({ error: 'UserId parameter is required' });
      }

      const messages = await messageService.getConversationBetweenUsers(userId, otherUserId);
      return res.json(messages);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return res.status(500).json({ error: 'Error fetching conversation' });
    }
  }

  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const messageId = parseInt(req.params.messageId, 10);

      if (!messageId) {
        return res.status(400).json({ error: 'MessageId parameter is required' });
      }

      await messageService.markMessageAsRead(userId, messageId);
      return res.json({ message: 'Message marked as read' });
    } catch (error) {
      console.error('Error marking message as read:', error);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await messageService.getUnreadMessagesCount(userId);
      return res.json({ count });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return res.status(500).json({ error: 'Error getting unread count' });
    }
  }
}

module.exports = new MessagesController();
