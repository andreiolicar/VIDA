const { TaskAttachment } = require("../models");

// Cria um novo anexo para uma tarefa
const addAttachment = async ({ taskId, url, type }) => {
  if (!taskId || !url || !type) {
    throw new Error("taskId, url e type são obrigatórios.");
  }

  const attachment = await TaskAttachment.create({ taskId, url, type });
  return attachment;
};

// Busca todos os anexos de uma tarefa
const getAttachmentsByTask = async (taskId) => {
  return TaskAttachment.findAll({ where: { taskId } });
};

// Exclui um anexo pelo ID
const deleteAttachment = async (id) => {
  const deleted = await TaskAttachment.destroy({ where: { id } });
  if (!deleted) {
    throw new Error("Anexo não encontrado.");
  }
};

module.exports = {
  addAttachment,
  getAttachmentsByTask,
  deleteAttachment,
};
