const axios = require("axios");
const { StudyRoute, StudyTopic, User } = require("../models");
const sendNewStudyRouteEmail = require("../emails/studyRouteEmail");

const generateRoadmapWithIA = async ({ title, area, description, topics }) => {
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
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error("Erro ao gerar roadmap com IA:", error?.response?.data || error.message);
    return '';
  }
};

const createStudyRoute = async (userId, title, area, description, topics) => {
  if (!userId || !title || !area || !description || !topics?.length) {
    throw new Error("Preencha todos os campos obrigatórios e adicione ao menos um tópico.");
  }

  const roadmap = await generateRoadmapWithIA({ title, area, description, topics });

  const newRoute = await StudyRoute.create({ title, area, description, roadmap, userId });

  const topicEntries = topics.map((t) => ({
    title: t,
    routeId: newRoute.id,
  }));
  await StudyTopic.bulkCreate(topicEntries);

  const routeWithTopics = await StudyRoute.findByPk(newRoute.id, {
    include: ["topics"],
  });

  const user = await User.findByPk(userId);

  try {
    await sendNewStudyRouteEmail({
      name: user.name,
      email: user.email,
      title,
      area,
      description,
      topics,
    });
    console.log("E-mail de nova trilha enviado para:", user.email);
  } catch (err) {
    console.error("Erro ao enviar e-mail de trilha:", err.message);
  }

  return routeWithTopics;
};

const getUserRoutes = async (userId) => {
  return StudyRoute.findAll({ where: { userId }, include: ["topics"] });
};

const getRouteById = async (id) => {
  return StudyRoute.findByPk(id, { include: ["topics"] });
};

const updateTopicCompletion = async (id, completed) => {
  const topic = await StudyTopic.findByPk(id);
  if (!topic) throw new Error("Tópico não encontrado");
  topic.completed = completed;
  await topic.save();
  return topic;
};

const updateRouteFavoriteStatus = async (id, favorite) => {
  const route = await StudyRoute.findByPk(id);
  if (!route) throw new Error("Trilha não encontrada");
  route.favorite = typeof favorite === "boolean" ? favorite : route.favorite;
  await route.save();
  return route;
};

const deleteRoute = async (id) => {
  await StudyTopic.destroy({ where: { routeId: id } });
  await StudyRoute.destroy({ where: { id } });
};

module.exports = {
  createStudyRoute,
  getUserRoutes,
  getRouteById,
  updateTopicCompletion,
  updateRouteFavoriteStatus,
  deleteRoute,
};
