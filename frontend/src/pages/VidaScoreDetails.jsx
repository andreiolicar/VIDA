import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Função para obter cor hex da pontuação
const getScoreColorHex = (score) => {
  if (score <= 300) return "#ef4444"; // vermelho
  if (score <= 500) return "#facc15"; // amarelo
  if (score <= 700) return "#3b82f6"; // azul
  return "#22c55e"; // verde
};

// Tooltip customizado para LineChart com cor dinâmica da pontuação
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const scoreValue = payload[0].value;
    const color = getScoreColorHex(scoreValue);

    return (
      <div className="bg-[#1f2937] p-2 rounded shadow-lg text-white">
        <p className="font-semibold">{label}</p>
        <p className="font-bold" style={{ color }}>
          {scoreValue.toFixed(0)}
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip customizado para valores em reais nos gráficos de pizza e barras
const CustomCurrencyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1f2937] p-2 rounded shadow-lg text-white">
        {label && <p className="font-semibold mb-1">{label}</p>}
        {payload.map((entry, index) => {
          let color = entry.fill;

          // No gráfico de barras, colorir receita verde e despesa vermelho
          if (entry.name === "Receitas") color = "#22c55e";
          else if (entry.name === "Despesas") color = "#ef4444";

          const formattedValue = entry.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });

          return (
            <p key={`item-${index}`} className="font-bold" style={{ color }}>
              {entry.name}: {formattedValue}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

// Legenda personalizada para o V.I.D.A. Score
const vidaScoreLegendPayload = [
  { value: "0 - 300", type: "square", color: "#ef4444" }, // vermelho
  { value: "301 - 500", type: "square", color: "#facc15" }, // amarelo
  { value: "501 - 700", type: "square", color: "#3b82f6" }, // azul
  { value: "701 - 1000", type: "square", color: "#22c55e" }, // verde
];

export default function VidaScoreDetails() {
  const navigate = useNavigate();

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

  // Função para definir cor do score conforme faixa
  const getScoreColor = (score) => {
    if (score <= 300) return "text-red-500";
    if (score <= 500) return "text-yellow-400";
    if (score <= 700) return "text-blue-400";
    return "text-green-400";
  };

  // Buscar dados do score
  const fetchVidaScore = async () => {
    try {
      const res = await axios.get(`/finance/vida-score`);
      setVidaScore(res.data.vidaScore);
    } catch (err) {
      console.error("Erro ao buscar V.I.D.A. Score:", err);
      setError("Erro ao carregar V.I.D.A. Score.");
    }
  };

  // Buscar histórico do score
  const fetchScoreHistory = async () => {
    try {
      const res = await axios.get(`/finance/vida-score/history`);
      setScoreHistory(res.data);
    } catch (err) {
      console.error("Erro ao buscar histórico do score:", err);
    }
  };

  // Buscar relatório financeiro resumido para gráficos
  const fetchFinancialReport = async () => {
    try {
      const res = await axios.get(`/finance/reports`);
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
  }, []);

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

  // Função para voltar
  const handleBack = () => {
    navigate(-1);
  };

  // Custom label para garantir que as porcentagens caibam dentro da fatia
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Esconde labels para fatias muito pequenas (< 3%)
    if (percent < 0.03) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <div className="flex-1 px-12 py-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Detalhes do V.I.D.A. Score</h1>
          <button
            onClick={handleBack}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition text-white"
            aria-label="Voltar"
          >
            Voltar
          </button>
        </div>

        {loading ? (
          <p>Carregando dados...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Score Atual */}
            <div className={`text-5xl font-bold mb-8 ${getScoreColor(vidaScore)}`}>
              {vidaScore !== null ? vidaScore.toFixed(0) : "-"}
            </div>

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

            {/* Histórico do Score - Gráfico de Linha com legenda personalizada */}
            <section className="mb-10 max-w-4xl">
              <h2 className="text-2xl font-semibold mb-3">Histórico do V.I.D.A. Score</h2>
              {scoreHistory && scoreHistory.length > 0 ? (
                <div className="bg-[#1f2937] rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={scoreHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" padding={{ left: 20, right: 20 }} />
                      <YAxis domain={[0, 1000]} stroke="#94a3b8" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 6, strokeWidth: 2, fill: "#22c55e", stroke: "#fff" }}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        payload={vidaScoreLegendPayload}
                        wrapperStyle={{ padding: 10 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
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
                  <div className="bg-[#1f2937] rounded-xl p-4">
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
                          label={renderCustomizedLabel}
                        >
                          {pieDataMap.income.map((entry, index) => (
                            <Cell key={`cell-income-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend layout="horizontal" verticalAlign="bottom" />
                        <Tooltip content={<CustomCurrencyTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-400">Nenhuma receita registrada.</p>
                )}
              </div>

              {/* Gráfico de Pizza - Despesas */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">Despesas por Categoria</h2>
                {pieDataMap.expense && pieDataMap.expense.length > 0 ? (
                  <div className="bg-[#1f2937] rounded-xl p-4">
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
                          label={renderCustomizedLabel}
                        >
                          {pieDataMap.expense.map((entry, index) => (
                            <Cell key={`cell-expense-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend layout="horizontal" verticalAlign="bottom" />
                        <Tooltip content={<CustomCurrencyTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-gray-400">Nenhuma despesa registrada.</p>
                )}
              </div>

              {/* Gráfico de Barras - Total Receitas x Despesas */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-3">Receitas vs Despesas</h2>
                {barData.length > 0 ? (
                  <div className="bg-[#1f2937] rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip content={<CustomCurrencyTooltip />} />
                        <Bar dataKey="valor" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
