import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';

function formatCurrency(value) {
  const num = Number(value);
  return !isNaN(num)
    ? num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,00';
}

// Card para cada meta financeira
function GoalCard({ goal, onClick }) {
  const progressPercent = Math.min(
    100,
    goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  );

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className="bg-[#1f2937] rounded-xl p-6 shadow-md cursor-pointer hover:bg-opacity-80 transition flex flex-col justify-between min-w-[220px] max-w-[280px] h-52"
      aria-label={`Meta: ${goal.title}, progresso ${progressPercent.toFixed(1)}%`}
    >
      <div>
        <h3 className="text-lg font-semibold mb-2 truncate" title={goal.title}>
          {goal.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Prazo: {goal.deadline ? new Date(goal.deadline).toLocaleDateString('pt-BR') : 'Não definido'}
        </p>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm font-semibold text-gray-300">
        <span>{formatCurrency(goal.currentAmount)}</span>
        <span>{formatCurrency(goal.targetAmount)}</span>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const rawUser = localStorage.getItem('user');
  let userId = null;
  try {
    const userObj = JSON.parse(rawUser);
    userId = userObj?.id ?? rawUser;
  } catch {
    userId = rawUser;
  }

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGoals() {
      if (!userId) return;
      try {
        const res = await axios.get(`/finance/${userId}/goals`);
        const data = Array.isArray(res.data) ? res.data : [];
        setGoals(data);
        setFilteredGoals(data);
      } catch (error) {
        console.error('Erro ao buscar metas financeiras:', error);
        setGoals([]);
        setFilteredGoals([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGoals();
  }, [userId]);

  // Filtra metas pelo texto digitado (somente título)
  useEffect(() => {
    if (!filterText) {
      setFilteredGoals(goals);
    } else {
      const lowerFilter = filterText.toLowerCase();
      setFilteredGoals(
        goals.filter(
          (goal) => goal.title && goal.title.toLowerCase().includes(lowerFilter)
        )
      );
    }
  }, [filterText, goals]);

  function handleNewGoal() {
    navigate('/dashboard/finance/new-goal');
  }

  function handleGoalClick(goalId) {
    navigate(`/dashboard/finance/goal/${goalId}`);
  }

  function handleBack() {
    navigate(-1);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto py-8 max-w-[1280px] mx-auto px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Metas Financeiras</h1>
          <div className="flex gap-4">
            <button
              onClick={handleNewGoal}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold transition"
            >
              Nova Meta
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Filtro */}
        <div className="mb-6 w-full">
          <input
            type="text"
            placeholder="Filtrar metas pelo título"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
            aria-label="Filtrar metas pelo título"
          />
        </div>

        {/* Lista de cards */}
        {loading ? (
          <p>Carregando metas financeiras...</p>
        ) : filteredGoals.length === 0 ? (
          <p>Nenhuma meta financeira encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onClick={() => handleGoalClick(goal.id)}
              />
            ))}
          </div>
        )}
      </main>
      <DashboardRightPanel />
    </div>
  );
}
