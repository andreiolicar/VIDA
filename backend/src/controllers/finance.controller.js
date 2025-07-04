const db = require("../models");
const {
  Transaction,
  FinancialGoal,
  FinancialGoalHistory,
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

// --- TRANSAÇÕES ---

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

const deleteTransaction = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const transactionId = parseInt(req.params.id, 10);

  if (!userId || !transactionId) {
    return res.status(400).json({ message: "Parâmetros inválidos." });
  }

  try {
    const transaction = await Transaction.findOne({ where: { id: transactionId, userId } });

    if (!transaction) {
      return res.status(404).json({ message: "Transação não encontrada." });
    }

    await transaction.destroy();

    res.status(200).json({ message: "Transação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    res.status(500).json({ message: "Erro ao excluir transação." });
  }
};

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

const updateTransaction = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const transactionId = parseInt(req.params.id, 10);
  const { type, category, amount, date, description, comments, recurring } = req.body;

  if (!userId || !transactionId) return res.status(400).json({ message: "Parâmetros inválidos." });

  try {
    const transaction = await Transaction.findOne({ where: { id: transactionId, userId } });
    if (!transaction) return res.status(404).json({ message: "Transação não encontrada." });

    if (type !== undefined) transaction.type = type;
    if (category !== undefined) transaction.category = category;
    if (amount !== undefined) transaction.amount = amount;
    if (date !== undefined) transaction.date = date;
    if (description !== undefined) transaction.description = description;
    if (comments !== undefined) transaction.comments = comments;
    if (recurring !== undefined) transaction.recurring = recurring;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    res.status(500).json({ message: "Erro ao atualizar transação." });
  }
};

// --- METAS FINANCEIRAS ---

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

const getGoalById = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const goalId = parseInt(req.params.goalId, 10);

  if (!userId || !goalId) {
    return res.status(400).json({ message: "Parâmetros inválidos." });
  }

  try {
    const goal = await FinancialGoal.findOne({ where: { id: goalId, userId } });
    if (!goal) return res.status(404).json({ message: "Meta não encontrada." });
    res.json(goal);
  } catch (error) {
    console.error("Erro ao buscar meta financeira:", error);
    res.status(500).json({ message: "Erro ao buscar meta financeira." });
  }
};

const updateGoal = async (req, res) => {
  console.log("=== updateGoal chamado ===");
  console.log("Parâmetros da URL:", req.params);
  console.log("Payload recebido:", req.body);

  const userId = parseInt(req.params.userId, 10);
  const goalId = parseInt(req.params.goalId, 10);
  const { title, targetAmount, deadline } = req.body;

  if (!userId || !goalId) {
    console.log("Parâmetros inválidos: userId ou goalId ausentes ou inválidos");
    return res.status(400).json({ message: "Parâmetros inválidos." });
  }

  const parsedTargetAmount = targetAmount !== undefined ? Number(targetAmount) : undefined;
  if (parsedTargetAmount !== undefined && (isNaN(parsedTargetAmount) || parsedTargetAmount <= 0)) {
    console.log("targetAmount inválido:", targetAmount);
    return res.status(400).json({ message: "Valor inválido para targetAmount." });
  }

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  try {
    const goal = await FinancialGoal.findOne({ where: { id: goalId, userId } });
    if (!goal) {
      console.log("Meta financeira não encontrada para id:", goalId, "e userId:", userId);
      return res.status(404).json({ message: "Meta não encontrada." });
    }

    if (title !== undefined) goal.title = String(title).trim();
    if (parsedTargetAmount !== undefined) goal.targetAmount = parsedTargetAmount;

    if (deadline !== undefined) {
      if (deadline === null || deadline === '' || !isValidDate(deadline)) {
        goal.deadline = null;
      } else {
        goal.deadline = new Date(deadline);
      }
    }

    await goal.save();
    console.log("Meta atualizada com sucesso:", goal.toJSON());
    res.json(goal);
  } catch (error) {
    console.error("Erro ao atualizar meta financeira:", error);
    res.status(500).json({ message: "Erro ao atualizar meta financeira." });
  }
};

const deleteGoal = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const goalId = parseInt(req.params.goalId, 10);

  if (!userId || !goalId) return res.status(400).json({ message: "Parâmetros inválidos." });

  try {
    const goal = await FinancialGoal.findOne({ where: { id: goalId, userId } });
    if (!goal) return res.status(404).json({ message: "Meta não encontrada." });

    await goal.destroy();
    res.status(200).json({ message: "Meta excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir meta financeira:", error);
    res.status(500).json({ message: "Erro ao excluir meta financeira." });
  }
};

const updateGoalProgress = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const goalId = parseInt(req.params.goalId, 10);
  const { amountToAdd } = req.body;

  if (!userId || !goalId || amountToAdd === undefined) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
  }
  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    return res.status(400).json({ message: "Valor inválido para amountToAdd." });
  }

  try {
    const goal = await FinancialGoal.findOne({ where: { id: goalId, userId } });
    if (!goal) return res.status(404).json({ message: "Meta não encontrada." });

    const incomeSum = await Transaction.sum('amount', { where: { userId, type: 'income' } }) || 0;
    const expenseSum = await Transaction.sum('amount', { where: { userId, type: 'expense' } }) || 0;
    const saldoDisponivel = incomeSum - expenseSum;

    if (amountToAdd > saldoDisponivel) {
      return res.status(400).json({
        message: `Aporte maior que saldo disponível. Saldo atual: R$ ${saldoDisponivel.toFixed(2)}`
      });
    }

    const newCurrentAmount = goal.currentAmount + parseFloat(amountToAdd);
    if (newCurrentAmount > goal.targetAmount) {
      return res.status(400).json({
        message: `Aporte ultrapassa o saldo restante da meta. Saldo disponível para a meta: R$ ${(goal.targetAmount - goal.currentAmount).toFixed(2)}`
      });
    }

    const newStatus = newCurrentAmount >= goal.targetAmount ? "completed" : "active";

    await goal.update({
      currentAmount: newCurrentAmount,
      status: newStatus,
    });

    await Transaction.create({
      userId,
      type: 'expense',
      category: 'Aporte em meta financeira',
      amount: amountToAdd,
      date: new Date(),
      description: `Aporte para meta: ${goal.title}`,
      comments: null,
      recurring: false,
    });

    const lastHistory = await FinancialGoalHistory.findOne({
      where: { goalId },
      order: [["date", "DESC"], ["id", "DESC"]],
    });
    const lastCumulative = lastHistory ? lastHistory.cumulativeAmount : 0;
    const newCumulative = lastCumulative + parseFloat(amountToAdd);

    await FinancialGoalHistory.create({
      goalId,
      date: new Date(),
      amount: parseFloat(amountToAdd),
      cumulativeAmount: newCumulative,
    });

    res.json(goal);
  } catch (error) {
    console.error("Erro ao atualizar meta:", error);
    res.status(500).json({
      message: "Erro ao atualizar meta financeira.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const removeGoalProgress = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const goalId = parseInt(req.params.goalId, 10);
  const { amountToRemove } = req.body;

  if (!userId || !goalId || amountToRemove === undefined) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
  }
  if (isNaN(amountToRemove) || amountToRemove <= 0) {
    return res.status(400).json({ message: "Valor inválido para amountToRemove." });
  }

  try {
    const goal = await FinancialGoal.findOne({ where: { id: goalId, userId } });
    if (!goal) return res.status(404).json({ message: "Meta não encontrada." });

    if (amountToRemove > goal.currentAmount) {
      return res.status(400).json({ message: "Não é possível remover mais do que o valor atual da meta." });
    }

    const newCurrentAmount = goal.currentAmount - amountToRemove;
    const newStatus = newCurrentAmount >= goal.targetAmount ? "completed" : "active";

    await goal.update({
      currentAmount: newCurrentAmount,
      status: newStatus,
    });

    await Transaction.create({
      userId,
      type: 'income',
      category: 'Reembolso de aporte',
      amount: amountToRemove,
      date: new Date(),
      description: `Remoção de aporte da meta ${goal.title}`,
      comments: null,
      recurring: false,
    });

    const lastHistory = await FinancialGoalHistory.findOne({
      where: { goalId },
      order: [["date", "DESC"], ["id", "DESC"]],
    });
    const lastCumulative = lastHistory ? lastHistory.cumulativeAmount : 0;
    const newCumulative = lastCumulative - amountToRemove;

    await FinancialGoalHistory.create({
      goalId,
      date: new Date(),
      amount: -amountToRemove,
      cumulativeAmount: newCumulative,
    });

    res.json(goal);
  } catch (error) {
    console.error("Erro ao remover aporte da meta:", error);
    res.status(500).json({
      message: "Erro ao remover aporte da meta.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getGoalHistory = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const goalId = parseInt(req.params.goalId, 10);

  if (!userId || !goalId) {
    return res.status(400).json({ message: "Parâmetros inválidos." });
  }

  try {
    const goal = await FinancialGoal.findOne({ where: { id: goalId, userId } });
    if (!goal) return res.status(404).json({ message: "Meta não encontrada." });

    const history = await FinancialGoalHistory.findAll({
      where: { goalId },
      order: [["date", "ASC"], ["id", "ASC"]],
    });

    res.json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico da meta:", error);
    res.status(500).json({ message: "Erro ao buscar histórico da meta." });
  }
};

// --- VIDA SCORE ---

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

const getVidaScoreHistory = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (!userId) return res.status(400).json({ message: "UserId obrigatório." });

  try {
    const history = await VidaScoreHistory.findAll({
      where: { userId },
      order: [["recordedAt", "ASC"]],
      attributes: ["score", "recordedAt"],
    });

    const formatted = history.map((entry) => {
      const dateObj = new Date(entry.recordedAt);
      return {
        date: !isNaN(dateObj) ? dateObj.toISOString().split("T")[0] : null,
        score: entry.score,
      };
    }).filter(item => item.date !== null);

    res.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar histórico do V.I.D.A. Score:", error);
    res.status(500).json({
      message: "Erro ao buscar histórico do V.I.D.A. Score.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// --- RELATÓRIOS E ALERTAS ---

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

// --- FUNÇÃO AUXILIAR ---

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
  deleteTransaction,
  uploadAttachments,
  getAttachments,
  deleteAttachment,
  getTransactionHistory,
  updateCommentsAndRecurring,
  updateTransaction,
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
  removeGoalProgress,
  getGoalHistory,
  getVidaScore,
  getVidaScoreHistory,
  getFinancialReport,
  getAlerts,
  upload,
};
