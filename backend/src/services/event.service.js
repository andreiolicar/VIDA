const { Event } = require('../models');

async function createEvent(userId, data) {
  const { title, description, topics, datetime } = data;

  if (!title || !topics || !datetime) {
    throw new Error('Título, tópicos e data/hora são obrigatórios.');
  }

  return await Event.create({
    title,
    description,
    topics,
    datetime,
    userId,
  });
}

async function getAllEvents(userId) {
  return await Event.findAll({
    where: { userId },
    order: [['datetime', 'ASC']],
  });
}

async function getEventById(userId, id) {
  const event = await Event.findOne({ where: { id, userId } });
  if (!event) throw new Error('Evento não encontrado.');
  return event;
}

async function updateEvent(userId, id, data) {
  const event = await Event.findOne({ where: { id, userId } });
  if (!event) throw new Error('Evento não encontrado.');

  const { title, description, topics, datetime } = data;

  event.title = title ?? event.title;
  event.description = description ?? event.description;
  event.topics = topics ?? event.topics;
  event.datetime = datetime ?? event.datetime;

  await event.save();
  return event;
}

async function deleteEvent(userId, id) {
  const deleted = await Event.destroy({ where: { id, userId } });
  if (!deleted) throw new Error('Evento não encontrado.');
  return true;
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
