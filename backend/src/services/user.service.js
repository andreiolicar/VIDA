const { User } = require("../models");

const getProfileService = async (userId) => {
  return await User.findByPk(userId, {
    attributes: ["id", "name", "email", "phone"],
  });
};

const updateProfileService = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  // Atualiza apenas os campos enviados
  user.name = data.name || user.name;
  user.email = data.email || user.email;
  user.phone = data.phone || user.phone;

  await user.save();
  return user;
};

module.exports = { getProfileService, updateProfileService };
