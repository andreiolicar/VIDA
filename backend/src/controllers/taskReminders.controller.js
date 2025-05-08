const { TaskReminder } = require("../models");

const addReminder = async (req, res) => {
  const { taskId, remindAt, type, message } = req.body;

  if (!taskId || !remindAt) {
    return res.status(400).json({ message: "taskId e remindAt são obrigatórios." });
  }

  try {
    const reminder = await TaskReminder.create({
      taskId,
      remindAt,
      type: type ?? "push",
      message,
    });
    res.status(201).json(reminder);
  } catch (error) {
    console.error("Erro ao adicionar lembrete:", error);
    res.status(500).json({ message: "Erro ao adicionar lembrete." });
  }
};

const getRemindersByTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const reminders = await TaskReminder.findAll({ where: { taskId } });
    res.json(reminders);
  } catch (error) {
    console.error("Erro ao buscar lembretes:", error);
    res.status(500).json({ message: "Erro ao buscar lembretes." });
  }
};

const deleteReminder = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await TaskReminder.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Lembrete não encontrado." });
    res.json({ message: "Lembrete excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir lembrete:", error);
    res.status(500).json({ message: "Erro ao excluir lembrete." });
  }
};

module.exports = { addReminder, getRemindersByTask, deleteReminder };
