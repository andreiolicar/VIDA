const { TaskCollaborator } = require("../models");

// Adiciona um colaborador à lista de tarefas
const addCollaborator = async ({ listId, userId, role }) => {
  if (!listId || !userId) {
    throw new Error("listId e userId são obrigatórios.");
  }

  const collaborator = await TaskCollaborator.create({
    listId,
    userId,
    role: role ?? "editor",
  });

  return collaborator;
};

// Retorna todos os colaboradores de uma lista
const getCollaboratorsByList = async (listId) => {
  return TaskCollaborator.findAll({ where: { listId } });
};

// Remove um colaborador pelo ID
const removeCollaborator = async (id) => {
  const deleted = await TaskCollaborator.destroy({ where: { id } });
  if (!deleted) {
    throw new Error("Colaborador não encontrado.");
  }
};

module.exports = {
  addCollaborator,
  getCollaboratorsByList,
  removeCollaborator,
};
