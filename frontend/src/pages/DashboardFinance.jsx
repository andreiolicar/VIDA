import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/services/axios';
import { Plus, Trash2 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';

export default function DashboardFinance() {
  const userId = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [vidaScore, setVidaScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buscar transações
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`/finance/${userId}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Erro ao carregar transações.');
    }
  };

  // Buscar metas financeiras
  const fetchGoals = async () => {
    try {
      const res = await axios.get(`/finance/${userId}/goals`);
      setGoals(res.data);
    } catch (err) {
      console.error('Erro ao buscar metas:', err);
      setError('Erro ao carregar metas financeiras.');
    }
  };

  // Buscar V.I.D.A. Score
  const fetchVidaScore = async () => {
    try {
      const res = await axios.get(`/finance/${userId}/vida-score`);
      setVidaScore(res.data.vidaScore);
    } catch (err) {
      console.error('Erro ao buscar V.I.D.A. Score:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTransactions(), fetchGoals(), fetchVidaScore()]).finally(() => setLoading(false));
  }, []);

  // Excluir transação (exemplo simples)
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await axios.delete(`/finance/${userId}/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error('Erro ao excluir transação:', err);
        alert('Erro ao excluir transação');
      }
    }
  };

  // Excluir meta financeira
  const handleDeleteGoal = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta financeira?')) {
      try {
        await axios.delete(`/finance/${userId}/goals/${id}`);
        fetchGoals();
      } catch (err) {
        console.error('Erro ao excluir meta:', err);
        alert('Erro ao excluir meta financeira');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col px-12 py-8 overflow-y-auto">
        {/* V.I.D.A. Score */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">V.I.D.A. Score</h1>
          {vidaScore !== null ? (
            <div className="text-4xl font-bold text-green-400">{vidaScore.toFixed(1)}</div>
          ) : (
            <p>Carregando score...</p>
          )}
        </div>

        {/* Transações */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Transações {transactions.length ? `(${transactions.length})` : ''}
            </h1>
            <Link to="/dashboard/finance/new-transaction">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Plus size={18} /> Nova Transação
              </button>
            </Link>
          </div>

          {transactions.length === 0 ? (
            <p className="text-gray-400 mt-8">Nenhuma transação cadastrada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 bg-white/10 backdrop-blur rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{tx.category}</h2>
                    <p className="text-sm text-gray-400 mb-2">{new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                    <p className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                    </p>
                    {tx.description && <p className="text-sm text-gray-300 mt-2">{tx.description}</p>}
                  </div>
                  <button
                    title="Excluir transação"
                    className="self-end mt-4 text-gray-400 hover:text-red-500"
                    onClick={() => handleDeleteTransaction(tx.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metas Financeiras */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Metas Financeiras {goals.length ? `(${goals.length})` : ''}
            </h1>
            <Link to="/dashboard/finance/new-goal">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus size={18} /> Nova Meta
              </button>
            </Link>
          </div>

          {goals.length === 0 ? (
            <p className="text-gray-400">Nenhuma meta cadastrada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const progressPercent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                return (
                  <div key={goal.id} className="p-4 bg-white/10 backdrop-blur rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">{goal.title}</h2>
                      <p className="text-sm text-gray-400 mb-2">
                        Meta: R$ {goal.targetAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400 mb-2">
                        Atual: R$ {goal.currentAmount.toFixed(2)}
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                        <div
                          className="bg-green-400 h-3 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-300">
                        Prazo: {goal.deadline ? new Date(goal.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}
                      </p>
                      <p className="text-sm mt-1 font-semibold">
                        Status: {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </p>
                    </div>
                    <button
                      title="Excluir meta"
                      className="self-end mt-4 text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DashboardRightPanel />
    </div>
  );
}
