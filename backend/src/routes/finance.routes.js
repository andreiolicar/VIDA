/**
 * @swagger
 * tags:
 *   name: Finanças
 *   description: Gerenciamento financeiro do usuário
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const financeController = require("../controllers/finance.controller");
const { upload } = require("../controllers/finance.controller");

// ROTAS DE TRANSAÇÕES

/**
 * @swagger
 * /finance/{userId}/transactions:
 *   post:
 *     summary: Criar nova transação (receita ou despesa)
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - category
 *               - amount
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 example: income
 *               category:
 *                 type: string
 *                 example: alimentação
 *               amount:
 *                 type: number
 *                 example: 150.75
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-21T14:00:00Z
 *               description:
 *                 type: string
 *                 example: almoço com amigos
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 */
router.post("/:userId/transactions", auth, financeController.createTransaction);

/**
 * @swagger
 * /finance/{userId}/transactions:
 *   get:
 *     summary: Listar transações do usuário com filtros opcionais
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtro
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtro
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoria da transação
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Tipo da transação
 *     responses:
 *       200:
 *         description: Lista de transações retornada com sucesso
 */
router.get("/:userId/transactions", auth, financeController.getTransactions);

/**
 * @swagger
 * /finance/{userId}/transactions/{id}:
 *   get:
 *     summary: Buscar detalhes de uma transação específica
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da transação retornados com sucesso
 */
router.get("/:userId/transactions/:id", auth, financeController.getTransactionById);

/**
 * @swagger
 * /finance/{userId}/transactions/{id}/duplicate:
 *   post:
 *     summary: Duplicar uma transação existente
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Transação duplicada com sucesso
 */
router.post("/:userId/transactions/:id/duplicate", auth, financeController.duplicateTransaction);

/**
 * @swagger
 * /finance/{userId}/transactions/{id}/attachments:
 *   post:
 *     summary: Fazer upload de anexos para uma transação
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Anexos enviados com sucesso
 */
router.post(
  "/:userId/transactions/:id/attachments",
  auth,
  upload.array("files", 10),
  financeController.uploadAttachments
);

/**
 * @swagger
 * /finance/{userId}/transactions/{id}/attachments:
 *   get:
 *     summary: Listar anexos de uma transação
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de anexos retornada com sucesso
 */
router.get("/:userId/transactions/:id/attachments", auth, financeController.getAttachments);

/**
 * @swagger
 * /finance/{userId}/transactions/{transactionId}/attachments/{attachmentId}:
 *   delete:
 *     summary: Excluir um anexo de uma transação
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Anexo excluído com sucesso
 *       404:
 *         description: Anexo não encontrado
 */
router.delete(
  "/:userId/transactions/:transactionId/attachments/:attachmentId",
  auth,
  financeController.deleteAttachment
);

/**
 * @swagger
 * /finance/{userId}/transactions/{id}/history:
 *   get:
 *     summary: Obter histórico de alterações de uma transação
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico retornado com sucesso
 */
router.get("/:userId/transactions/:id/history", auth, financeController.getTransactionHistory);

/**
 * @swagger
 * /finance/{userId}/transactions/{id}:
 *   patch:
 *     summary: Atualizar comentários e recorrência de uma transação
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *               recurring:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 */
router.patch("/:userId/transactions/:id", auth, financeController.updateCommentsAndRecurring);

// ROTAS DE METAS FINANCEIRAS

/**
 * @swagger
 * /finance/{userId}/goals:
 *   post:
 *     summary: Criar nova meta financeira
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - targetAmount
 *             properties:
 *               title:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Meta criada com sucesso
 */
router.post("/:userId/goals", auth, financeController.createGoal);

/**
 * @swagger
 * /finance/{userId}/goals:
 *   get:
 *     summary: Listar metas financeiras do usuário
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de metas retornada com sucesso
 */
router.get("/:userId/goals", auth, financeController.getGoals);

/**
 * @swagger
 * /finance/{userId}/goals/{goalId}:
 *   patch:
 *     summary: Atualizar progresso de uma meta financeira
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amountToAdd
 *             properties:
 *               amountToAdd:
 *                 type: number
 *     responses:
 *       200:
 *         description: Progresso da meta atualizado com sucesso
 */
router.patch("/:userId/goals/:goalId", auth, financeController.updateGoalProgress);

/**
 * @swagger
 * /finance/{userId}/goals/{goalId}/history:
 *   get:
 *     summary: Obter histórico completo de aportes e remoções de uma meta financeira
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico da meta financeira retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   goalId:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   amount:
 *                     type: number
 *                   cumulativeAmount:
 *                     type: number
 */
router.get("/:userId/goals/:goalId/history", auth, financeController.getGoalHistory);

// OUTRAS ROTAS

/**
 * @swagger
 * /finance/{userId}/vida-score:
 *   get:
 *     summary: Obter o V.I.D.A. Score do usuário
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: V.I.D.A. Score retornado com sucesso
 */
router.get("/:userId/vida-score", auth, financeController.getVidaScore);

/**
 * @swagger
 * /finance/{userId}/vida-score/history:
 *   get:
 *     summary: Obter histórico do V.I.D.A. Score
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico do V.I.D.A. Score retornado com sucesso
 */
router.get("/:userId/vida-score/history", auth, financeController.getVidaScoreHistory);

/**
 * @swagger
 * /finance/{userId}/reports:
 *   get:
 *     summary: Gerar relatório financeiro resumido para gráficos
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final
 *     responses:
 *       200:
 *         description: Relatório retornado com sucesso
 */
router.get("/:userId/reports", auth, financeController.getFinancialReport);

/**
 * @swagger
 * /finance/{userId}/alerts:
 *   get:
 *     summary: Listar alertas financeiros do usuário
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alertas retornados com sucesso
 */
router.get("/:userId/alerts", auth, financeController.getAlerts);

/**
 * @swagger
 * /finance/{userId}/transactions/{id}:
 *   delete:
 *     summary: Excluir uma transação específica
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transação excluída com sucesso
 *       404:
 *         description: Transação não encontrada
 */
router.delete("/:userId/transactions/:id", auth, financeController.deleteTransaction);

/**
 * @swagger
 * /finance/{userId}/goals/{goalId}:
 *   get:
 *     summary: Buscar detalhes de uma meta financeira específica
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: goalId
 *         required: true
 *         description: ID da meta financeira
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da meta retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 targetAmount:
 *                   type: number
 *                 currentAmount:
 *                   type: number
 *                 status:
 *                   type: string
 *                 deadline:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Meta não encontrada
 */
router.get("/:userId/goals/:goalId", auth, financeController.getGoalById);

/**
 * @swagger
 * /finance/{userId}/goals/{goalId}/remove:
 *   patch:
 *     summary: Remover aporte de uma meta financeira
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: goalId
 *         required: true
 *         description: ID da meta financeira
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amountToRemove
 *             properties:
 *               amountToRemove:
 *                 type: number
 *                 example: 100.50
 *     responses:
 *       200:
 *         description: Aporte removido e saldo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinancialGoal'
 *       400:
 *         description: Erro de validação (ex: valor inválido ou maior que aporte atual)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Não é possível remover mais do que o valor atual da meta.
 *       404:
 *         description: Meta financeira não encontrada
 */
router.patch("/:userId/goals/:goalId/remove", auth, financeController.removeGoalProgress);

/**
 * @swagger
 * /finance/{userId}/goals/{goalId}:
 *   patch:
 *     summary: Editar uma meta financeira (título, valor, prazo)
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: goalId
 *         required: true
 *         description: ID da meta financeira
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Nova meta financeira
 *               targetAmount:
 *                 type: number
 *                 example: 5000
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *     responses:
 *       200:
 *         description: Meta financeira atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinancialGoal'
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Meta financeira não encontrada
 */
router.patch("/:userId/goals/:goalId", auth, financeController.updateGoal);

/**
 * @swagger
 * /finance/{userId}/goals/{goalId}:
 *   delete:
 *     summary: Excluir uma meta financeira
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *       - in: path
 *         name: goalId
 *         required: true
 *         description: ID da meta financeira
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meta financeira excluída com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       404:
 *         description: Meta financeira não encontrada
 */
router.delete("/:userId/goals/:goalId", auth, financeController.deleteGoal);



module.exports = router;
