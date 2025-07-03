const { Group, GroupMember, GroupMessage, User } = require('../models');
const { getIO, addUserToGroupRoom, removeUserFromGroupRoom } = require('../socket');
const { Op } = require('sequelize');

class GroupsService {
  async createGroup(userId, { name, description, imageUrl }) {
    if (!name) throw { status: 400, message: 'O nome do grupo é obrigatório' };

    const group = await Group.create({ name, description, imageUrl, ownerUserId: userId });
    await GroupMember.create({ groupId: group.id, userId, role: 'owner' });

    return group;
  }

  async listUserGroups(userId) {
    return Group.findAll({
      include: [
        {
          model: GroupMember,
          as: 'members',
          where: { userId },
          attributes: [],
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }

  async getGroupDetails(groupId) {
    const group = await Group.findByPk(groupId, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    });
    if (!group) throw { status: 404, message: 'Grupo não encontrado' };
    return group;
  }

  async updateGroup(groupId, { name, description, imageUrl }) {
    const group = await Group.findByPk(groupId);
    if (!group) throw { status: 404, message: 'Grupo não encontrado' };

    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (imageUrl !== undefined) group.imageUrl = imageUrl;

    await group.save();

    const io = getIO();
    io.to(`group:${groupId}`).emit('group updated', {
      groupId,
      name: group.name,
      description: group.description,
      imageUrl: group.imageUrl,
    });

    return group;
  }

  async deleteGroup(groupId) {
    const group = await Group.findByPk(groupId);
    if (!group) throw { status: 404, message: 'Grupo não encontrado' };

    await group.destroy();

    const io = getIO();
    io.to(`group:${groupId}`).emit('group deleted', { groupId });

    return;
  }

  async addMember(groupId, userId) {
    if (!userId) throw { status: 400, message: 'userId é obrigatório' };

    const exists = await GroupMember.findOne({ where: { groupId, userId } });
    if (exists) throw { status: 400, message: 'Usuário já é membro do grupo' };

    const member = await GroupMember.create({ groupId, userId, role: 'member' });

    const io = getIO();
    await addUserToGroupRoom(userId, groupId);
    io.to(`group:${groupId}`).emit('group member joined', {
      groupId,
      userId,
      role: member.role,
    });

    return member;
  }

  async removeMember(groupId, userId) {
    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) throw { status: 404, message: 'Membro não encontrado' };

    await member.destroy();

    const io = getIO();
    await removeUserFromGroupRoom(userId, groupId);
    io.to(`group:${groupId}`).emit('group member left', { groupId, userId });

    return;
  }

  async listMembers(groupId) {
    return GroupMember.findAll({
      where: { groupId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    });
  }

  async changeMemberRole(groupId, userId, role) {
    const validRoles = ['owner', 'admin', 'member'];
    if (!validRoles.includes(role)) throw { status: 400, message: 'Papel inválido' };

    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) throw { status: 404, message: 'Membro não encontrado' };

    member.role = role;
    await member.save();

    const io = getIO();
    io.to(`group:${groupId}`).emit('group member updated', { groupId, userId, role });

    return member;
  }

  async sendMessage(senderUserId, groupId, content) {
    if (!content) throw { status: 400, message: 'Conteúdo da mensagem é obrigatório' };

    const member = await GroupMember.findOne({ where: { groupId, userId: senderUserId } });
    if (!member) throw { status: 403, message: 'Você não é membro deste grupo' };

    const message = await GroupMessage.create({ groupId, senderUserId, content, read: false });

    const io = getIO();
    io.to(`group:${groupId}`).emit('group message', {
      id: message.id,
      groupId,
      senderUserId,
      content: message.content,
      timestamp: message.timestamp,
      read: message.read,
    });

    return message;
  }

  async getMessages(userId, groupId) {
    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) throw { status: 403, message: 'Você não é membro deste grupo' };

    return GroupMessage.findAll({
      where: { groupId },
      order: [['timestamp', 'ASC']],
    });
  }

  async markMessageRead(userId, groupId, messageId) {
    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) throw { status: 403, message: 'Você não é membro deste grupo' };

    const message = await GroupMessage.findOne({ where: { id: messageId, groupId } });
    if (!message) throw { status: 404, message: 'Mensagem não encontrada' };

    message.read = true;
    await message.save();

    return;
  }

  async searchUsers(userId, query) {
    if (!query || query.trim() === '') throw { status: 400, message: 'Parâmetro de busca inválido' };

    return User.findAll({
      where: {
        id: { [Op.ne]: userId },
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: ['id', 'name', 'email'],
      limit: 20,
    });
  }
}

module.exports = new GroupsService();
