const { TaskReminder } = require("../models");

// Cria um lembrete para uma tarefa
const addReminder = async ({ taskId, remindAt, type, message }) => {
  if (!taskId || !remindAt) {
    throw new Error("taskId e remindAt são obrigatórios.");
  }

  const reminder = await TaskReminder.create({
    taskId,
    remindAt,
    type: type ?? "push",
    message,
  });

  return reminder;
};

// Busca todos os lembretes de uma tarefa
const getRemindersByTask = async (taskId) => {
  return TaskReminder.findAll({ where: { taskId } });
};

// Remove um lembrete pelo ID
const deleteReminder = async (id) => {
  const deleted = await TaskReminder.destroy({ where: { id } });
  if (!deleted) {
    throw new Error("Lembrete não encontrado.");
  }
};

module.exports = {
  addReminder,
  getRemindersByTask,
  deleteReminder,
};
