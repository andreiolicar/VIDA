const axios = require('axios');
const { Health, User } = require('../models');
const sendHealthPlanCreatedEmail = require('../emails/healthPlanEmail');

async function generateHealthRoadmapWithIA({ title, description }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = `
Você é um assistente de saúde mental e bem-estar. Crie um plano detalhado e progressivo de autocuidado, incluindo práticas para saúde emocional, check-ins diários, hábitos de bem-estar e dicas para lidar com emoções difíceis.

Título: ${title}
Descrição: ${description}

Responda em português do Brasil, no formato markdown.
`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    { contents: [{ parts: [{ text: prompt }] }] }
  );

  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

module.exports = {
  async createHealthPlan(req) {
    const { title, description } = req.body;
    const userId = req.params.userId;

    if (!userId || !title || !description) {
      throw new Error('Preencha todos os campos obrigatórios.');
    }

    const roadmap = await generateHealthRoadmapWithIA({ title, description });

    const newHealthPlan = await Health.create({
      title,
      description,
      roadmap,
      userId,
      moodEntries: [],
      habits: [],
    });

    const user = await User.findByPk(userId);
    if (user) {
      await sendHealthPlanCreatedEmail(user.name, user.email, title, description);
    }

    return newHealthPlan;
  },

  async getAllHealthPlans(req) {
    const userId = req.params.userId;
    return await Health.findAll({ where: { userId } });
  },

  async getHealthPlanById(req) {
    const { id } = req.params;
    return await Health.findByPk(id);
  },

  async addMoodEntry(req) {
    const { healthPlanId } = req.params;
    const { date, mood, notes } = req.body;

    if (!date || !mood) {
      throw new Error('Data e humor são obrigatórios.');
    }

    const plan = await Health.findByPk(healthPlanId);
    if (!plan) throw new Error('Plano não encontrado');

    const moodEntries = plan.moodEntries || [];
    moodEntries.push({ date, mood, notes });

    plan.moodEntries = moodEntries;
    await plan.save();

    return { message: 'Entrada de humor adicionada', moodEntries };
  },

  async updateHabits(req) {
    const { healthPlanId } = req.params;
    const { habits } = req.body;

    if (!Array.isArray(habits)) {
      throw new Error('Habits deve ser um array.');
    }

    const plan = await Health.findByPk(healthPlanId);
    if (!plan) throw new Error('Plano não encontrado');

    plan.habits = habits;
    await plan.save();

    return { message: 'Hábitos atualizados', habits };
  },

  async updateHealthPlan(req) {
    const { id } = req.params;
    const { title, description } = req.body;

    const plan = await Health.findByPk(id);
    if (!plan) return null;

    if (title) plan.title = title;
    if (description) plan.description = description;

    await plan.save();
    return { message: 'Plano atualizado', plan };
  },

  async deleteHealthPlan(req) {
    const { id } = req.params;
    await Health.destroy({ where: { id } });
  },
};
