const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentcontroller');

// Criar agendamento
router.post('/:userId', appointmentcontroller.create);

// Listar todos agendamentos do usuário
router.get('/:userId', appointmentcontroller.getAll);

// Deletar agendamento
router.delete('/:id', appointmentcontroller.delete);

module.exports = router;
