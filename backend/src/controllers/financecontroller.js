const db = require("../models");
const {
  Transaction,
  FinancialGoal,
  VidaScore,
  Alert,
  VidaScoreHistory,
  TransactionAttachment,
  TransactionHistory,
} = db;
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const filename = `${basename}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Criar uma nova transação (receita ou despesa)
const createTransaction = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { type, category, amount, date, description, comments, recurring } = req.body;

  if (!userId || !type || !category || !amount || !date) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
  }
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Valor inválido para amount." });
  }

  try {
    const transaction = await Transaction.create({
      userId,
      type,
      category,
      amount,
      date,
      description,
      comments: comments || null,
      recurring: recurring || false,
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    res.status(500).json({
      message: "Erro ao criar transação.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Listar transações do usuário com filtros opcionais (data, categoria, tipo)
const getTransactions = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { startDate, endDate, category, type } = req.query;

  if (!userId) return res.status(400).json({ message: "UserId obrigatório." });

  const where = { userId };

  if (startDate && endDate) {
    where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
  }
  if (category) where.category = category;
  if (type) where.type = type;

  try {
    const transactions = await Transaction.findAll({ where, order: [["date", "DESC"]] });
    res.json(transactions);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    res.status(500).json({
      message: "Erro ao buscar transações.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Buscar detalhes de uma transação específica pelo ID
const getTransactionById = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const transactionId = parseInt(req.params.id, 10);

  if (!userId || !transactionId) {
    return res.status(400).json({ message: "Parâmetros inválidos." });
  }

  try {
    const transaction = await Transaction.findOne({ where: { id: transactionId, userId } });
    if (!transaction) return res.status(404).json({ message: "Transação não encontrada." });
    res.json(transaction);
  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    res.status(500).json({ message: "Erro ao buscar transação." });
  }
};

// Duplicar uma transação existente
const duplicateTransaction = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const transactionId = parseInt(req.params.id, 10);

  if (!userId || !transactionId) {
    return res.status(400).json({ message: "Parâmetros inválidos." });
  }

  try {
    const original = await Transaction.findOne({ where: { id: transactionId, userId } });
    if (!original) return res.status(404).json({ message: "Transação original não encontrada." });

    const duplicate = await Transaction.create({
      userId,
      type: original.type,
      category: original.category,
      amount: original.amount,
      date: new Date(),
      description: original.description,
      comments: original.comments,
      recurring: original.recurring,
    });

    res.status(201).json(duplicate);
  } catch (error) {
    console.error("Erro ao duplicar transação:", error);
    res.status(500).json({ message: "Erro ao duplicar transação." });
  }
};

// Upload de anexos para uma transação
const uploadAttachments = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const transactionId = parseInt(req.params.id, 10);

  if (!userId || !transactionId) return res.status(400).json({ message: "Parâmetros inválidos." });
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: "Nenhum arquivo enviado." });

  try {
    const attachments = await Promise.all(
      req.files.map((file) =>
        TransactionAttachment.create({
          transactionId,
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileType: file.mimetype,
        })
      )
    );
    res.status(201).json(attachments);
  } catch (error) {
    console.error("Erro ao enviar anexos:", error);
    res.status(500).json({ message: "Erro ao enviar anexos." });
  }
};

// Listar anexos de uma transação
const getAttachments = async (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  try {
    const attachments = await TransactionAttachment.findAll({ where: { transactionId } });
    res.json(attachments);
  } catch (error) {
    console.error("Erro ao buscar anexos:", error);
    res.status(500).json({ message: "Erro ao buscar anexos." });
  }
};

// Excluir anexo de uma transação
const deleteAttachment = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const transactionId = parseInt(req.params.transactionId, 10);
  const attachmentId = parseInt(req.params.attachmentId, 10);

  if (!userId || !transactionId || !attachmentId) {
    return res.status(400).json({ message: "Parâmetros inválidos." });
  }

  try {
    const attachment = await TransactionAttachment.findOne({
      where: { id: attachmentId, transactionId },
      include: [{
        model: Transaction,
        as: 'transaction',
        where: { userId }
      }]
    });

    if (!attachment) {
      return res.status(404).json({ message: "Anexo não encontrado." });
    }

    const filePath = path.join(uploadPath, path.basename(attachment.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await attachment.destroy();

    res.json({ message: "Anexo excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir anexo:", error);
    res.status(500).json({ message: "Erro ao excluir anexo." });
  }
};

// Buscar histórico de alterações de uma transação
const getTransactionHistory = async (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  try {
    const history = await TransactionHistory.findAll({
      where: { transactionId },
      order: [["changedAt", "DESC"]],
    });
    res.json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ message: "Erro ao buscar histórico." });
  }
};

// Atualizar comentários e recorrência de uma transação
const updateCommentsAndRecurring = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const transactionId = parseInt(req.params.id, 10);
  const { comments, recurring } = req.body;

  if (!userId || !transactionId) return res.status(400).json({ message: "Parâmetros inválidos." });

  try {
    const transaction = await Transaction.findOne({ where: { id: transactionId, userId } });
    if (!transaction) return res.status(404).json({ message: "Transação não encontrada." });

    transaction.comments = comments !== undefined ? comments : transaction.comments;
    transaction.recurring = recurring !== undefined ? recurring : transaction.recurring;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    res.status(500).json({ message: "Erro ao atualizar transação." });
  }
};

// Criar nova meta financeira
const createGoal = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { title, targetAmount, deadline } = req.body;

  if (!userId || !title || !targetAmount) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
  }
  if (isNaN(targetAmount) || targetAmount <= 0) {
    return res.status(400).json({ message: "Valor inválido para targetAmount." });
  }

  try {
    const goal = await FinancialGoal.create({
      userId,
      title,
      targetAmount,
      deadline,
      currentAmount: 0,
      status: "active",
    });
    res.status(201).json(goal);
  } catch (error) {
    console.error("Erro ao criar meta financeira:", error);
    res.status(500).json({
      message: "Erro ao criar meta financeira.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Listar metas financeiras do usuário
const getGoals = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (!userId) return res.status(400).json({ message: "UserId obrigatório." });

  try {
    const goals = await FinancialGoal.findAll({ where: { userId }, order: [["deadline", "ASC"]] });
    res.json(goals);
  } catch (error) {
    console.error("Erro ao buscar metas:", error);
    res.status(500).json({
      message: "Erro ao buscar metas financeiras.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Atualizar progresso da meta financeira (ex: adicionar valor poupado)
const updateGoalProgress = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const goalId = parseInt(req.params.goalId, 10);
  const { amountToAdd } = req.body;

  if (!userId || !goalId || amountToAdd === undefined) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
  }
  if (isNaN(amountToAdd)) {
    return res.status(400).json({ message: "Valor inválido para amountToAdd." });
  }

  try {
    const goal = await FinancialGoal.findOne({ where: { id: goalId, userId } });
    if (!goal) return res.status(404).json({ message: "Meta não encontrada." });

    goal.currentAmount += parseFloat(amountToAdd);

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error("Erro ao atualizar meta:", error);
    res.status(500).json({
      message: "Erro ao atualizar meta financeira.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Calcular e retornar o V.I.D.A. Score do usuário
const getVidaScore = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (!userId) return res.status(400).json({ message: "UserId obrigatório." });

  try {
    let vidaScore = await VidaScore.findOne({ where: { userId } });

    if (!vidaScore) {
      const scoreValue = await calculateVidaScore(userId);
      vidaScore = await VidaScore.create({
        userId,
        score: scoreValue,
        lastCalculatedAt: new Date(),
      });

      await VidaScoreHistory.create({
        userId,
        score: scoreValue,
        recordedAt: new Date(),
      });
    } else {
      const oneDay = 24 * 60 * 60 * 1000;
      if (new Date() - new Date(vidaScore.lastCalculatedAt) > oneDay) {
        const newScore = await calculateVidaScore(userId);
        vidaScore.score = newScore;
        vidaScore.lastCalculatedAt = new Date();
        await vidaScore.save();

        await VidaScoreHistory.create({
          userId,
          score: newScore,
          recordedAt: new Date(),
        });
      }
    }

    res.json({ vidaScore: vidaScore.score });
  } catch (error) {
    console.error("Erro ao obter V.I.D.A. Score:", error);
    res.status(500).json({
      message: "Erro ao obter V.I.D.A. Score.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Buscar histórico do V.I.D.A. Score
const getVidaScoreHistory = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (!userId) return res.status(400).json({ message: "UserId obrigatório." });

  try {
    const history = await VidaScoreHistory.findAll({
      where: { userId },
      order: [["recordedAt", "ASC"]],
      attributes: ["score", ["recordedAt", "date"]],
    });

    const formatted = history.map((entry) => ({
      date: entry.date.toISOString().split("T")[0],
      score: entry.score,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar histórico do V.I.D.A. Score:", error);
    res.status(500).json({
      message: "Erro ao buscar histórico do V.I.D.A. Score.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Gerar relatório financeiro resumido para gráficos
const getFinancialReport = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { startDate, endDate } = req.query;

  if (!userId) return res.status(400).json({ message: "UserId obrigatório." });

  const where = { userId };
  if (startDate && endDate) {
    where.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
  }

  try {
    const transactions = await Transaction.findAll({ where });

    const summary = transactions.reduce((acc, t) => {
      const key = `${t.type}-${t.category}`;
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {});

    res.json({ summary });
  } catch (error) {
    console.error("Erro ao gerar relatório financeiro:", error);
    res.status(500).json({
      message: "Erro ao gerar relatório financeiro.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Listar alertas financeiros do usuário
const getAlerts = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (!userId) return res.status(400).json({ message: "UserId obrigatório." });

  try {
    const alerts = await Alert.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
    res.json(alerts);
  } catch (error) {
    console.error("Erro ao buscar alertas:", error);
    res.status(500).json({
      message: "Erro ao buscar alertas financeiros.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Função para calcular o V.I.D.A. Score (exemplo simplificado)
const calculateVidaScore = async (userId) => {
  const transactions = await Transaction.findAll({ where: { userId } });
  const goals = await FinancialGoal.findAll({ where: { userId } });

  let income = transactions.reduce((acc, t) => (t.type === "income" ? acc + t.amount : acc), 0);
  let expense = transactions.reduce((acc, t) => (t.type === "expense" ? acc + t.amount : acc), 0);

  const netBalance = income - expense;

  let goalProgress = 0;
  if (goals.length > 0) {
    goalProgress = goals.reduce((acc, g) => acc + g.currentAmount / g.targetAmount, 0) / goals.length;
  }

  let score = 50;

  if (netBalance > 0) score += Math.min(netBalance / 1000, 30);
  else score -= Math.min(Math.abs(netBalance) / 1000, 30);

  score += goalProgress * 20;

  score = Math.max(0, Math.min(100, score));

  return score;
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  duplicateTransaction,
  uploadAttachments,
  getAttachments,
  deleteAttachment,
  getTransactionHistory,
  updateCommentsAndRecurring,
  createGoal,
  getGoals,
  updateGoalProgress,
  getVidaScore,
  getVidaScoreHistory,
  getFinancialReport,
  getAlerts,
  upload,
};
