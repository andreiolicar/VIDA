const { ChatSession } = require('../models');
const { Sequelize } = require('sequelize');

async function listChats(userId) {
  return ChatSession.findAll({
    where: { userId },
    order: [['updatedAt', 'DESC']],
    limit: 6,
    attributes: [
      'id',
      'title',
      'updatedAt',
      [Sequelize.fn('JSON_LENGTH', Sequelize.col('messages')), 'messageCount']
    ],
  });
}

async function createChat(userId, data) {
  const { title, description, area, topics = [], messages = [] } = data;

  if (!title) throw new Error('Título é obrigatório');

  return ChatSession.create({
    userId,
    title,
    description,
    area,
    topics,
    messages,
  });
}

async function getChat(userId, id) {
  const chat = await ChatSession.findOne({ where: { id, userId } });
  if (!chat) throw new Error('Chat não encontrado');
  return chat;
}

async function updateChat(userId, id, data) {
  const chat = await ChatSession.findOne({ where: { id, userId } });
  if (!chat) throw new Error('Chat não encontrado');

  const { title, messages } = data;

  if (title !== undefined) chat.title = title;
  if (messages !== undefined) chat.messages = messages;

  await chat.save();
  return chat;
}

async function deleteChat(userId, id) {
  const deleted = await ChatSession.destroy({ where: { id, userId } });
  if (!deleted) throw new Error('Chat não encontrado');
  return true;
}

module.exports = {
  listChats,
  createChat,
  getChat,
  updateChat,
  deleteChat,
};
