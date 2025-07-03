const eventService = require('../services/event.service');

module.exports = {
  async createEvent(req, res) {
    try {
      const userId = req.user.id;
      const event = await eventService.createEvent(userId, req.body);
      res.status(201).json(event);
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      res.status(400).json({ message: err.message });
    }
  },

  async getAllEvents(req, res) {
    try {
      const userId = req.user.id;
      const events = await eventService.getAllEvents(userId);
      res.json(events);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      res.status(500).json({ message: 'Erro ao buscar eventos.' });
    }
  },

  async getEventById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const event = await eventService.getEventById(userId, id);
      res.json(event);
    } catch (err) {
      console.error('Erro ao buscar evento:', err);
      res.status(404).json({ message: err.message });
    }
  },

  async updateEvent(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updatedEvent = await eventService.updateEvent(userId, id, req.body);
      res.json(updatedEvent);
    } catch (err) {
      console.error('Erro ao atualizar evento:', err);
      res.status(404).json({ message: err.message });
    }
  },

  async deleteEvent(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await eventService.deleteEvent(userId, id);
      res.json({ message: 'Evento excluído com sucesso.' });
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      res.status(404).json({ message: err.message });
    }
  },
};
