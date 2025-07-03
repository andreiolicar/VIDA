const healthService = require('../services/health.service');

module.exports = {
  createHealthPlan: async (req, res) => {
    try {
      const result = await healthService.createHealthPlan(req);
      res.status(201).json({ healthPlan: result });
    } catch (error) {
      console.error('Erro ao criar plano de saúde:', error);
      res.status(500).json({ message: error.message || 'Erro ao criar plano de saúde.' });
    }
  },

  getAllHealthPlans: async (req, res) => {
    try {
      const plans = await healthService.getAllHealthPlans(req);
      res.json(plans);
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      res.status(500).json({ message: error.message || 'Erro ao listar planos.' });
    }
  },

  getHealthPlanById: async (req, res) => {
    try {
      const plan = await healthService.getHealthPlanById(req);
      if (!plan) return res.status(404).json({ message: 'Plano não encontrado' });
      res.json(plan);
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      res.status(500).json({ message: error.message || 'Erro ao buscar plano.' });
    }
  },

  addMoodEntry: async (req, res) => {
    try {
      const result = await healthService.addMoodEntry(req);
      res.json(result);
    } catch (error) {
      console.error('Erro ao adicionar entrada de humor:', error);
      res.status(500).json({ message: error.message || 'Erro ao adicionar entrada de humor.' });
    }
  },

  updateHabits: async (req, res) => {
    try {
      const result = await healthService.updateHabits(req);
      res.json(result);
    } catch (error) {
      console.error('Erro ao atualizar hábitos:', error);
      res.status(500).json({ message: error.message || 'Erro ao atualizar hábitos.' });
    }
  },

  updateHealthPlan: async (req, res) => {
    try {
      const result = await healthService.updateHealthPlan(req);
      if (!result) return res.status(404).json({ message: 'Plano não encontrado' });
      res.json(result);
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      res.status(500).json({ message: error.message || 'Erro ao atualizar plano.' });
    }
  },

  deleteHealthPlan: async (req, res) => {
    try {
      await healthService.deleteHealthPlan(req);
      res.json({ message: 'Plano deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar plano:', error);
      res.status(500).json({ message: error.message || 'Erro ao deletar plano.' });
    }
  },
};
