const { Subtask } = require("../models");

// Cria uma nova subtarefa
const createSubtask = async ({ taskId, title, completed }) => {
  if (!taskId || !title) {
    throw new Error("taskId e title são obrigatórios.");
  }

  const subtask = await Subtask.create({
    taskId,
    title,
    completed: completed ?? false,
  });

  return subtask;
};

// Atualiza uma subtarefa existente
const updateSubtask = async (id, updates) => {
  const subtask = await Subtask.findByPk(id);
  if (!subtask) {
    throw new Error("Subtarefa não encontrada.");
  }

  await subtask.update(updates);
  return subtask;
};

// Busca todas as subtarefas de uma task
const getSubtasksByTask = async (taskId) => {
  return Subtask.findAll({
    where: { taskId },
    order: [["createdAt", "ASC"]],
  });
};

// Deleta uma subtarefa
const deleteSubtask = async (id) => {
  const deleted = await Subtask.destroy({ where: { id } });
  if (!deleted) {
    throw new Error("Subtarefa não encontrada.");
  }
};

module.exports = {
  createSubtask,
  updateSubtask,
  getSubtasksByTask,
  deleteSubtask,
};
