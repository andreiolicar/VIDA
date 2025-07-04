const taskAttachmentService = require("../services/taskAttachments.service");

const addAttachment = async (req, res) => {
  try {
    const attachment = await taskAttachmentService.addAttachment(req.body);
    res.status(201).json(attachment);
  } catch (error) {
    console.error("Erro ao adicionar anexo:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const getAttachmentsByTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const attachments = await taskAttachmentService.getAttachmentsByTask(taskId);
    res.json(attachments);
  } catch (error) {
    console.error("Erro ao buscar anexos:", error.message);
    res.status(500).json({ message: "Erro ao buscar anexos." });
  }
};

const deleteAttachment = async (req, res) => {
  const { id } = req.params;

  try {
    await taskAttachmentService.deleteAttachment(id);
    res.json({ message: "Anexo excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir anexo:", error.message);
    const status = error.message === "Anexo não encontrado." ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  addAttachment,
  getAttachmentsByTask,
  deleteAttachment,
};
