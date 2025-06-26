const axios = require('axios');
const nodemailer = require('nodemailer');
const { Health, User } = require('../models');

async function generateHealthRoadmapWithIA({ title, description }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = `
Você é um assistente de saúde mental e bem-estar. Crie um plano detalhado e progressivo de autocuidado, incluindo práticas para saúde emocional, check-ins diários, hábitos de bem-estar e dicas para lidar com emoções difíceis.

Título: ${title}
Descrição: ${description}

Responda em português do Brasil, no formato markdown.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Erro ao gerar plano de saúde com IA:', error?.response?.data || error.message);
    return '';
  }
}

module.exports = {
  // Criar nova rota/plano de saúde
  createHealthPlan: async (req, res) => {
    const { title, description } = req.body;
    const userId = req.params.userId;

    if (!userId || !title || !description) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
    }

    const roadmap = await generateHealthRoadmapWithIA({ title, description });
    console.log('Plano de saúde gerado:', roadmap);

    try {
      const newHealthPlan = await Health.create({
        title,
        description,
        roadmap,
        userId,
        moodEntries: [], // começa vazio
        habits: [], // começa vazio
      });

      const user = await User.findByPk(userId);

      // Configura envio de email de boas-vindas
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: '"Vida Notificações" <vida.app@gmail.com>',
        to: user.email,
        subject: '🎉 Seu plano de saúde mental foi criado!',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #102a7d;">Olá, ${user.name}!</h2>
            <p>Seu novo plano de saúde mental e bem-estar foi criado com sucesso.</p>
            <p><strong>Título:</strong> ${title}</p>
            <p><strong>Descrição:</strong> ${description}</p>
            <p>Confira as etapas e recomendações para cuidar da sua saúde emocional e física.</p>
            <p>Conte sempre conosco para apoiar seu autocuidado!</p>
            <p>Abraços,<br><strong>Equipe VIDA</strong></p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail:', error);
        } else {
          console.log('E-mail enviado:', info.response);
        }
      });

      res.status(201).json({ healthPlan: newHealthPlan });
    } catch (error) {
      console.error('Erro ao criar plano de saúde:', error);
      res.status(500).json({ message: 'Erro ao criar plano de saúde.', error: error.message });
    }
  },

  // Listar todos planos de saúde do usuário
  getAllHealthPlans: async (req, res) => {
    const userId = req.params.userId;

    try {
      const plans = await Health.findAll({ where: { userId } });
      res.json(plans);
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      res.status(500).json({ message: 'Erro ao listar planos.', error: error.message });
    }
  },

  // Buscar plano específico pelo id
  getHealthPlanById: async (req, res) => {
    const id = req.params.id;

    try {
      const plan = await Health.findByPk(id);
      if (!plan) return res.status(404).json({ message: 'Plano não encontrado' });

      res.json(plan);
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      res.status(500).json({ message: 'Erro ao buscar plano.', error: error.message });
    }
  },

  // Adicionar entrada de humor / check-in emocional
  addMoodEntry: async (req, res) => {
    const { healthPlanId } = req.params;
    const { date, mood, notes } = req.body;

    if (!date || !mood) {
      return res.status(400).json({ message: 'Data e humor são obrigatórios.' });
    }

    try {
      const plan = await Health.findByPk(healthPlanId);
      if (!plan) return res.status(404).json({ message: 'Plano não encontrado' });

      const moodEntries = plan.moodEntries || [];
      moodEntries.push({ date, mood, notes });

      plan.moodEntries = moodEntries;
      await plan.save();

      res.json({ message: 'Entrada de humor adicionada', moodEntries });
    } catch (error) {
      console.error('Erro ao adicionar entrada de humor:', error);
      res.status(500).json({ message: 'Erro ao adicionar entrada de humor.', error: error.message });
    }
  },

  // Atualizar hábitos de bem-estar
  updateHabits: async (req, res) => {
    const { healthPlanId } = req.params;
    const { habits } = req.body; // espera array de hábitos

    if (!Array.isArray(habits)) {
      return res.status(400).json({ message: 'Habits deve ser um array.' });
    }

    try {
      const plan = await Health.findByPk(healthPlanId);
      if (!plan) return res.status(404).json({ message: 'Plano não encontrado' });

      plan.habits = habits;
      await plan.save();

      res.json({ message: 'Hábitos atualizados', habits });
    } catch (error) {
      console.error('Erro ao atualizar hábitos:', error);
      res.status(500).json({ message: 'Erro ao atualizar hábitos.', error: error.message });
    }
  },

  // Atualizar plano de saúde (ex: título, descrição)
  updateHealthPlan: async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const plan = await Health.findByPk(id);
      if (!plan) return res.status(404).json({ message: 'Plano não encontrado' });

      if (title) plan.title = title;
      if (description) plan.description = description;

      await plan.save();

      res.json({ message: 'Plano atualizado', plan });
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      res.status(500).json({ message: 'Erro ao atualizar plano.', error: error.message });
    }
  },

  // Deletar plano de saúde
  deleteHealthPlan: async (req, res) => {
    const { id } = req.params;

    try {
      await Health.destroy({ where: { id } });
      res.json({ message: 'Plano deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar plano:', error);
      res.status(500).json({ message: 'Erro ao deletar plano.', error: error.message });
    }
  },
};
