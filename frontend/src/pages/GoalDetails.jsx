import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Edit3, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const formatCurrency = (value) => {
  const num = Number(value);
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1f2937] p-2 rounded shadow-lg text-white">
        <p className="font-semibold">{label}</p>
        <p>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function GoalDetails() {
  const userId = localStorage.getItem('user');
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [removingAmount, setRemovingAmount] = useState('');
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [history, setHistory] = useState([]);

  // Função para atualizar status baseado no valor atual e meta
  const updateStatus = (currentAmount, targetAmount) => {
    return currentAmount >= targetAmount ? 'completed' : 'active';
  };

  // Busca meta e histórico completos do backend
  useEffect(() => {
    async function fetchGoalAndHistory() {
      try {
        setLoading(true);
        // Busca a meta
        const resGoal = await axios.get(`/finance/${userId}/goals/${id}`);
        const found = resGoal.data;
        if (!found) {
          setError('Meta financeira não encontrada.');
          setLoading(false);
          return;
        }
        setGoal(found);

        // Busca histórico completo (supondo rota específica)
        const resHistory = await axios.get(`/finance/${userId}/goals/${id}/history`);
        const hist = Array.isArray(resHistory.data) ? resHistory.data : [];
        setHistory(hist);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar meta financeira.');
      } finally {
        setLoading(false);
      }
    }
    fetchGoalAndHistory();
  }, [id, userId]);

  const progressPercent = goal ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;

  // Atualiza meta e histórico após adicionar/remover aporte
  const refreshData = async () => {
    try {
      const resGoal = await axios.get(`/finance/${userId}/goals/${id}`);
      setGoal(resGoal.data);
      const resHistory = await axios.get(`/finance/${userId}/goals/${id}/history`);
      setHistory(Array.isArray(resHistory.data) ? resHistory.data : []);
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
    }
  };

  const handleAddAmount = async () => {
    if (!newAmount || isNaN(Number(newAmount)) || Number(newAmount) <= 0) return;
    setAdding(true);
    try {
      await axios.patch(`/finance/${userId}/goals/${id}`, { amountToAdd: Number(newAmount) });
      await refreshData();
      setNewAmount('');
    } catch {
      alert('Erro ao adicionar valor.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAmount = async () => {
    if (!removingAmount || isNaN(Number(removingAmount)) || Number(removingAmount) <= 0) return;
    if (Number(removingAmount) > (goal?.currentAmount || 0)) {
      alert('Não é possível remover um valor maior que o valor atual.');
      return;
    }
    setRemoving(true);
    try {
      await axios.patch(`/finance/${userId}/goals/${id}`, { amountToAdd: -Number(removingAmount) });
      await refreshData();
      setRemovingAmount('');
    } catch {
      alert('Erro ao remover valor.');
    } finally {
      setRemoving(false);
    }
  };

  if (loading) return <p className="text-white p-8">Carregando...</p>;
  if (error) return <p className="text-red-500 p-8">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{goal.title}</h1>
          <div className="flex gap-3">
            <Link
              to={`/dashboard/finance/edit-goal/${goal.id}`}
              className="btn-green flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Edit3 size={18} /> Editar
            </Link>
            <button
              className="btn-red flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => {
                if (window.confirm('Deseja excluir esta meta financeira?')) {
                  axios.delete(`/finance/${userId}/goals/${goal.id}`).then(() => navigate('/dashboard/finance'));
                }
              }}
            >
              <Trash2 size={18} /> Excluir
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p><strong>Valor Meta:</strong> {formatCurrency(goal.targetAmount)}</p>
          <p><strong>Valor Atual:</strong> {formatCurrency(goal.currentAmount)}</p>
          <p><strong>Prazo:</strong> {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Sem prazo'}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`font-semibold ${updateStatus(goal.currentAmount, goal.targetAmount) === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
              {updateStatus(goal.currentAmount, goal.targetAmount).charAt(0).toUpperCase() + updateStatus(goal.currentAmount, goal.targetAmount).slice(1)}
            </span>
          </p>

          <div className="w-full bg-gray-700 rounded-full h-6 mt-4">
            <div
              className="bg-green-400 h-6 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-right mt-1">{progressPercent.toFixed(1)}%</p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Histórico de Aportes</h2>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <ResponsiveContainer width={Math.max(history.length * 80, 300)} height={250}>
                <LineChart data={history} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    padding={{ left: 20, right: 20 }}
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return d.toLocaleDateString('pt-BR');
                    }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={formatCurrency}
                    width={80}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#22c55e', stroke: '#fff', strokeWidth: 3 }}
                    isAnimationActive={true}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>Nenhum aporte registrado ainda.</p>
          )}
        </section>

        <section className="mb-8 max-w-sm">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <PlusCircle size={20} /> Adicionar Aporte
          </h2>
          <div className="flex gap-2">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Valor em R$"
              className="flex-1 bg-[#111827] rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-green-500"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              disabled={adding}
            />
            <button
              className={`bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition text-white font-semibold ${
                adding ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleAddAmount}
              disabled={adding || !newAmount || Number(newAmount) <= 0}
            >
              {adding ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </section>

        <section className="mb-8 max-w-sm">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <MinusCircle size={20} /> Remover Aporte
          </h2>
          <div className="flex gap-2">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Valor em R$"
              className="flex-1 bg-[#111827] rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-red-500"
              value={removingAmount}
              onChange={(e) => setRemovingAmount(e.target.value)}
              disabled={removing}
            />
            <button
              className={`bg-red-600 px-4 py-3 rounded-lg hover:bg-red-700 transition text-white font-semibold ${
                removing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleRemoveAmount}
              disabled={removing || !removingAmount || Number(removingAmount) <= 0}
            >
              {removing ? 'Removendo...' : 'Remover'}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Dicas para melhorar sua meta</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Mantenha aportes regulares para garantir o progresso.</li>
            <li>Revise seu orçamento mensal para aumentar a poupança.</li>
            <li>Evite gastos desnecessários para acelerar a meta.</li>
            <li>Considere investimentos para potencializar seus recursos.</li>
          </ul>
        </section>
      </main>
      <DashboardRightPanel />
    </div>
  );
}
