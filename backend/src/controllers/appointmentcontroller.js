const { Appointment } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const { title, description, datetime, type } = req.body;
      const userId = req.params.userId;

      if (!['consulta', 'exame'].includes(type)) {
        return res.status(400).json({ error: 'Tipo inválido' });
      }

      const appointment = await Appointment.create({
        title,
        description,
        datetime,
        type,
        userId,
      });

      return res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  },

  async getAll(req, res) {
    try {
      const userId = req.params.userId;
      const appointments = await Appointment.findAll({
        where: { userId },
        order: [['datetime', 'ASC']],
      });
      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
      await appointment.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir agendamento' });
    }
  },
};
