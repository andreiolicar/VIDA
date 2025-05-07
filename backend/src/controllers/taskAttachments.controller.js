const { TaskAttachment } = require("../models");

const addAttachment = async (req, res) => {
  const { taskId, url, type } = req.body;

  if (!taskId || !url || !type) {
    return res.status(400).json({ message: "taskId, url e type são obrigatórios." });
  }

  try {
    const attachment = await TaskAttachment.create({ taskId, url, type });
    res.status(201).json(attachment);
  } catch (error) {
    console.error("Erro ao adicionar anexo:", error);
    res.status(500).json({ message: "Erro ao adicionar anexo." });
  }
};

const getAttachmentsByTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const attachments = await TaskAttachment.findAll({ where: { taskId } });
    res.json(attachments);
  } catch (error) {
    console.error("Erro ao buscar anexos:", error);
    res.status(500).json({ message: "Erro ao buscar anexos." });
  }
};

const deleteAttachment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await TaskAttachment.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Anexo não encontrado." });
    res.json({ message: "Anexo excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir anexo:", error);
    res.status(500).json({ message: "Erro ao excluir anexo." });
  }
};

module.exports = { addAttachment, getAttachmentsByTask, deleteAttachment };
