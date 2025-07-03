const taskService = require("../services/tasks.service");

const createTask = async (req, res) => {
  const userId = req.params.userId;
  try {
    const task = await taskService.createTaskService(userId, req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(400).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await taskService.updateTaskService(id, req.body);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada." });
    res.json({ message: "Tarefa atualizada", task });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ message: "Erro ao atualizar tarefa." });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByUserService(req.params.userId);
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ message: "Erro ao buscar tarefas." });
  }
};

const getTasksByList = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByListService(req.params.listId);
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ message: "Erro ao buscar tarefas." });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskByIdService(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada." });
    res.json(task);
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    res.status(500).json({ message: "Erro ao buscar tarefa." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await taskService.deleteTaskService(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tarefa não encontrada." });
    res.json({ message: "Tarefa excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ message: "Erro ao excluir tarefa." });
  }
};

const getTasksKanbanByList = async (req, res) => {
  try {
    const kanban = await taskService.getTasksKanbanByListService(req.params.listId, req.query);
    res.json(kanban);
  } catch (error) {
    console.error("Erro ao buscar Kanban:", error);
    res.status(500).json({ message: "Erro ao buscar tarefas Kanban." });
  }
};

const getTasksCalendarByUser = async (req, res) => {
  const { userId } = req.params;
  const { start, end, status, priority } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: "Parâmetros 'start' e 'end' são obrigatórios." });
  }

  try {
    const events = await taskService.getTasksCalendarByUserService(userId, start, end, status, priority);
    res.json(events);
  } catch (error) {
    console.error("Erro ao buscar tarefas para calendário:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  getTasksByUser,
  getTasksByList,
  getTaskById,
  deleteTask,
  getTasksKanbanByList,
  getTasksCalendarByUser,
};
