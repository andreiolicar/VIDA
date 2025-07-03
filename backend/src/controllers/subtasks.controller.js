const subtaskService = require("../services/subtasks.service");

const createSubtask = async (req, res) => {
  try {
    const subtask = await subtaskService.createSubtask(req.body);
    res.status(201).json(subtask);
  } catch (error) {
    console.error("Erro ao criar subtarefa:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateSubtask = async (req, res) => {
  const { id } = req.params;

  try {
    const subtask = await subtaskService.updateSubtask(id, req.body);
    res.json({ message: "Subtarefa atualizada", subtask });
  } catch (error) {
    console.error("Erro ao atualizar subtarefa:", error.message);
    const status = error.message === "Subtarefa não encontrada." ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

const getSubtasksByTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const subtasks = await subtaskService.getSubtasksByTask(taskId);
    res.json(subtasks);
  } catch (error) {
    console.error("Erro ao buscar subtarefas:", error.message);
    res.status(500).json({ message: "Erro ao buscar subtarefas." });
  }
};

const deleteSubtask = async (req, res) => {
  const { id } = req.params;

  try {
    await subtaskService.deleteSubtask(id);
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar subtarefa:", error.message);
    const status = error.message === "Subtarefa não encontrada." ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  createSubtask,
  updateSubtask,
  getSubtasksByTask,
  deleteSubtask,
};
