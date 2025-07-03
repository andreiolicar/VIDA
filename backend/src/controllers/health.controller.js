const { Health } = require("../models");

module.exports = {
  async getAll(req, res) {
    try {
      const records = await Health.findAll({
        order: [["date", "DESC"]],
      });
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar registros." });
    }
  },

  async create(req, res) {
    try {
      const newRecord = await Health.create(req.body);
      res.json(newRecord);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar registro." });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const record = await Health.findByPk(id);
      if (!record) return res.status(404).json({ error: "Registro não encontrado." });

      await record.update(req.body);
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar registro." });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const record = await Health.findByPk(id);
      if (!record) return res.status(404).json({ error: "Registro não encontrado." });

      await record.destroy();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir registro." });
    }
  },
};
