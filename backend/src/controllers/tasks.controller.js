const db = require("../models");
const Op = db.Sequelize.Op;
const { Task, TaskAttachment, TaskReminder, TaskList } = db;

const { suggestPriority } = require("../gemini");
const { buildUserPriorityProfile } = require("../prioritization");

// Criar tarefa com priorização inteligente
const createTask = async (req, res) => {
  const { title, description, priority, dueDate, status, recurring, listId } = req.body;
  const userId = req.params.userId;

  if (!title || !listId) {
    return res.status(400).json({ message: "Título e lista são obrigatórios." });
  }

  try {
    // Gerar perfil do usuário para IA
    const userProfile = await buildUserPriorityProfile(userId);

    // Obter sugestão da IA Gemini
    const suggestedPriority = await suggestPriority(userProfile, title, description);

    const task = await Task.create({
      title,
      description,
      priority: priority ?? suggestedPriority ?? "media",
      dueDate,
      status: status ?? "a_fazer",
      recurring: recurring ?? false,
      listId,
      userId,
    });

    res.status(201).json({
      ...task.get({ plain: true }),
      suggestedPriority: priority ? undefined : suggestedPriority,
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ message: "Erro ao criar tarefa." });
  }
};

// Atualizar tarefa com priorização inteligente
const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada." });

    // Se título ou descrição mudaram, reavaliar prioridade
    if (updates.title || updates.description) {
      const userProfile = await buildUserPriorityProfile(task.userId);
      const suggestedPriority = await suggestPriority(
        userProfile,
        updates.title || task.title,
        updates.description || task.description
      );

      if (!updates.priority) {
        updates.priority = suggestedPriority;
      }
    }

    await task.update(updates);
    res.json({ message: "Tarefa atualizada", task });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ message: "Erro ao atualizar tarefa." });
  }
};

// Buscar tarefas por Usuário incluindo lista, anexos e lembretes
const getTasksByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await Task.findAll({
      where: { userId },
      include: [
        { model: TaskAttachment, as: "attachments" },
        { model: TaskReminder, as: "reminders" },
        { model: TaskList, as: "list" }, // inclusão da lista
      ],
      order: [["dueDate", "ASC"]],
    });
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas por usuário:", error);
    res.status(500).json({ message: "Erro ao buscar tarefas por usuário." });
  }
};

// Buscar tarefas por lista incluindo anexos e lembretes
const getTasksByList = async (req, res) => {
  const { listId } = req.params;

  try {
    const tasks = await Task.findAll({
      where: { listId },
      include: [
        { model: TaskAttachment, as: "attachments" },
        { model: TaskReminder, as: "reminders" },
        { model: TaskList, as: "list" }, // inclusão da lista
      ],
      order: [["dueDate", "ASC"]],
    });
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ message: "Erro ao buscar tarefas." });
  }
};

// Buscar tarefa por ID incluindo anexos, lembretes e lista
const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id, {
      include: [
        { model: TaskAttachment, as: "attachments" },
        { model: TaskReminder, as: "reminders" },
        { model: TaskList, as: "list" }, // inclusão da lista
      ],
    });
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada." });
    res.json(task);
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    res.status(500).json({ message: "Erro ao buscar tarefa." });
  }
};

// Deletar tarefa e seus anexos e lembretes
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await TaskAttachment.destroy({ where: { taskId: id } });
    await TaskReminder.destroy({ where: { taskId: id } });
    const deleted = await Task.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Tarefa não encontrada." });

    res.json({ message: "Tarefa excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ message: "Erro ao excluir tarefa." });
  }
};

// Buscar tarefas para Kanban por lista
const getTasksKanbanByList = async (req, res) => {
  const { listId } = req.params;
  const { priority, recurring } = req.query;

  try {
    const where = { listId };
    if (priority) where.priority = priority;
    if (recurring !== undefined) where.recurring = recurring === "true";

    const tasks = await Task.findAll({
      where,
      include: [
        { model: TaskAttachment, as: "attachments" },
        { model: TaskReminder, as: "reminders" },
        { model: TaskList, as: "list" }, // inclusão da lista
      ],
      order: [["dueDate", "ASC"]],
    });

    const kanban = {
      a_fazer: [],
      fazendo: [],
      feito: [],
    };

    tasks.forEach((task) => {
      if (kanban[task.status]) {
        kanban[task.status].push(task);
      } else {
        kanban.a_fazer.push(task);
      }
    });

    res.json(kanban);
  } catch (error) {
    console.error("Erro ao buscar tarefas Kanban:", error);
    res.status(500).json({ message: "Erro ao buscar tarefas Kanban." });
  }
};

// Buscar tarefas para calendário por usuário
const getTasksCalendarByUser = async (req, res) => {
  const { userId } = req.params;
  const { start, end, status, priority } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: "Parâmetros 'start' e 'end' são obrigatórios." });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ message: "Parâmetros 'start' e 'end' devem ser datas válidas." });
  }

  try {
    const where = {
      userId,
      dueDate: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await Task.findAll({
      where,
      attributes: ["id", "title", "dueDate", "status", "priority"],
      order: [["dueDate", "ASC"]],
    });

    const events = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      start: task.dueDate,
      status: task.status,
      priority: task.priority,
    }));

    res.json(events);
  } catch (error) {
    console.error("Erro ao buscar tarefas para calendário:", error);
    res.status(500).json({ message: "Erro ao buscar tarefas para calendário.", error: error.message });
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
