const { ChatSession, User } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function getUserIdFromReq(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new Error('Token não fornecido');
    const [, token] = authHeader.split(' ');
    if (!token) throw new Error('Token inválido');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
}

module.exports = {
    listChats: async (req, res) => {
        try {
            const userId = getUserIdFromReq(req);
            const chats = await ChatSession.findAll({
                where: { userId },
                order: [['updatedAt', 'DESC']],
                limit: 6,
                attributes: ['id', 'title', 'updatedAt'],
            });
            res.json(chats);
        } catch (error) {
            console.error('Erro ao listar chats:', error);
            res.status(401).json({ message: error.message || 'Erro ao listar chats' });
        }
    },

    createChat: async (req, res) => {
        try {
            const userId = getUserIdFromReq(req);
            const { title, messages = [] } = req.body;

            if (!title) {
                return res.status(400).json({ message: 'Título é obrigatório' });
            }

            const chat = await ChatSession.create({
                userId,
                title,
                messages,
            });

            res.status(201).json(chat);
        } catch (error) {
            console.error('Erro ao criar chat:', error);
            res.status(401).json({ message: error.message || 'Erro ao criar chat' });
        }
    },

    getChat: async (req, res) => {
        try {
            const userId = getUserIdFromReq(req);
            const { id } = req.params;

            const chat = await ChatSession.findOne({ where: { id, userId } });
            if (!chat) return res.status(404).json({ message: 'Chat não encontrado' });

            res.json(chat);
        } catch (error) {
            console.error('Erro ao buscar chat:', error);
            res.status(401).json({ message: error.message || 'Erro ao buscar chat' });
        }
    },

    updateChat: async (req, res) => {
        try {
            const userId = getUserIdFromReq(req);
            const { id } = req.params;
            const { title, messages } = req.body;

            const chat = await ChatSession.findOne({ where: { id, userId } });
            if (!chat) return res.status(404).json({ message: 'Chat não encontrado' });

            if (title !== undefined) chat.title = title;
            if (messages !== undefined) chat.messages = messages;

            await chat.save();

            res.json(chat);
        } catch (error) {
            console.error('Erro ao atualizar chat:', error);
            res.status(401).json({ message: error.message || 'Erro ao atualizar chat' });
        }
    },

    deleteChat: async (req, res) => {
        try {
            const userId = getUserIdFromReq(req);
            const { id } = req.params;

            const deleted = await ChatSession.destroy({ where: { id, userId } });
            if (!deleted) return res.status(404).json({ message: 'Chat não encontrado' });

            res.json({ message: 'Chat deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar chat:', error);
            res.status(401).json({ message: error.message || 'Erro ao deletar chat' });
        }
    },
};