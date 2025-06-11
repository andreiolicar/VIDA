const express = require('express');
const router = express.Router();

const chatSessionController = require('../controllers/chatSession.controller');
const verifyToken = require('../middleware/auth.middleware');

// Aplica o middleware de autenticação em todas as rotas abaixo
router.use(verifyToken);

router.get('/', chatSessionController.listChats);
router.post('/', chatSessionController.createChat);
router.get('/:id', chatSessionController.getChat);
router.patch('/:id', chatSessionController.updateChat);
router.delete('/:id', chatSessionController.deleteChat);

module.exports = router;