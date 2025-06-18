import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { AlertCircle, Edit3 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';

const TYPES = [
  { value: 'income', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
];

export default function EditTransaction() {
  const userId = localStorage.getItem('user');
  const { id } = useParams(); // id da transação
  const navigate = useNavigate();

  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchTransaction() {
      try {
        setLoadingData(true);
        const res = await axios.get(`/finance/${userId}/transactions`);
        const tx = res.data.find((t) => t.id === Number(id));
        if (!tx) {
          setError('Transação não encontrada.');
          setLoadingData(false);
          return;
        }
        setType(tx.type);
        setCategory(tx.category);
        setAmount(tx.amount.toString());
        setDate(tx.date ? tx.date.split('T')[0] : '');
        setDescription(tx.description || '');
      } catch (err) {
        setError('Erro ao carregar transação.');
      } finally {
        setLoadingData(false);
      }
    }
    fetchTransaction();
  }, [id, userId]);

  const isFormValid = () => {
    return (
      type !== '' &&
      category.trim() !== '' &&
      amount !== '' &&
      !isNaN(Number(amount)) &&
      Number(amount) > 0 &&
      date !== ''
    );
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
        type,
        category: category.trim(),
        amount: Number(amount),
        date: new Date(date).toISOString(),
        description: description.trim() || null,
      };

      const response = await axios.patch(`/finance/${userId}/transactions/${id}`, payload);

      if (!response.data) {
        throw new Error(response.data?.message || 'Erro ao atualizar transação.');
      }

      navigate('/dashboard/finance');
    } catch (err) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white items-center justify-center">
        <p>Carregando dados da transação...</p>
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
              <Edit3 className="w-6 h-6 text-indigo-400" />
              Editar Transação
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Atualize os campos e salve as alterações.</span>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div>
                <label className="block text-sm mb-1">Tipo *</label>
                <select
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Selecione o tipo</option>
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {type === '' && <p className="text-red-400 text-xs mt-1">Tipo é obrigatório.</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Categoria *</label>
                <input
                  type="text"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                {category.trim() === '' && (
                  <p className="text-red-400 text-xs mt-1">Categoria é obrigatória.</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Valor (R$) *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {(!amount || isNaN(Number(amount)) || Number(amount) <= 0) && (
                  <p className="text-red-400 text-xs mt-1">Valor válido é obrigatório.</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Data *</label>
                <input
                  type="date"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {date === '' && <p className="text-red-400 text-xs mt-1">Data é obrigatória.</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Descrição (Opcional)</label>
                <textarea
                  rows={3}
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-indigo-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  className={`font-semibold px-6 py-3 rounded-lg transition-all ${
                    !isFormValid() || loading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
