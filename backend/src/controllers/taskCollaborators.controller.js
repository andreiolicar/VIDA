const taskCollaboratorService = require("../services/taskCollaborators.service");

const addCollaborator = async (req, res) => {
  try {
    const collaborator = await taskCollaboratorService.addCollaborator(req.body);
    res.status(201).json(collaborator);
  } catch (error) {
    console.error("Erro ao adicionar colaborador:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const getCollaboratorsByList = async (req, res) => {
  const { listId } = req.params;

  try {
    const collaborators = await taskCollaboratorService.getCollaboratorsByList(listId);
    res.json(collaborators);
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error.message);
    res.status(500).json({ message: "Erro ao buscar colaboradores." });
  }
};

const removeCollaborator = async (req, res) => {
  const { id } = req.params;

  try {
    await taskCollaboratorService.removeCollaborator(id);
    res.json({ message: "Colaborador removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover colaborador:", error.message);
    const status = error.message === "Colaborador não encontrado." ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  addCollaborator,
  getCollaboratorsByList,
  removeCollaborator,
};
