const { GroupMember } = require('../models');

async function checkGroupOwnerOrAdmin(req, res, next) {
  const userId = req.user.id;
  const { groupId } = req.params;

  try {
    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) return res.status(403).json({ error: 'Você não é membro deste grupo' });

    if (member.role === 'owner' || member.role === 'admin') {
      return next();
    }

    return res.status(403).json({ error: 'Permissão negada' });
  } catch (error) {
    console.error('Erro na autorização do grupo:', error);
    return res.status(500).json({ error: 'Erro na autorização' });
  }
}

async function checkGroupOwner(req, res, next) {
  const userId = req.user.id;
  const { groupId } = req.params;

  try {
    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) return res.status(403).json({ error: 'Você não é membro deste grupo' });

    if (member.role === 'owner') {
      return next();
    }

    return res.status(403).json({ error: 'Permissão negada' });
  } catch (error) {
    console.error('Erro na autorização do grupo:', error);
    return res.status(500).json({ error: 'Erro na autorização' });
  }
}

module.exports = { checkGroupOwnerOrAdmin, checkGroupOwner };