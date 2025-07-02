const { Op } = require('sequelize');
const { PrivateMessage } = require('../models');

async function sendPrivateMessage({ senderUserId, receiverUserId, content }) {
  if (!receiverUserId || !content) {
    const error = new Error('receiverUserId and content are required');
    error.statusCode = 400;
    throw error;
  }

  const message = await PrivateMessage.create({ senderUserId, receiverUserId, content });
  return message;
}

async function getConversationBetweenUsers(userId1, userId2) {
  return PrivateMessage.findAll({
    where: {
      [Op.or]: [
        { senderUserId: userId1, receiverUserId: userId2 },
        { senderUserId: userId2, receiverUserId: userId1 },
      ],
    },
    order: [['timestamp', 'ASC']],
  });
}

async function markMessageAsRead(userId, messageId) {
  const message = await PrivateMessage.findOne({
    where: { id: messageId, receiverUserId: userId },
  });

  if (!message) {
    const error = new Error('Message not found');
    error.statusCode = 404;
    throw error;
  }

  message.read = true;
  await message.save();
}

async function getUnreadMessagesCount(userId) {
  return PrivateMessage.count({
    where: { receiverUserId: userId, read: false },
  });
}

module.exports = {
  sendPrivateMessage,
  getConversationBetweenUsers,
  markMessageAsRead,
  getUnreadMessagesCount,
};
