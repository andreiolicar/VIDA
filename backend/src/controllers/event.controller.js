const { Event } = require("../models");

module.exports = {
  createEvent: async (req, res) => {
    const { title, description, topics, datetime } = req.body;
    const userId = req.params.userId;

    if (!title || !topics || !datetime) {
      return res
        .status(400)
        .json({ message: "Título, tópicos e data/hora são obrigatórios." });
    }

    try {
      const event = await Event.create({
        title,
        description,
        topics,
        datetime,
        userId,
      });
      res.status(201).json(event);
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      res.status(500).json({ message: "Erro ao criar evento." });
    }
  },

  getAllEvents: async (req, res) => {
    const userId = req.params.userId;
    try {
      const events = await Event.findAll({
        where: { userId },
        order: [["datetime", "ASC"]],
      });
      res.json(events);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
      res.status(500).json({ message: "Erro ao buscar eventos." });
    }
  },

  getEventById: async (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
      const event = await Event.findOne({ where: { id, userId } });
      if (!event)
        return res.status(404).json({ message: "Evento não encontrado." });
      res.json(event);
    } catch (err) {
      console.error("Erro ao buscar evento:", err);
      res.status(500).json({ message: "Erro ao buscar evento." });
    }
  },

  updateEvent: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, topics, datetime } = req.body;

    try {
      const event = await Event.findOne({ where: { id, userId } });
      if (!event)
        return res.status(404).json({ message: "Evento não encontrado." });

      event.title = title ?? event.title;
      event.description = description ?? event.description;
      event.topics = topics ?? event.topics;
      event.datetime = datetime ?? event.datetime;

      await event.save();
      res.json(event);
    } catch (err) {
      console.error("Erro ao atualizar evento:", err);
      res.status(500).json({ message: "Erro ao atualizar evento." });
    }
  },

  deleteEvent: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
      const deleted = await Event.destroy({ where: { id, userId } });
      if (!deleted)
        return res.status(404).json({ message: "Evento não encontrado." });
      res.json({ message: "Evento excluído com sucesso." });
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
      res.status(500).json({ message: "Erro ao excluir evento." });
    }
  },
};
