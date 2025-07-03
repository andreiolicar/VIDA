const { Appointment } = require('../models');

async function createAppointment({ type, title, dateTime, description, location, priority, userId }) {
  if (!['consulta', 'exame'].includes(type)) {
    const error = new Error('Tipo inválido');
    error.statusCode = 400;
    throw error;
  }

  return Appointment.create({
    type,
    title,
    dateTime,
    description,
    location,
    priority,
    userId,
  });
}

async function getAppointmentsByUser(userId) {
  return Appointment.findAll({
    where: { userId },
    order: [['dateTime', 'ASC']],
  });
}

async function updateAppointment(id, userId, data) {
  const appointment = await Appointment.findOne({ where: { id, userId } });
  if (!appointment) {
    const error = new Error('Agendamento não encontrado');
    error.statusCode = 404;
    throw error;
  }

  await appointment.update(data);
  return appointment;
}

async function deleteAppointment(id, userId) {
  const appointment = await Appointment.findOne({ where: { id, userId } });
  if (!appointment) {
    const error = new Error('Agendamento não encontrado');
    error.statusCode = 404;
    throw error;
  }

  await appointment.destroy();
  return true;
}

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  updateAppointment,
  deleteAppointment,
};
