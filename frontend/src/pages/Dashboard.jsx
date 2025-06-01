import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { useState, useEffect } from "react";
import axios from "@/services/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { BookOpen, DollarSign, Heart, CheckCircle, Users } from "lucide-react";

const COLORS = ['#3B82F6', '#22C55E', '#F59E42', '#FBBF24'];

export default function Dashboard() {
  const [userName, setUserName] = useState("Usuário");
  const [stats, setStats] = useState({
    estudios: 65,
    finançasPendentes: 3,
    saudeAtividades: 4,
    tarefasPendentes: 7,
  });
  const [insight, setInsight] = useState("“O amanhã pertence àqueles que se preparam hoje.” – Malcolm X");

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = localStorage.getItem('user');
        const res = await axios.get(`/users/${userId}`);
        if (res.data && res.data.name) {
          setUserName(res.data.name);
        }
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      }
    }
    fetchUser();
  }, []);

  const dataProgressoMensal = [
    { name: 'Estudos', Progresso: stats.estudios },
    { name: 'Saúde', Progresso: stats.saudeAtividades * 20 },
    { name: 'Finanças', Progresso: 100 - stats.finançasPendentes * 20 },
    { name: 'Tarefas', Progresso: 100 - stats.tarefasPendentes * 15 },
  ];

  const dataDistribuicao = [
    { name: 'Estudos', value: stats.estudios },
    { name: 'Saúde', value: stats.saudeAtividades * 10 },
    { name: 'Finanças', value: stats.finançasPendentes * 5 },
    { name: 'Tarefas', value: stats.tarefasPendentes * 6 },
  ];

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

        <section className="
          bg-[#1f2937] rounded-xl p-4 md:p-6 shadow-lg
          flex flex-col md:flex-row gap-4 md:gap-8
          min-h-[330px] max-h-fit
        ">
          <div className="flex-1 min-w-0 flex flex-col">
            <h2 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Progresso Mensal
            </h2>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dataProgressoMensal} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="name" stroke="#bbb" />
                  <YAxis stroke="#bbb" />
                  <Tooltip />
                  <Bar dataKey="Progresso" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-center justify-start">
            <h2 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Distribuição Geral
            </h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={dataDistribuicao}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={55}
                    fill="#82ca9d"
                    label
                  >
                    {dataDistribuicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2 w-full">
              {dataDistribuicao.map((entry, index) => (
                <div
                  key={`legend-item-${index}`}
                  className="flex items-center gap-2 text-xs md:text-sm text-gray-300 whitespace-nowrap"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  {entry.name}
                </div>
              ))}
            </div>
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

        <section className="bg-[#1f2937] rounded-xl p-4 md:p-6 shadow-lg max-w-3xl mx-auto flex flex-col items-center gap-3 text-center">
          <Users className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
          <h2 className="text-lg md:text-2xl font-semibold">Comunidade VIDA</h2>
          <p className="text-gray-300 max-w-md text-sm md:text-base">
            Em breve, um espaço para você se conectar com outros usuários, trocar experiências, ajudar e crescer junto!
          </p>
          <button
            onClick={() => alert('Essa feature está em desenvolvimento!')}
            className="mt-1 md:mt-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition text-sm md:text-base"
          >
            Saiba mais
          </button>
        </section>
      </main>

      <DashboardRightPanel>
        <div className="p-4 md:p-6 bg-[#1f2937] rounded-xl shadow-lg max-w-xs space-y-4 md:space-y-6">
          <h3 className="text-base md:text-lg font-semibold mb-2">Insight do dia</h3>
          <p className="text-gray-300 italic text-sm md:text-base">{insight}</p>
        </div>
      </DashboardRightPanel>
    </div>
  );
}

function CardDashboard({ icon, title, subtitle, btnText, btnLink, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-4 md:p-6 shadow-lg flex flex-col`}>
      <div className="mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
        {icon}
        <h3 className="text-base md:text-xl font-semibold">{title}</h3>
      </div>
      <p className="flex-1 text-gray-300 text-sm md:text-base">{subtitle}</p>
      <button
        className="mt-4 md:mt-6 bg-white/10 hover:bg-white/20 px-3 py-2 md:px-4 md:py-2 rounded-lg transition text-xs md:text-base"
        onClick={() => window.location.href = btnLink}
      >
        {btnText}
      </button>
    </div>
  );
}
