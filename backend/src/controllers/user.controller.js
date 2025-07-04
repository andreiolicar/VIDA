const userService = require("../services/user.service");

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfileService(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Erro interno", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateProfileService(req.params.userId, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json({ message: "Perfil atualizado com sucesso", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil", error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
