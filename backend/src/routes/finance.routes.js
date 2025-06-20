const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const financeController = require("../controllers/financecontroller");
const { upload } = require("../controllers/financecontroller"); // importa o multer configurado

/**
 * @swagger
 * tags:
 *   name: Finanças
 *   description: Gerenciamento financeiro do usuário
 */

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
 *         schema:
 *           type: integer
 *         description: ID do usuário
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
 *                 description: Tipo da transação ('income' ou 'expense')
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
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
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data inicial para filtro
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
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
 *         description: Tipo da transação ('income' ou 'expense')
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
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
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
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação a ser duplicada
 *     responses:
 *       201:
 *         description: Transação duplicada com sucesso
 */
router.post("/:userId/transactions/:id/duplicate", auth, financeController.duplicateTransaction);

/**
 * @swagger
 * /finance/{userId}/transactions/{id}/attachments:
 *   post:
 *     summary: Upload de anexos para uma transação
 *     tags: [Finanças]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
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
 *         description: ID da transação
 *       - in: formData
 *         name: files
 *         type: array
 *         items:
 *           type: string
 *           format: binary
 *         description: Arquivos para upload
 *         required: true
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
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
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
 *         description: ID da transação
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
 *       required: true
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
 *       required: true
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
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Meta financeira criada com sucesso
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
 *         description: Meta financeira atualizada com sucesso
 */
router.patch("/:userId/goals/:goalId", auth, financeController.updateGoalProgress);

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
 *     summary: Obter histórico do V.I.D.A. Score do usuário
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
 *           format: date-time
 *         description: Data inicial para filtro
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data final para filtro
 *     responses:
 *       200:
 *         description: Relatório financeiro retornado com sucesso
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
 *         description: Alertas financeiros retornados com sucesso
 */
router.get("/:userId/alerts", auth, financeController.getAlerts);

module.exports = router;
