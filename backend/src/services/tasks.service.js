// services/task.service.js
const db = require("../models");
const Op = db.Sequelize.Op;
const { Task, TaskAttachment, TaskReminder, TaskList, Subtask } = db;

const { suggestPriority } = require("../gemini");
const { buildUserPriorityProfile } = require("../prioritization");

async function createTaskService(userId, taskData) {
  const { title, description, priority, dueDate, status, recurring, listId, subtasks } = taskData;

  if (!title || !listId) {
    throw new Error("Título e lista são obrigatórios.");
  }

  const userProfile = await buildUserPriorityProfile(userId);
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

  if (Array.isArray(subtasks) && subtasks.length > 0) {
    const subtasksData = subtasks
      .filter((t) => t.trim() !== "")
      .map((title) => ({
        taskId: task.id,
        title,
        completed: false,
      }));
    if (subtasksData.length > 0) {
      await Subtask.bulkCreate(subtasksData);
    }
  }

  return {
    ...task.get({ plain: true }),
    suggestedPriority: priority ? undefined : suggestedPriority,
  };
}

async function updateTaskService(id, updates) {
  const task = await Task.findByPk(id);
  if (!task) return null;

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
  return task;
}

async function getTasksByUserService(userId) {
  return Task.findAll({
    where: { userId },
    include: [
      { model: TaskAttachment, as: "attachments" },
      { model: TaskReminder, as: "reminders" },
      { model: TaskList, as: "list" },
    ],
    order: [["dueDate", "ASC"]],
  });
}

async function getTasksByListService(listId) {
  return Task.findAll({
    where: { listId },
    include: [
      { model: TaskAttachment, as: "attachments" },
      { model: TaskReminder, as: "reminders" },
      { model: TaskList, as: "list" },
    ],
    order: [["dueDate", "ASC"]],
  });
}

async function getTaskByIdService(id) {
  return Task.findByPk(id, {
    include: [
      { model: TaskAttachment, as: "attachments" },
      { model: TaskReminder, as: "reminders" },
      { model: TaskList, as: "list" },
      { model: Subtask, as: "subtasks" },
    ],
  });
}

async function deleteTaskService(id) {
  await TaskAttachment.destroy({ where: { taskId: id } });
  await TaskReminder.destroy({ where: { taskId: id } });
  return Task.destroy({ where: { id } });
}

async function getTasksKanbanByListService(listId, filters = {}) {
  const where = { listId };
  if (filters.priority) where.priority = filters.priority;
  if (filters.recurring !== undefined) where.recurring = filters.recurring === "true";

  const tasks = await Task.findAll({
    where,
    include: [
      { model: TaskAttachment, as: "attachments" },
      { model: TaskReminder, as: "reminders" },
      { model: TaskList, as: "list" },
    ],
    order: [["dueDate", "ASC"]],
  });

  const kanban = { a_fazer: [], fazendo: [], feito: [] };
  tasks.forEach((task) => {
    if (kanban[task.status]) {
      kanban[task.status].push(task);
    } else {
      kanban.a_fazer.push(task);
    }
  });

  return kanban;
}

async function getTasksCalendarByUserService(userId, start, end, status, priority) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Datas inválidas.");
  }

  const where = {
    userId,
    dueDate: { [Op.between]: [startDate, endDate] },
  };

  if (status) where.status = status;
  if (priority) where.priority = priority;

  const tasks = await Task.findAll({
    where,
    attributes: ["id", "title", "dueDate", "status", "priority"],
    order: [["dueDate", "ASC"]],
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.dueDate,
    status: task.status,
    priority: task.priority,
  }));
}

module.exports = {
  createTaskService,
  updateTaskService,
  getTasksByUserService,
  getTasksByListService,
  getTaskByIdService,
  deleteTaskService,
  getTasksKanbanByListService,
  getTasksCalendarByUserService,
};
