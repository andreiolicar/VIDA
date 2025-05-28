const nodemailer = require("nodemailer");
const axios = require('axios');
const { StudyRoute, StudyTopic, User } = require("../models");

async function generateRoadmapWithIA({ title, area, description, topics }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = `
Você é um assistente educacional. Crie um roadmap de estudos detalhado, organizado em etapas, para a seguinte trilha:

Título: ${title}
Área: ${area}
Descrição: ${description}
Tópicos principais: ${topics.join(', ')}

O roadmap deve ser prático, progressivo e motivador, com dicas, sugestões de recursos e boas práticas. Responda em português do Brasil, no formato markdown.
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
    console.error('Erro ao gerar roadmap com IA:', error?.response?.data || error.message);
    return '';
  }
}

module.exports = {
  createRoute: async (req, res) => {
    const { title, area, description, topics } = req.body;
    const userId = req.params.userId;

    if (
      !userId ||
      !title ||
      !area ||
      !description ||
      !topics ||
      topics.length === 0
    ) {
      return res.status(400).json({
        message:
          "Preencha todos os campos obrigatórios e adicione ao menos um tópico.",
      });
    }

    const roadmap = await generateRoadmapWithIA({ title, area, description, topics });
    console.log('Roadmap gerado:', roadmap);

    try {
      const newRoute = await StudyRoute.create({
        title,
        area,
        description,
        roadmap,
        userId,
      });

      const topicEntries = topics.map((t) => ({
        title: t,
        routeId: newRoute.id,
      }));
      await StudyTopic.bulkCreate(topicEntries);

      const routeWithTopics = await StudyRoute.findByPk(newRoute.id, {
        include: ["topics"],
      });

      const user = await User.findByPk(userId);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: '"Vida Notificações" <vida.app@gmail.com>',
        to: user.email,
        subject: "🎉 Sua nova Rota de Estudo foi criada!",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color:rgba(1, 40, 184, 0.86);">Olá, ${user.name}!</h2>
            <p>Você acabou de criar uma nova <strong>Rota de Estudo</strong>!</p>
            <p><strong>Título:</strong> ${title}</p>
            <p><strong>Área:</strong> ${area}</p>
            <p><strong>Descrição:</strong> ${description}</p>
            <p><strong>Etapas:</strong></p>
            <ul>
              ${topics.map((topic) => `<li>${topic}</li>`).join("")}
            </ul>
            <p>Explore e estude cada tópico para concluir sua jornada!</p>
            <p>Qualquer dúvida, estamos à disposição.</p>
            <p>Abraços,<br><strong>Equipe VIDA</strong></p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erro ao enviar e-mail de confirmação:", error);
          return res.status(500).json({
            message: "Erro ao enviar e-mail de confirmação",
            error: error.message,
          });
        } else {
          console.log("E-mail de confirmação enviado:", info.response);
        }
      });

      res.status(201).json({ route: routeWithTopics });
    } catch (error) {
      console.error("Erro ao criar trilha de estudos:", error);
      res.status(500).json({
        message: "Erro ao criar a trilha de estudos.",
        error: error.message,
      });
    }
  },

  getAllRoutes: async (req, res) => {
    const userId = req.params.userId;
    const routes = await StudyRoute.findAll({
      where: { userId },
      include: ["topics"],
    });
    res.json(routes);
  },

  getRouteById: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const route = await StudyRoute.findByPk(id, { include: ["topics"] });

    res.status(200).json(route);
  },

  updateTopicCompletion: async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
      const topic = await StudyTopic.findByPk(id);
      if (!topic)
        return res.status(404).json({ message: "Tópico não encontrado" });

      topic.completed = completed;
      await topic.save();

      res.json({ message: "Status do tópico atualizado", topic });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao atualizar status do tópico" });
    }
  },

  updateRoute: async (req, res) => {
    const { id } = req.params;
    const { favorite } = req.body;

    try {
      const route = await StudyRoute.findByPk(id);
      if (!route)
        return res.status(404).json({ message: "Trilha não encontrada" });

      if (typeof favorite === "boolean") {
        route.favorite = favorite;
      }

      await route.save();

      res.json({ message: "Trilha atualizada", route });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao atualizar trilha" });
    }
  },

  deleteRoute: async (req, res) => {
    const { id } = req.params;
    try {
      await StudyTopic.destroy({ where: { routeId: id } });

      await StudyRoute.destroy({ where: { id } });
      res.json({ message: "Trilha excluída com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao excluir trilha" });
    }
  },
};
