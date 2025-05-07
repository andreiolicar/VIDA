const { TaskList, Task, TaskCollaborator, User } = require("../models");

const createTaskList = async (req, res) => {
  const { title, description, type, favorite, userId } = req.body;

  if (!title || !type || !userId) {
    return res.status(400).json({ message: "Título, tipo e usuário são obrigatórios." });
  }

  try {
    const taskList = await TaskList.create({
      title,
      description,
      type,
      favorite: favorite ?? false,
      userId,
    });
    res.status(201).json(taskList);
  } catch (error) {
    console.error("Erro ao criar lista de tarefas:", error);
    res.status(500).json({ message: "Erro ao criar lista de tarefas." });
  }
};

const getAllTaskLists = async (req, res) => {
  const userId = req.params.userId;

  try {
    const lists = await TaskList.findAll({
      where: { userId },
      include: [
        { model: Task, as: "tasks" },
        { model: TaskCollaborator, as: "collaborators" },
      ],
    });
    res.json(lists);
  } catch (error) {
    console.error("Erro ao buscar listas:", error);
    res.status(500).json({ message: "Erro ao buscar listas de tarefas." });
  }
};

const getTaskListById = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await TaskList.findByPk(id, {
      include: [
        { model: Task, as: "tasks" },
        { model: TaskCollaborator, as: "collaborators" },
      ],
    });
    if (!list) return res.status(404).json({ message: "Lista não encontrada." });
    res.json(list);
  } catch (error) {
    console.error("Erro ao buscar lista:", error);
    res.status(500).json({ message: "Erro ao buscar lista de tarefas." });
  }
};

const updateTaskList = async (req, res) => {
  const { id } = req.params;
  const { title, description, type, favorite } = req.body;

  try {
    const list = await TaskList.findByPk(id);
    if (!list) return res.status(404).json({ message: "Lista não encontrada." });

    list.title = title ?? list.title;
    list.description = description ?? list.description;
    list.type = type ?? list.type;
    if (typeof favorite === "boolean") list.favorite = favorite;

    await list.save();
    res.json({ message: "Lista atualizada", list });
  } catch (error) {
    console.error("Erro ao atualizar lista:", error);
    res.status(500).json({ message: "Erro ao atualizar lista de tarefas." });
  }
};

const deleteTaskList = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.destroy({ where: { listId: id } }); // Remove tarefas da lista
    await TaskCollaborator.destroy({ where: { listId: id } }); // Remove colaboradores
    const deleted = await TaskList.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Lista não encontrada." });

    res.json({ message: "Lista excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir lista:", error);
    res.status(500).json({ message: "Erro ao excluir lista de tarefas." });
  }
};

module.exports = {
  createTaskList,
  getAllTaskLists,
  getTaskListById,
  updateTaskList,
  deleteTaskList,
};
