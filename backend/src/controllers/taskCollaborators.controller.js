const { TaskCollaborator } = require("../models");

const addCollaborator = async (req, res) => {
  const { listId, userId, role } = req.body;

  if (!listId || !userId) {
    return res.status(400).json({ message: "listId e userId são obrigatórios." });
  }

  try {
    const collaborator = await TaskCollaborator.create({
      listId,
      userId,
      role: role ?? "editor",
    });
    res.status(201).json(collaborator);
  } catch (error) {
    console.error("Erro ao adicionar colaborador:", error);
    res.status(500).json({ message: "Erro ao adicionar colaborador." });
  }
};

const getCollaboratorsByList = async (req, res) => {
  const { listId } = req.params;

  try {
    const collaborators = await TaskCollaborator.findAll({ where: { listId } });
    res.json(collaborators);
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error);
    res.status(500).json({ message: "Erro ao buscar colaboradores." });
  }
};

const removeCollaborator = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await TaskCollaborator.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Colaborador não encontrado." });
    res.json({ message: "Colaborador removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover colaborador:", error);
    res.status(500).json({ message: "Erro ao remover colaborador." });
  }
};

module.exports = { addCollaborator, getCollaboratorsByList, removeCollaborator };
