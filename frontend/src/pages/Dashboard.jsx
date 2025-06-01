import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { useState, useEffect } from "react";
import axios from "@/services/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import {
  BookOpen,
  DollarSign,
  Heart,
  CheckCircle,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const [userName, setUserName] = useState("Usuário");
  const [stats, setStats] = useState({
    estudios: 65,
    finançasPendentes: 3,
    saudeAtividades: 4,
    tarefasPendentes: 7,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = localStorage.getItem('user');
        if (!userId) {
          setUserName("Usuário");
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/user/get/${userId}`);
        if (res.data && res.data.user && res.data.user.name) {
          setUserName(res.data.user.name);
        } else {
          setUserName("Usuário");
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        setUserName("Usuário");
      }
    }
    fetchUser();
  }, []);

  const dataProgressoMensal = [
    { name: 'Jan', Estudos: 55 },
    { name: 'Fev', Estudos: 62 },
    { name: 'Mar', Estudos: 68 },
    { name: 'Abr', Estudos: 75 },
    { name: 'Mai', Estudos: 70 },
    { name: 'Jun', Estudos: 82 },
    { name: 'Jul', Estudos: 90 },
    { name: 'Ago', Estudos: 85 },
    { name: 'Set', Estudos: 88 },
    { name: 'Out', Estudos: 95 },
    { name: 'Nov', Estudos: 98 },
    { name: 'Dez', Estudos: 100 },
  ];

  // Ícone tem largura 20px (w-5 h-5), gap 8px (gap-2 = 0.5rem = 8px)
  const ICON_WIDTH = 20;
  const ICON_GAP = 8;
  const GRAPH_PADDING_LEFT = ICON_WIDTH + ICON_GAP; // 28px

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col p-4 md:p-10 space-y-6 md:space-y-10 overflow-y-auto">
        <header>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
            Bem-vindo ao seu painel, {userName}!
          </h1>
          <p className="text-white/80 max-w-3xl text-sm md:text-base">
            Uma visão geral do seu progresso e um espaço para você se inspirar e se conectar.
          </p>
        </header>

        <section className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-[330px]">
          {/* Card do gráfico com alinhamento do gráfico ao ícone */}
          <div className="flex-1 bg-[#1f2937] rounded-xl py-6 shadow-lg flex flex-col min-w-0">
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2 px-6">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Progresso Mensal de Estudos
            </h2>
            <div
              className="flex-1 w-full"
              style={{ paddingLeft: GRAPH_PADDING_LEFT }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={dataProgressoMensal}
                  margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke="#bbb"
                    ticks={['Fev', 'Abr', 'Jun', 'Ago', 'Out', 'Dez']}
                    dx={-10} // desloca labels X um pouco para esquerda para melhorar alinhamento
                  />
                  <YAxis stroke="#bbb" domain={[0, 110]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    itemStyle={{ color: '#60a5fa' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Estudos"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card Comunidade VIDA (igual ao seu código) */}
          <div className="flex-1 bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center min-w-0">
            <Users className="w-10 h-10 text-purple-400 mb-4" />
            <h2 className="text-lg md:text-2xl font-semibold mb-2 text-center">Comunidade VIDA</h2>
            <p className="text-gray-300 max-w-xs text-center text-sm md:text-base">
              Em breve, um espaço para você se conectar com outros usuários, trocar experiências, ajudar e crescer junto!
            </p>
            <button
              onClick={() => alert('Essa feature está em desenvolvimento!')}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition text-sm md:text-base"
            >
              Saiba mais
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <CardDashboard
            icon={<BookOpen className="w-8 h-8 text-blue-400" />}
            title="Estudos"
            subtitle={`${stats.estudios}% da meta anual`}
            btnText="Ver Trilhas"
            btnLink="/dashboard/study"
            bgColor="bg-blue-900"
          />
          <CardDashboard
            icon={<DollarSign className="w-8 h-8 text-green-400" />}
            title="Finanças"
            subtitle={`${stats.finançasPendentes} pendências financeiras`}
            btnText="Ver Finanças"
            btnLink="/dashboard/finance"
            bgColor="bg-green-900"
          />
          <CardDashboard
            icon={<Heart className="w-8 h-8 text-red-400" />}
            title="Saúde"
            subtitle={`${stats.saudeAtividades} atividades físicas feitas`}
            btnText="Ver Saúde"
            btnLink="/dashboard/health"
            bgColor="bg-red-900"
          />
          <CardDashboard
            icon={<CheckCircle className="w-8 h-8 text-yellow-400" />}
            title="Tarefas"
            subtitle={`${stats.tarefasPendentes} pendentes hoje`}
            btnText="Ver Tarefas"
            btnLink="/dashboard/tasks"
            bgColor="bg-yellow-900"
          />
        </section>
      </main>

      <DashboardRightPanel />
    </div>
  );
}

function CardDashboard({ icon, title, subtitle, btnText, btnLink, bgColor }) {
  return (
    <div
      className={`${bgColor} rounded-xl p-4 md:p-6 shadow-lg flex flex-col`}
    >
      <div className="mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
        {icon}
        <h3 className="text-base md:text-xl font-semibold">{title}</h3>
      </div>
      <p className="flex-1 text-gray-300 text-sm md:text-base">{subtitle}</p>
      <button
        className="mt-4 md:mt-6 bg-white/10 hover:bg-white/20 px-3 py-2 md:px-4 md:py-2 rounded-lg transition text-xs md:text-base"
        onClick={() => (window.location.href = btnLink)}
      >
        {btnText}
      </button>
    </div>
  );
}
