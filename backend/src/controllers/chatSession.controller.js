const chatService = require('../services/chatSession.service');

module.exports = {
  async listChats(req, res) {
    try {
      const userId = req.user.id;
      const chats = await chatService.listChats(userId);
      res.json(chats);
    } catch (error) {
      console.error('Erro ao listar chats:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async createChat(req, res) {
    try {
      const userId = req.user.id;
      const chat = await chatService.createChat(userId, req.body);
      res.status(201).json(chat);
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async getChat(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const chat = await chatService.getChat(userId, id);
      res.json(chat);
    } catch (error) {
      console.error('Erro ao buscar chat:', error);
      res.status(404).json({ message: error.message });
    }
  },

  async updateChat(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const chat = await chatService.updateChat(userId, id, req.body);
      res.json(chat);
    } catch (error) {
      console.error('Erro ao atualizar chat:', error);
      res.status(404).json({ message: error.message });
    }
  },

  async deleteChat(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await chatService.deleteChat(userId, id);
      res.json({ message: 'Chat deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar chat:', error);
      res.status(404).json({ message: error.message });
    }
  },
};
