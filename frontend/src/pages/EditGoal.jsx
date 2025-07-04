import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { AlertCircle, Edit3 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';

export default function EditGoal() {
  const userId = localStorage.getItem('user');
  const { id } = useParams(); // id da meta financeira
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchGoal() {
      try {
        setLoadingData(true);
        const res = await axios.get(`/finance/${userId}/goals`);
        const goal = res.data.find((g) => g.id === Number(id));
        if (!goal) {
          setError('Meta financeira não encontrada.');
          setLoadingData(false);
          return;
        }
        setTitle(goal.title);
        setTargetAmount(goal.targetAmount.toString());
        setDeadline(goal.deadline ? goal.deadline.split('T')[0] : '');
      } catch (err) {
        setError('Erro ao carregar meta financeira.');
      } finally {
        setLoadingData(false);
      }
    }
    fetchGoal();
  }, [id, userId]);

  const isFormValid = () => {
    return title.trim() !== '' && targetAmount !== '' && !isNaN(Number(targetAmount)) && Number(targetAmount) > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        targetAmount: Number(targetAmount),
        deadline: deadline ? new Date(deadline).toISOString() : null,
      };

      console.log('Payload enviado:', payload);

      const response = await axios.patch(`/finance/${userId}/goals/${id}`, payload);

      if (!response.data) {
        throw new Error(response.data?.message || 'Erro ao atualizar meta financeira.');
      }

      navigate('/dashboard/finance');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erro inesperado.';
      setError(message);
      console.error('Erro na requisição PATCH:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white items-center justify-center">
        <p>Carregando dados da meta financeira...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1f2937] rounded-xl p-6 sm:p-10 shadow-xl relative">
            <div className="flex justify-end mb-6">
              <Link
                to="/dashboard/finance"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-3 py-1 rounded-lg transition-all text-xl leading-none"
              >
                ×
              </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2">
              <Edit3 className="w-6 h-6 text-green-400" />
              Editar Meta Financeira
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Atualize os campos e salve as alterações.</span>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div>
                <label className="block text-sm mb-1">Título *</label>
                <input
                  type="text"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-green-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {title.trim() === '' && <p className="text-red-400 text-xs mt-1">Título é obrigatório.</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Valor Meta (R$) *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-green-500"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
                {(!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) && (
                  <p className="text-red-400 text-xs mt-1">Valor válido é obrigatório.</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Prazo (Opcional)</label>
                <input
                  type="date"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-green-500"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  className={`font-semibold px-6 py-3 rounded-lg transition-all ${
                    !isFormValid() || loading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
