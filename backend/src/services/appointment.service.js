const { Appointment } = require('../models');

async function createAppointment({ type, title, dateTime, description, location, priority, userId }) {
  if (!['consulta', 'exame'].includes(type)) {
    throw new Error('Tipo inválido');
  }

  const appointment = await Appointment.create({
    type,
    title,
    dateTime,
    description,
    location,
    priority,
    userId,
  });

  return appointment;
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
    throw new Error('Agendamento não encontrado');
  }
  await appointment.update(data);
  return appointment;
}

async function deleteAppointment(id, userId) {
  const appointment = await Appointment.findOne({ where: { id, userId } });
  if (!appointment) {
    throw new Error('Agendamento não encontrado');
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
