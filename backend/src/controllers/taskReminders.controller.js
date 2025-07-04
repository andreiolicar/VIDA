const taskReminderService = require("../services/taskReminder.service");

// Cria lembrete
const addReminder = async (req, res) => {
  try {
    const reminder = await taskReminderService.addReminder(req.body);
    res.status(201).json(reminder);
  } catch (error) {
    console.error("Erro ao adicionar lembrete:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Lista lembretes por tarefa
const getRemindersByTask = async (req, res) => {
  try {
    const reminders = await taskReminderService.getRemindersByTask(req.params.taskId);
    res.json(reminders);
  } catch (error) {
    console.error("Erro ao buscar lembretes:", error.message);
    res.status(500).json({ message: "Erro ao buscar lembretes." });
  }
};

// Exclui lembrete
const deleteReminder = async (req, res) => {
  try {
    await taskReminderService.deleteReminder(req.params.id);
    res.json({ message: "Lembrete excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir lembrete:", error.message);
    const status = error.message === "Lembrete não encontrado." ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  addReminder,
  getRemindersByTask,
  deleteReminder,
};
