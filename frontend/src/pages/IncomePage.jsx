import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';

function formatCurrency(value) {
  const num = Number(value);
  return !isNaN(num)
    ? num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,00';
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] p-6 rounded-xl max-w-sm w-full text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

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
    async function fetchIncomes() {
      if (!userId) return;
      try {
        const res = await axios.get(`/finance/${userId}/transactions`, {
          params: { type: 'income' },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setIncomes(data);
        setFilteredIncomes(data);
      } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        setIncomes([]);
        setFilteredIncomes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchIncomes();
  }, [userId]);

  // Filtra receitas pelo texto digitado (somente categoria)
  useEffect(() => {
    if (!filterText) {
      setFilteredIncomes(incomes);
    } else {
      const lowerFilter = filterText.toLowerCase();
      setFilteredIncomes(
        incomes.filter(
          (tx) => tx.category && tx.category.toLowerCase().includes(lowerFilter)
        )
      );
    }
  }, [filterText, incomes]);

  function handleNewIncome() {
    navigate('/dashboard/finance/new-transaction?type=income');
  }

  function handleCardClick(transactionId) {
    navigate(`/dashboard/finance/transaction/${transactionId}`);
  }

  function handleBack() {
    navigate(-1);
  }

  function openDeleteModal(transaction) {
    setTransactionToDelete(transaction);
    setConfirmModalOpen(true);
  }

  function cancelDelete() {
    setTransactionToDelete(null);
    setConfirmModalOpen(false);
  }

  async function confirmDelete() {
    if (!transactionToDelete) return;

    try {
      await axios.delete(`/finance/${userId}/transactions/${transactionToDelete.id}`);
      setIncomes((prev) => prev.filter((tx) => tx.id !== transactionToDelete.id));
      setFilteredIncomes((prev) => prev.filter((tx) => tx.id !== transactionToDelete.id));
      setConfirmModalOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      alert('Erro ao excluir receita.');
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto py-8">
        <div className="max-w-[1280px] mx-auto px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Receitas</h1>

            <div className="flex gap-4">
              <button
                onClick={handleNewIncome}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold transition"
              >
                Nova Receita
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
          <div className="mb-6">
            <input
              type="text"
              placeholder="Filtrar receitas pelo título"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
              aria-label="Filtrar receitas pelo título"
            />
          </div>

          {/* Lista de cards */}
          {loading ? (
            <p>Carregando receitas...</p>
          ) : filteredIncomes.length === 0 ? (
            <p>Nenhuma receita encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredIncomes.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => handleCardClick(tx.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleCardClick(tx.id);
                  }}
                  className="relative rounded-2xl p-6 min-h-[180px] min-w-[220px] max-w-[280px] shadow-md transition cursor-pointer flex flex-col group bg-[#1f2937] hover:bg-[#374151] hover:brightness-110"
                  aria-label={`Detalhes da receita: ${tx.category}, valor ${formatCurrency(tx.amount)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-xl font-semibold leading-tight max-w-[calc(100%-40px)] overflow-hidden text-ellipsis break-words"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        hyphens: 'auto',
                        WebkitHyphens: 'auto',
                        MozHyphens: 'auto',
                        msHyphens: 'auto',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}
                      title={tx.category}
                      lang="pt"
                    >
                      {tx.category}
                    </h3>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openDeleteModal(tx);
                      }}
                      title="Excluir receita"
                      className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                      aria-label="Excluir receita"
                    >
                      <Trash size={20} />
                    </button>
                  </div>

                  <p className="text-green-400 font-bold text-2xl mb-2">
                    {formatCurrency(tx.amount)}
                  </p>

                  <p className="text-gray-400 text-sm mb-2 line-clamp-2 whitespace-pre-wrap break-words max-h-[4.5rem]">
                    {tx.description || 'Sem descrição'}
                  </p>

                  <p className="text-xs text-gray-400 mt-auto">
                    {tx.date ? new Date(tx.date).toLocaleDateString('pt-BR') : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <DashboardRightPanel />

      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir a receita "${transactionToDelete?.category}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
