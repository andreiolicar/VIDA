const db = require("./models");
const Op = db.Sequelize.Op;
const { Task } = db;

/**
 * Gera um resumo do perfil de priorização do usuário baseado no histórico
 * @param {number} userId - ID do usuário
 * @returns {string} resumo textual para IA
 */
async function buildUserPriorityProfile(userId) {
  // Busca últimas 50 tarefas concluídas do usuário
  const tasks = await Task.findAll({
    where: {
      userId,
      completedAt: { [Op.ne]: null },
    },
    order: [["completedAt", "DESC"]],
    limit: 50,
  });

  if (tasks.length === 0) {
    return "Usuário novo, sem histórico de tarefas concluídas.";
  }

  const total = tasks.length;
  const highPriorityCount = tasks.filter(t => t.priority === "alta").length;
  const mediumPriorityCount = tasks.filter(t => t.priority === "media").length;
  const lowPriorityCount = tasks.filter(t => t.priority === "baixa").length;

  // Calcula tempo médio de conclusão em minutos
  const avgCompletionTimeMs = tasks.reduce((acc, t) => {
    const created = new Date(t.createdAt);
    const completed = new Date(t.completedAt);
    return acc + (completed - created);
  }, 0) / total;

  const avgCompletionTimeMin = Math.round(avgCompletionTimeMs / (1000 * 60));

  // Percentuais de cada prioridade
  const highPct = Math.round((highPriorityCount / total) * 100);
  const medPct = Math.round((mediumPriorityCount / total) * 100);
  const lowPct = Math.round((lowPriorityCount / total) * 100);

  // Monta texto com base em técnicas clássicas
  const profile = `
Usuário com histórico de ${total} tarefas concluídas.
Distribuição de prioridades: alta ${highPct}%, média ${medPct}%, baixa ${lowPct}%.
Tempo médio de conclusão de tarefas: ${avgCompletionTimeMin} minutos.
Baseado na matriz impacto x esforço e método MoSCoW, o usuário tende a priorizar tarefas que geram maior impacto e são urgentes.
`;
  return profile.trim();
}

module.exports = { buildUserPriorityProfile };
