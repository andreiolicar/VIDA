const db = require("../models");
const { Subtask } = db;

const createSubtask = async (req, res) => {
  try {
    const { taskId, title, completed } = req.body;
    if (!taskId || !title) {
      return res.status(400).json({ message: "taskId e title são obrigatórios." });
    }
    const subtask = await Subtask.create({
      taskId,
      title,
      completed: completed ?? false,
    });
    return res.status(201).json(subtask);
  } catch (error) {
    console.error("Erro ao criar subtarefa:", error);
    return res.status(500).json({ message: "Erro ao criar subtarefa." });
  }
};

const updateSubtask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const subtask = await Subtask.findByPk(id);
    if (!subtask) return res.status(404).json({ message: "Subtarefa não encontrada." });

    await subtask.update(updates);
    return res.json({ message: "Subtarefa atualizada", subtask });
  } catch (error) {
    console.error("Erro ao atualizar subtarefa:", error);
    return res.status(500).json({ message: "Erro ao atualizar subtarefa." });
  }
};

const getSubtasksByTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const subtasks = await Subtask.findAll({
      where: { taskId },
      order: [["createdAt", "ASC"]],
    });
    return res.json(subtasks);
  } catch (error) {
    console.error("Erro ao buscar subtarefas:", error);
    return res.status(500).json({ message: "Erro ao buscar subtarefas." });
  }
};

const deleteSubtask = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Subtask.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Subtarefa não encontrada." });
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar subtarefa:", error);
    return res.status(500).json({ message: "Erro ao deletar subtarefa." });
  }
};

module.exports = {
  createSubtask,
  updateSubtask,
  getSubtasksByTask,
  deleteSubtask,
};
