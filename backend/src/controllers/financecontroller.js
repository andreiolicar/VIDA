// controllers/financecontroller.js

const db = require("../models");
const { Transaction, FinancialGoal, VidaScore, Alert } = db;
const { Op } = require("sequelize");

// Inicialização da API Gemini (comente se não estiver configurada)
// const { GoogleGenAI } = require("@google/genai");
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Criar uma nova transação (receita ou despesa)
const createTransaction = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { type, category, amount, date, description } = req.body;

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

    // Atualiza status se meta atingida
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
    // Buscar score existente
    let vidaScore = await VidaScore.findOne({ where: { userId } });

    if (!vidaScore) {
      // Se não existir, calcular e criar um novo score
      const scoreValue = await calculateVidaScore(userId);
      vidaScore = await VidaScore.create({
        userId,
        score: scoreValue,
        lastCalculatedAt: new Date(),
      });
    } else {
      // Atualizar score se estiver desatualizado (> 1 dia)
      const oneDay = 24 * 60 * 60 * 1000;
      if (new Date() - new Date(vidaScore.lastCalculatedAt) > oneDay) {
        vidaScore.score = await calculateVidaScore(userId);
        vidaScore.lastCalculatedAt = new Date();
        await vidaScore.save();
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

// Função para calcular o V.I.D.A. Score (exemplo simplificado)
const calculateVidaScore = async (userId) => {
  // Buscar dados financeiros do usuário
  const transactions = await Transaction.findAll({ where: { userId } });
  const goals = await FinancialGoal.findAll({ where: { userId } });

  // Score baseado em saldo líquido, progresso nas metas e frequência de gastos excessivos
  let income = transactions.reduce((acc, t) => (t.type === "income" ? acc + t.amount : acc), 0);
  let expense = transactions.reduce((acc, t) => (t.type === "expense" ? acc + t.amount : acc), 0);

  const netBalance = income - expense;

  // Progresso médio das metas
  let goalProgress = 0;
  if (goals.length > 0) {
    goalProgress = goals.reduce((acc, g) => acc + g.currentAmount / g.targetAmount, 0) / goals.length;
  }

  // Score final (0 a 100)
  let score = 50; // base neutra

  // Ajusta score conforme saldo líquido (normalizado)
  if (netBalance > 0) score += Math.min(netBalance / 1000, 30);
  else score -= Math.min(Math.abs(netBalance) / 1000, 30);

  // Ajusta score conforme progresso nas metas
  score += goalProgress * 20;

  // Limita score entre 0 e 100
  score = Math.max(0, Math.min(100, score));

  return score;
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

    // Agrupar por categoria e tipo para gráfico
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

module.exports = {
  createTransaction,
  getTransactions,
  createGoal,
  getGoals,
  updateGoalProgress,
  getVidaScore,
  getFinancialReport,
  getAlerts,
};
