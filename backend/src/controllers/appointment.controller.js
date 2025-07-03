// controllers/appointment.controller.js
const { Appointment } = require("../models");

module.exports = {
  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const appointments = await Appointment.findAll({
        where: { userId },
        order: [["dateTime", "ASC"]],
      });
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar agendamentos." });
    }
  },

  async create(req, res) {
    try {
      const userId = req.user.id;
      const { type, title, dateTime, description, location, priority } = req.body;

      const appointment = await Appointment.create({
        userId,
        type,
        title,
        dateTime,
        description,
        location,
        priority,
      });

      res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar agendamento." });
    }
  },

  async update(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { type, title, dateTime, description, location, priority } = req.body;

      const appointment = await Appointment.findOne({
        where: { id, userId },
      });

      if (!appointment) {
        return res.status(404).json({ message: "Agendamento não encontrado." });
      }

      await appointment.update({
        type,
        title,
        dateTime,
        description,
        location,
        priority,
      });

      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar agendamento." });
    }
  },

  async remove(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const appointment = await Appointment.findOne({
        where: { id, userId },
      });

      if (!appointment) {
        return res.status(404).json({ message: "Agendamento não encontrado." });
      }

      await appointment.destroy();
      res.json({ message: "Agendamento removido com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover agendamento." });
    }
  },
};
