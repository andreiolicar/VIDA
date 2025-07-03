const service = require('../services/appointment.service');

module.exports = {
  async getAll(req, res) {
    try {
      const appointments = await service.getAppointmentsByUser(req.user.id);
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
    }
  },

  async create(req, res) {
    try {
      const appointment = await service.createAppointment({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await service.updateAppointment(req.params.id, req.user.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  async remove(req, res) {
    try {
      await service.deleteAppointment(req.params.id, req.user.id);
      res.json({ message: 'Agendamento removido com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },
};
