const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordReset.controller');

// Rate limiting para segurança (opcional, mas recomendado)
const rateLimit = require('express-rate-limit');

// Limite de tentativas para solicitar reset (1 por minuto)
const requestResetLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 1, // máximo 1 tentativa por minuto
  message: {
    error: 'Muitas tentativas. Tente novamente em 1 minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite de tentativas para verificar código (5 por 5 minutos)
const verifyCodeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // máximo 5 tentativas por 5 minutos
  message: {
    error: 'Muitas tentativas de verificação. Tente novamente em 5 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rotas da recuperação de senha
router.post('/request', requestResetLimiter, passwordResetController.requestReset);
router.post('/verify', verifyCodeLimiter, passwordResetController.verifyCode);
router.post('/reset', passwordResetController.resetPassword);
router.post('/resend', requestResetLimiter, passwordResetController.resendCode);

module.exports = router;