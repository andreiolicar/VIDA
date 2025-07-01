const { Group, GroupMember, GroupMessage, User } = require('../models');
const { getIO, addUserToGroupRoom, removeUserFromGroupRoom } = require('../socket');
const { Op } = require('sequelize');

class GroupsController {
    // Criar grupo
    async createGroup(req, res) {
        const userId = req.user.id;
        const { name, description, imageUrl } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'O nome do grupo é obrigatório' });
        }

        try {
            const group = await Group.create({ name, description, imageUrl, ownerUserId: userId });
            await GroupMember.create({ groupId: group.id, userId, role: 'owner' });
            return res.status(201).json(group);
        } catch (error) {
            console.error('Erro ao criar grupo:', error);
            return res.status(500).json({ error: 'Erro ao criar grupo' });
        }
    }

    // Listar grupos do usuário
    async listUserGroups(req, res) {
        const userId = req.user.id;
        try {
            const groups = await Group.findAll({
                include: [
                    {
                        model: GroupMember,
                        as: 'members',
                        where: { userId },
                        attributes: []
                    },
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            });
            return res.json(groups);
        } catch (error) {
            console.error('Erro ao listar grupos:', error);
            return res.status(500).json({ error: 'Erro ao listar grupos' });
        }
    }

    // Obter detalhes do grupo
    async getGroupDetails(req, res) {
        const { groupId } = req.params;
        try {
            const group = await Group.findByPk(groupId, {
                include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
            });
            if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });
            return res.json(group);
        } catch (error) {
            console.error('Erro ao obter detalhes do grupo:', error);
            return res.status(500).json({ error: 'Erro ao obter detalhes do grupo' });
        }
    }

    // Atualizar grupo
    async updateGroup(req, res) {
        const { groupId } = req.params;
        const { name, description, imageUrl } = req.body;
        const userId = req.user.id;

        try {
            const group = await Group.findByPk(groupId);
            if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });

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

            return res.json(group);
        } catch (error) {
            console.error('Erro ao atualizar grupo:', error);
            return res.status(500).json({ error: 'Erro ao atualizar grupo' });
        }
    }

    // Deletar grupo
    async deleteGroup(req, res) {
        const { groupId } = req.params;

        try {
            const group = await Group.findByPk(groupId);
            if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });

            await group.destroy();

            const io = getIO();
            io.to(`group:${groupId}`).emit('group deleted', { groupId });

            return res.json({ message: 'Grupo deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar grupo:', error);
            return res.status(500).json({ error: 'Erro ao deletar grupo' });
        }
    }

    // Adicionar membro
    async addMember(req, res) {
        const { groupId } = req.params;
        const { userId } = req.body;

        if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

        try {
            const exists = await GroupMember.findOne({ where: { groupId, userId } });
            if (exists) return res.status(400).json({ error: 'Usuário já é membro do grupo' });

            const member = await GroupMember.create({ groupId, userId, role: 'member' });

            const io = getIO();
            await addUserToGroupRoom(userId, groupId);
            io.to(`group:${groupId}`).emit('group member joined', {
                groupId,
                userId,
                role: member.role,
            });

            return res.status(201).json(member);
        } catch (error) {
            console.error('Erro ao adicionar membro:', error);
            return res.status(500).json({ error: 'Erro ao adicionar membro' });
        }
    }

    // Remover membro
    async removeMember(req, res) {
        const { groupId, userId } = req.params;

        try {
            const member = await GroupMember.findOne({ where: { groupId, userId } });
            if (!member) return res.status(404).json({ error: 'Membro não encontrado' });

            await member.destroy();

            const io = getIO();
            await removeUserFromGroupRoom(userId, groupId);
            io.to(`group:${groupId}`).emit('group member left', { groupId, userId });

            return res.json({ message: 'Membro removido com sucesso' });
        } catch (error) {
            console.error('Erro ao remover membro:', error);
            return res.status(500).json({ error: 'Erro ao remover membro' });
        }
    }

    // Listar membros do grupo
    async listMembers(req, res) {
        const { groupId } = req.params;
        try {
            const members = await GroupMember.findAll({
                where: { groupId },
                include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
            });
            return res.json(members);
        } catch (error) {
            console.error('Erro ao listar membros:', error);
            return res.status(500).json({ error: 'Erro ao listar membros' });
        }
    }

    // Alterar papel do membro
    async changeMemberRole(req, res) {
        const { groupId, userId } = req.params;
        const { role } = req.body;
        const validRoles = ['owner', 'admin', 'member'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Papel inválido' });
        }

        try {
            const member = await GroupMember.findOne({ where: { groupId, userId } });
            if (!member) return res.status(404).json({ error: 'Membro não encontrado' });

            member.role = role;
            await member.save();

            const io = getIO();
            io.to(`group:${groupId}`).emit('group member updated', { groupId, userId, role });

            return res.json(member);
        } catch (error) {
            console.error('Erro ao alterar papel:', error);
            return res.status(500).json({ error: 'Erro ao alterar papel do membro' });
        }
    }

    // Enviar mensagem no grupo
    async sendMessage(req, res) {
        const senderUserId = req.user.id;
        const { groupId } = req.params;
        const { content } = req.body;

        if (!content) return res.status(400).json({ error: 'Conteúdo da mensagem é obrigatório' });

        try {
            const member = await GroupMember.findOne({ where: { groupId, userId: senderUserId } });
            if (!member) return res.status(403).json({ error: 'Você não é membro deste grupo' });

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

            return res.status(201).json(message);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            return res.status(500).json({ error: 'Erro ao enviar mensagem' });
        }
    }

    // Obter histórico de mensagens
    async getMessages(req, res) {
        const userId = req.user.id;
        const { groupId } = req.params;

        try {
            const member = await GroupMember.findOne({ where: { groupId, userId } });
            if (!member) return res.status(403).json({ error: 'Você não é membro deste grupo' });

            const messages = await GroupMessage.findAll({
                where: { groupId },
                order: [['timestamp', 'ASC']],
            });

            return res.json(messages);
        } catch (error) {
            console.error('Erro ao obter mensagens:', error);
            return res.status(500).json({ error: 'Erro ao obter mensagens' });
        }
    }

    // Marcar mensagem como lida
    async markMessageRead(req, res) {
        const userId = req.user.id;
        const { groupId, messageId } = req.params;

        try {
            const member = await GroupMember.findOne({ where: { groupId, userId } });
            if (!member) return res.status(403).json({ error: 'Você não é membro deste grupo' });

            const message = await GroupMessage.findOne({ where: { id: messageId, groupId } });
            if (!message) return res.status(404).json({ error: 'Mensagem não encontrada' });

            message.read = true;
            await message.save();

            return res.json({ message: 'Mensagem marcada como lida' });
        } catch (error) {
            console.error('Erro ao marcar mensagem como lida:', error);
            return res.status(500).json({ error: 'Erro ao marcar mensagem como lida' });
        }
    }

    // Buscar usuários
    async search(req, res) {
        const { q } = req.query;
        const userId = req.user.id;

        if (!q || q.trim() === '') {
            return res.status(400).json({ error: 'Parâmetro de busca inválido' });
        }

        try {
            const users = await User.findAll({
                where: {
                    id: { [Op.ne]: userId },
                    [Op.or]: [
                        { name: { [Op.like]: `%${q}%` } },
                        { email: { [Op.like]: `%${q}%` } },
                    ],
                },
                attributes: ['id', 'name', 'email'],
                limit: 20,
            });
            res.json(users);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    }
}

module.exports = new GroupsController();