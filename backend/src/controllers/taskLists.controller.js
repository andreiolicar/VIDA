const taskListService = require("../services/taskLists.service");

const createTaskList = async (req, res) => {
  try {
    const list = await taskListService.createTaskList(req.body);
    res.status(201).json(list);
  } catch (error) {
    console.error("Erro ao criar lista de tarefas:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const getAllTaskLists = async (req, res) => {
  try {
    const lists = await taskListService.getAllTaskLists(req.params.userId);
    res.json(lists);
  } catch (error) {
    console.error("Erro ao buscar listas:", error.message);
    res.status(500).json({ message: "Erro ao buscar listas de tarefas." });
  }
};

const getTaskListById = async (req, res) => {
  try {
    const list = await taskListService.getTaskListById(req.params.id);
    res.json(list);
  } catch (error) {
    console.error("Erro ao buscar lista:", error.message);
    const status = error.message === "Lista não encontrada." ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

const updateTaskList = async (req, res) => {
  try {
    const list = await taskListService.updateTaskList(req.params.id, req.body);
    res.json({ message: "Lista atualizada", list });
  } catch (error) {
    console.error("Erro ao atualizar lista:", error.message);
    const status = error.message === "Lista não encontrada." ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

const deleteTaskList = async (req, res) => {
  try {
    await taskListService.deleteTaskList(req.params.id);
    res.json({ message: "Lista excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir lista:", error.message);
    const status = error.message === "Lista não encontrada." ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  createTaskList,
  getAllTaskLists,
  getTaskListById,
  updateTaskList,
  deleteTaskList,
};
