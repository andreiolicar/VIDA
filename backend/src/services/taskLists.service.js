const { TaskList, Task, TaskCollaborator } = require("../models");

// Criação da lista de tarefas
const createTaskList = async ({ title, description, type, favorite, userId }) => {
  if (!title || !type || !userId) {
    throw new Error("Título, tipo e usuário são obrigatórios.");
  }

  const taskList = await TaskList.create({
    title,
    description,
    type,
    favorite: favorite ?? false,
    userId,
  });

  return taskList;
};

// Busca todas as listas de um usuário
const getAllTaskLists = async (userId) => {
  return TaskList.findAll({
    where: { userId },
    include: [
      { model: Task, as: "tasks" },
      { model: TaskCollaborator, as: "collaborators" },
    ],
  });
};

// Busca uma lista por ID
const getTaskListById = async (id) => {
  const list = await TaskList.findByPk(id, {
    include: [
      { model: Task, as: "tasks" },
      { model: TaskCollaborator, as: "collaborators" },
    ],
  });

  if (!list) throw new Error("Lista não encontrada.");
  return list;
};

// Atualiza uma lista
const updateTaskList = async (id, data) => {
  const list = await TaskList.findByPk(id);
  if (!list) throw new Error("Lista não encontrada.");

  list.title = data.title ?? list.title;
  list.description = data.description ?? list.description;
  list.type = data.type ?? list.type;
  if (typeof data.favorite === "boolean") {
    list.favorite = data.favorite;
  }

  await list.save();
  return list;
};

// Exclui uma lista e dependências
const deleteTaskList = async (id) => {
  await Task.destroy({ where: { listId: id } });
  await TaskCollaborator.destroy({ where: { listId: id } });

  const deleted = await TaskList.destroy({ where: { id } });
  if (!deleted) throw new Error("Lista não encontrada.");
};

module.exports = {
  createTaskList,
  getAllTaskLists,
  getTaskListById,
  updateTaskList,
  deleteTaskList,
};
