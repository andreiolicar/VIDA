const friendService = require('../services/friends.service');

class FriendsController {
  async searchUsers(req, res) {
    try {
      const users = await friendService.searchUsers(req.user.id, req.query.q);
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async sendRequest(req, res) {
    try {
      const request = await friendService.sendFriendRequest(req.user.id, req.body.receiverUserId);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async acceptRequest(req, res) {
    try {
      await friendService.acceptRequest(req.user.id, req.params.requestId);
      res.json({ message: 'Solicitação aceita' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async rejectRequest(req, res) {
    try {
      await friendService.rejectRequest(req.user.id, req.params.requestId);
      res.json({ message: 'Solicitação recusada' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async listFriends(req, res) {
    try {
      const friends = await friendService.listFriends(req.user.id);
      res.json(friends);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar amigos' });
    }
  }

  async listReceivedRequests(req, res) {
    try {
      const requests = await friendService.listReceivedRequests(req.user.id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar solicitações' });
    }
  }
}

module.exports = new FriendsController();
