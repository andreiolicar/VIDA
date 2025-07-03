const groupsService = require('../services/groups.service');

class GroupsController {
  async createGroup(req, res) {
    try {
      const group = await groupsService.createGroup(req.user.id, req.body);
      res.status(201).json(group);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao criar grupo' });
    }
  }

  async listUserGroups(req, res) {
    try {
      const groups = await groupsService.listUserGroups(req.user.id);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar grupos' });
    }
  }

  async getGroupDetails(req, res) {
    try {
      const group = await groupsService.getGroupDetails(req.params.groupId);
      res.json(group);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao obter detalhes do grupo' });
    }
  }

  async updateGroup(req, res) {
    try {
      const group = await groupsService.updateGroup(req.params.groupId, req.body);
      res.json(group);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao atualizar grupo' });
    }
  }

  async deleteGroup(req, res) {
    try {
      await groupsService.deleteGroup(req.params.groupId);
      res.json({ message: 'Grupo deletado com sucesso' });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao deletar grupo' });
    }
  }

  async addMember(req, res) {
    try {
      const member = await groupsService.addMember(req.params.groupId, req.body.userId);
      res.status(201).json(member);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao adicionar membro' });
    }
  }

  async removeMember(req, res) {
    try {
      await groupsService.removeMember(req.params.groupId, req.params.userId);
      res.json({ message: 'Membro removido com sucesso' });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao remover membro' });
    }
  }

  async listMembers(req, res) {
    try {
      const members = await groupsService.listMembers(req.params.groupId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar membros' });
    }
  }

  async changeMemberRole(req, res) {
    try {
      const member = await groupsService.changeMemberRole(req.params.groupId, req.params.userId, req.body.role);
      res.json(member);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao alterar papel do membro' });
    }
  }

  async sendMessage(req, res) {
    try {
      const message = await groupsService.sendMessage(req.user.id, req.params.groupId, req.body.content);
      res.status(201).json(message);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao enviar mensagem' });
    }
  }

  async getMessages(req, res) {
    try {
      const messages = await groupsService.getMessages(req.user.id, req.params.groupId);
      res.json(messages);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao obter mensagens' });
    }
  }

  async markMessageRead(req, res) {
    try {
      await groupsService.markMessageRead(req.user.id, req.params.groupId, req.params.messageId);
      res.json({ message: 'Mensagem marcada como lida' });
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao marcar mensagem como lida' });
    }
  }

  async search(req, res) {
    try {
      const users = await groupsService.searchUsers(req.user.id, req.query.q);
      res.json(users);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || 'Erro ao buscar usuários' });
    }
  }
}

module.exports = new GroupsController();
