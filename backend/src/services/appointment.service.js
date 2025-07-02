const { Appointment } = require('../models');

async function createAppointment({ title, description, datetime, type, userId }) {
  if (!['consulta', 'exame'].includes(type)) {
    throw new Error('Tipo inválido');
  }

  const appointment = await Appointment.create({
    title,
    description,
    datetime,
    type,
    userId,
  });

  return appointment;
}

async function getAppointmentsByUser(userId) {
  return Appointment.findAll({
    where: { userId },
    order: [['datetime', 'ASC']],
  });
}

async function deleteAppointment(id) {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    throw new Error('Agendamento não encontrado');
  }
  await appointment.destroy();
}

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  deleteAppointment,
};
