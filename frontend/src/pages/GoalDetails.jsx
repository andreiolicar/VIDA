import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Edit3, Trash2, PlusCircle } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function GoalDetails() {
  const userId = localStorage.getItem('user');
  const { id } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [adding, setAdding] = useState(false);

  // Histórico simulado de aportes (pode ser adaptado para buscar do backend)
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchGoal() {
      try {
        setLoading(true);
        const res = await axios.get(`/finance/${userId}/goals`);
        const found = res.data.find((g) => g.id === Number(id));
        if (!found) {
          setError('Meta financeira não encontrada.');
          setLoading(false);
          return;
        }
        setGoal(found);

        // Simular histórico de aportes (ou buscar de API específica)
        // Exemplo: [{date: '2025-06-01', amount: 100}, ...]
        setHistory([
          { date: '2025-06-01', amount: found.currentAmount * 0.3 },
          { date: '2025-06-10', amount: found.currentAmount * 0.7 },
        ]);
      } catch {
        setError('Erro ao carregar meta financeira.');
      } finally {
        setLoading(false);
      }
    }
    fetchGoal();
  }, [id, userId]);

  const progressPercent = goal ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;

  const handleAddAmount = async () => {
    if (!newAmount || isNaN(Number(newAmount)) || Number(newAmount) <= 0) return;
    setAdding(true);
    try {
      await axios.patch(`/finance/${userId}/goals/${id}`, { amountToAdd: Number(newAmount) });
      // Atualizar dados localmente
      setGoal((g) => ({
        ...g,
        currentAmount: g.currentAmount + Number(newAmount),
        status: g.currentAmount + Number(newAmount) >= g.targetAmount ? 'completed' : g.status,
      }));
      setHistory((h) => [...h, { date: new Date().toISOString().split('T')[0], amount: Number(newAmount) }]);
      setNewAmount('');
    } catch {
      alert('Erro ao adicionar valor.');
    } finally {
      setAdding(false);
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
            <Link to={`/dashboard/finance/edit-goal/${goal.id}`} className="btn-green flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700 transition">
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
          <p><strong>Valor Meta:</strong> R$ {goal.targetAmount.toFixed(2)}</p>
          <p><strong>Valor Atual:</strong> R$ {goal.currentAmount.toFixed(2)}</p>
          <p><strong>Prazo:</strong> {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Sem prazo'}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`font-semibold ${goal.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
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
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
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
