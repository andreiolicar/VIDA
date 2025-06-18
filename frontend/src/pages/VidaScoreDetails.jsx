import { useEffect, useState } from "react";
import axios from "@/services/axios";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function VidaScoreDetails() {
  const userId = localStorage.getItem("user");

  const [vidaScore, setVidaScore] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [financialReport, setFinancialReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dicas personalizadas (exemplo simples)
  const tips = [
    "Mantenha suas despesas abaixo da sua renda mensal.",
    "Aumente o valor poupado nas metas financeiras.",
    "Evite gastos desnecessários e impulsivos.",
    "Revise seu orçamento mensal regularmente.",
    "Invista em educação financeira para melhorar decisões.",
  ];

  // Buscar dados do score
  const fetchVidaScore = async () => {
    try {
      const res = await axios.get(`/finance/${userId}/vida-score`);
      setVidaScore(res.data.vidaScore);
    } catch (err) {
      console.error("Erro ao buscar V.I.D.A. Score:", err);
      setError("Erro ao carregar V.I.D.A. Score.");
    }
  };

  // Buscar histórico do score (supondo que tenha endpoint /finance/:userId/vida-score/history)
  const fetchScoreHistory = async () => {
    try {
      const res = await axios.get(`/finance/${userId}/vida-score/history`);
      // Espera um array [{ date: '2025-06-10', score: 75 }, ...]
      setScoreHistory(res.data);
    } catch (err) {
      console.error("Erro ao buscar histórico do score:", err);
      // Pode ser que não tenha esse endpoint, ignore se não existir
    }
  };

  // Buscar relatório financeiro resumido para gráficos
  const fetchFinancialReport = async () => {
    try {
      const res = await axios.get(`/finance/${userId}/reports`);
      // Espera um objeto { summary: { 'income-Salary': 5000, 'expense-Food': 1200, ... } }
      setFinancialReport(res.data.summary);
    } catch (err) {
      console.error("Erro ao buscar relatório financeiro:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchVidaScore(), fetchScoreHistory(), fetchFinancialReport()]).finally(() =>
      setLoading(false)
    );
  }, [userId]);

  // Preparar dados para gráfico de pizza (categorias de gastos e receitas)
  const preparePieData = () => {
    if (!financialReport) return [];

    const dataMap = {};
    for (const key in financialReport) {
      const [type, category] = key.split("-");
      if (!dataMap[type]) dataMap[type] = [];
      dataMap[type].push({ name: category, value: financialReport[key] });
    }

    return dataMap;
  };

  // Preparar dados para gráfico de barras (total receitas x despesas)
  const prepareBarData = () => {
    if (!financialReport) return [];

    let totalIncome = 0;
    let totalExpense = 0;

    for (const key in financialReport) {
      const [type] = key.split("-");
      if (type === "income") totalIncome += financialReport[key];
      else if (type === "expense") totalExpense += financialReport[key];
    }

    return [
      { name: "Receitas", valor: totalIncome },
      { name: "Despesas", valor: totalExpense },
    ];
  };

  const pieDataMap = preparePieData();
  const barData = prepareBarData();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <div className="flex-1 px-12 py-8 overflow-y-auto">
        <h1 className="text-3xl font-semibold mb-4">Detalhes do V.I.D.A. Score</h1>

        {loading ? (
          <p>Carregando dados...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Score Atual */}
            <div className="text-5xl font-bold text-green-400 mb-8">{vidaScore?.toFixed(1)}</div>

            {/* Explicação detalhada */}
            <section className="mb-10 max-w-3xl">
              <h2 className="text-2xl font-semibold mb-3">O que influencia seu V.I.D.A. Score?</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Saldo líquido entre receitas e despesas.</li>
                <li>Progresso nas suas metas financeiras.</li>
                <li>Frequência e controle dos seus gastos.</li>
                <li>Disciplina no planejamento e orçamento mensal.</li>
              </ul>
            </section>

            {/* Histórico do Score - Gráfico de Linha */}
            <section className="mb-10 max-w-4xl">
              <h2 className="text-2xl font-semibold mb-3">Histórico do V.I.D.A. Score</h2>
              {scoreHistory && scoreHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scoreHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400">Nenhum histórico disponível.</p>
              )}
            </section>

            {/* Relatórios Financeiros */}
            <section className="mb-10 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gráfico de Pizza - Receitas */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">Receitas por Categoria</h2>
                {pieDataMap.income && pieDataMap.income.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieDataMap.income}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#22c55e"
                        label
                      >
                        {pieDataMap.income.map((entry, index) => (
                          <Cell key={`cell-income-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400">Nenhuma receita registrada.</p>
                )}
              </div>

              {/* Gráfico de Pizza - Despesas */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">Despesas por Categoria</h2>
                {pieDataMap.expense && pieDataMap.expense.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieDataMap.expense}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#ef4444"
                        label
                      >
                        {pieDataMap.expense.map((entry, index) => (
                          <Cell key={`cell-expense-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400">Nenhuma despesa registrada.</p>
                )}
              </div>

              {/* Gráfico de Barras - Total Receitas x Despesas */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-3">Receitas vs Despesas</h2>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="valor" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400">Dados insuficientes para gráfico.</p>
                )}
              </div>
            </section>

            {/* Dicas personalizadas */}
            <section className="mb-10 max-w-3xl">
              <h2 className="text-2xl font-semibold mb-3">Dicas para melhorar seu V.I.D.A. Score</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
      <DashboardRightPanel />
    </div>
  );
}
