const { Op } = require('sequelize');
const { FriendRequest, Friend, User } = require('../models');

class FriendsController {
  // Buscar usuários (excluindo o próprio usuário)
  async searchUsers(req, res) {
    const { q } = req.query;
    const userId = req.user.id; // Middleware JWT deve popular req.user

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

  // Enviar solicitação de amizade
  async sendRequest(req, res) {
    const requesterUserId = req.user.id;
    const { receiverUserId } = req.body;

    if (!receiverUserId) {
      return res.status(400).json({ error: 'ID do usuário receptor é obrigatório' });
    }

    if (requesterUserId === receiverUserId) {
      return res.status(400).json({ error: 'Não pode enviar solicitação para si mesmo' });
    }

    try {
      // Verifica se já existe solicitação pendente entre esses usuários
      const existingRequest = await FriendRequest.findOne({
        where: {
          requesterUserId,
          receiverUserId,
          status: 'pending',
        },
      });

      if (existingRequest) {
        return res.status(400).json({ error: 'Solicitação já enviada' });
      }

      // Verifica se já são amigos
      const [userId1, userId2] = [requesterUserId, receiverUserId].sort((a, b) => a - b);
      const existingFriend = await Friend.findOne({
        where: { userId1, userId2 },
      });

      if (existingFriend) {
        return res.status(400).json({ error: 'Usuários já são amigos' });
      }

      // Cria nova solicitação
      const request = await FriendRequest.create({ requesterUserId, receiverUserId });
      res.status(201).json(request);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      res.status(500).json({ error: 'Erro ao enviar solicitação' });
    }
  }

  // Aceitar solicitação
  async acceptRequest(req, res) {
    const userId = req.user.id;
    const { requestId } = req.params;

    try {
      const request = await FriendRequest.findOne({
        where: { id: requestId, receiverUserId: userId, status: 'pending' },
      });

      if (!request) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }

      // Atualiza status para aceito
      request.status = 'accepted';
      await request.save();

      // Cria amizade nos dois sentidos (userId1 < userId2 para evitar duplicidade)
      const [userId1, userId2] = [request.requesterUserId, request.receiverUserId].sort((a, b) => a - b);
      await Friend.create({ userId1, userId2 });

      res.json({ message: 'Solicitação aceita' });
    } catch (error) {
      console.error('Erro ao aceitar solicitação:', error);
      res.status(500).json({ error: 'Erro ao aceitar solicitação' });
    }
  }

  // Recusar solicitação
  async rejectRequest(req, res) {
    const userId = req.user.id;
    const { requestId } = req.params;

    try {
      const request = await FriendRequest.findOne({
        where: { id: requestId, receiverUserId: userId, status: 'pending' },
      });

      if (!request) {
        return res.status(404).json({ error: 'Solicitação não encontrada' });
      }

      request.status = 'rejected';
      await request.save();

      res.json({ message: 'Solicitação recusada' });
    } catch (error) {
      console.error('Erro ao recusar solicitação:', error);
      res.status(500).json({ error: 'Erro ao recusar solicitação' });
    }
  }

  // Listar amigos do usuário
  async listFriends(req, res) {
    const userId = req.user.id;

    try {
      const friends = await Friend.findAll({
        where: {
          [Op.or]: [{ userId1: userId }, { userId2: userId }],
        },
      });

      const friendIds = friends.map(f => (f.userId1 === userId ? f.userId2 : f.userId1));

      const friendUsers = await User.findAll({
        where: { id: friendIds },
        attributes: ['id', 'name', 'email'],
      });

      res.json(friendUsers);
    } catch (error) {
      console.error('Erro ao listar amigos:', error);
      res.status(500).json({ error: 'Erro ao listar amigos' });
    }
  }

  // Listar solicitações recebidas pendentes
  async listReceivedRequests(req, res) {
    const userId = req.user.id;

    try {
      const requests = await FriendRequest.findAll({
        where: { receiverUserId: userId, status: 'pending' },
        include: [{ model: User, as: 'requester', attributes: ['id', 'name', 'email'] }],
      });
      res.json(requests);
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      res.status(500).json({ error: 'Erro ao listar solicitações' });
    }
  }
}

module.exports = new FriendsController();