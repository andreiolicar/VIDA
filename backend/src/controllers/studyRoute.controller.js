const studyRouteService = require("../services/studyRoute.service");

module.exports = {
  createRoute: async (req, res) => {
    const { title, area, description, topics } = req.body;
    const userId = req.params.userId;

    try {
      const route = await studyRouteService.createStudyRoute(userId, title, area, description, topics);
      res.status(201).json({ route });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllRoutes: async (req, res) => {
    const userId = req.params.userId;
    const routes = await studyRouteService.getUserRoutes(userId);
    res.json(routes);
  },

  getRouteById: async (req, res) => {
    const id = req.params.id;
    const route = await studyRouteService.getRouteById(id);
    res.status(200).json(route);
  },

  updateTopicCompletion: async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
      const topic = await studyRouteService.updateTopicCompletion(id, completed);
      res.json({ message: "Status do tópico atualizado", topic });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateRoute: async (req, res) => {
    const { id } = req.params;
    const { favorite } = req.body;

    try {
      const route = await studyRouteService.updateRouteFavoriteStatus(id, favorite);
      res.json({ message: "Trilha atualizada", route });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteRoute: async (req, res) => {
    const { id } = req.params;
    try {
      await studyRouteService.deleteRoute(id);
      res.json({ message: "Trilha excluída com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
