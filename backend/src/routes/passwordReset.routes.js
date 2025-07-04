/**
 * @swagger
 * tags:
 *   name: PasswordReset
 *   description: Recuperação e redefinição de senha dos usuários
 */

const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordReset.controller');

// Rate limiting para segurança e prevenção de abuso
const rateLimit = require('express-rate-limit');

/**
 * Limitador de requisições para solicitar reset de senha
 * Permite no máximo 1 requisição por minuto por IP
 */
const requestResetLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 1, // máximo de 1 requisição
  message: {
    error: 'Muitas tentativas. Tente novamente em 1 minuto.'
  },
  standardHeaders: true, // envia headers RateLimit-* no response
  legacyHeaders: false, // desativa headers X-RateLimit-*
});

/**
 * Limitador de requisições para verificar código de confirmação
 * Permite no máximo 5 requisições a cada 5 minutos por IP
 */
const verifyCodeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // máximo de 5 requisições
  message: {
    error: 'Muitas tentativas de verificação. Tente novamente em 5 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 * /passwordreset/request:
 *   post:
 *     summary: Solicitar envio de código de recuperação de senha
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@exemplo.com"
 *     responses:
 *       200:
 *         description: Código de recuperação enviado
 *       429:
 *         description: Muitas tentativas - limite atingido
 */
router.post('/request', requestResetLimiter, passwordResetController.requestReset);

/**
 * @swagger
 * /passwordreset/verify:
 *   post:
 *     summary: Verificar código de recuperação recebido por email
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@exemplo.com"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Código verificado com sucesso
 *       400:
 *         description: Código inválido
 *       429:
 *         description: Muitas tentativas - limite atingido
 */
router.post('/verify', verifyCodeLimiter, passwordResetController.verifyCode);

/**
 * @swagger
 * /passwordreset/reset:
 *   post:
 *     summary: Redefinir a senha após verificação do código
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@exemplo.com"
 *               newPassword:
 *                 type: string
 *                 example: "NovaSenhaSegura123!"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Erro na redefinição
 */
router.post('/reset', passwordResetController.resetPassword);

/**
 * @swagger
 * /passwordreset/resend:
 *   post:
 *     summary: Reenviar o código de recuperação
 *     tags: [PasswordReset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@exemplo.com"
 *     responses:
 *       200:
 *         description: Código reenviado com sucesso
 *       429:
 *         description: Muitas tentativas - limite atingido
 */
router.post('/resend', requestResetLimiter, passwordResetController.resendCode);

module.exports = router;
