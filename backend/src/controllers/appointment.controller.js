const appointmentService = require('../services/appointment.service');

module.exports = {
  async create(req, res) {
    try {
      const { title, description, datetime, type } = req.body;
      const { userId } = req.params;

      const appointment = await appointmentService.createAppointment({
        title,
        description,
        datetime,
        type,
        userId,
      });

      return res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message || 'Erro ao criar agendamento' });
    }
  },

  async index(req, res) {
    try {
      const { userId } = req.params;
      const appointments = await appointmentService.getAppointmentsByUser(userId);
      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await appointmentService.deleteAppointment(id);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: error.message || 'Erro ao excluir agendamento' });
    }
  },
};
