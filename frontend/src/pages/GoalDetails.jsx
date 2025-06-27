import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Edit3, Trash2, PlusCircle, MinusCircle, ArrowLeft, MoreVertical } from 'lucide-react';
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
    const amount = payload[0].value;
    const color = amount >= 0 ? '#22c55e' : '#ef4444';
    return (
      <div className="bg-[#1f2937] p-2 rounded shadow-lg text-white">
        <p className="font-semibold">{label}</p>
        <p style={{ color, fontWeight: 'bold' }}>{formatCurrency(amount)}</p>
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
  const [errorMsgAdd, setErrorMsgAdd] = useState('');
  const [errorMsgRemove, setErrorMsgRemove] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  
  const actionsRef = useRef(null);
  const [actionsOpen, setActionsOpen] = useState(false);

  const [history, setHistory] = useState([]);

  const chartContainerRef = useRef(null);

  const updateStatus = (currentAmount, targetAmount) => {
    return currentAmount >= targetAmount ? 'completed' : 'active';
  };

  useEffect(() => {
    async function fetchGoalAndHistory() {
      try {
        setLoading(true);
        const resGoal = await axios.get(`/finance/${userId}/goals/${id}`);
        const found = resGoal.data;
        if (!found) {
          setError('Meta financeira não encontrada.');
          setLoading(false);
          return;
        }
        setGoal(found);

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

  useEffect(() => {
    if (goal) {
      setCanEdit(goal.status !== 'completed');
    }
  }, [goal]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setActionsOpen(false);
      }
    }
    if (actionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionsOpen]);

  const progressPercent = goal ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;

  const refreshData = async () => {
    try {
      const resGoal = await axios.get(`/finance/${userId}/goals/${id}`);
      setGoal(resGoal.data);
      const resHistory = await axios.get(`/finance/${userId}/goals/${id}/history`);
      setHistory(Array.isArray(resHistory.data) ? resHistory.data : []);
      if (chartContainerRef.current) {
        chartContainerRef.current.scrollLeft = chartContainerRef.current.scrollWidth;
      }
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
    }
  };

  const handleAddAmount = async () => {
    const val = Number(newAmount);
    if (isNaN(val) || val <= 0) {
      setErrorMsgAdd('Informe um valor válido para aporte.');
      return;
    }
    setAdding(true);
    setErrorMsgAdd('');
    try {
      await axios.patch(`/finance/${userId}/goals/${id}`, { amountToAdd: val });
      await refreshData();
      setNewAmount('');
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.message) {
        setErrorMsgAdd(error.response.data.message);
      } else {
        setErrorMsgAdd('Erro ao adicionar aporte. Tente novamente.');
      }
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAmount = async () => {
    const val = Number(removingAmount);
    if (isNaN(val) || val <= 0) {
      setErrorMsgRemove('Informe um valor válido para remoção.');
      return;
    }
    setRemoving(true);
    setErrorMsgRemove('');
    try {
      await axios.patch(`/finance/${userId}/goals/${id}/remove`, { amountToRemove: val });
      await refreshData();
      setRemovingAmount('');
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.message) {
        setErrorMsgRemove(error.response.data.message);
      } else {
        setErrorMsgRemove('Erro ao remover aporte. Tente novamente.');
      }
    } finally {
      setRemoving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setActionsOpen(false); // Fecha o dropdown ao abrir o modal
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/finance/${userId}/goals/${goal.id}`);
      setShowDeleteConfirm(false);
      navigate('/dashboard/finance');
    } catch (error) {
      alert('Erro ao excluir meta.');
      setShowDeleteConfirm(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <p className="text-white p-8">Carregando...</p>;
  if (error) return <p className="text-red-500 p-8">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto" style={{ minWidth: 0 }}>
        <div className="flex flex-col" style={{ minWidth: 0 }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{goal.title}</h1>

            {/* Container dos botões Ações e Voltar */}
            <div className="flex items-center gap-4" ref={actionsRef}>
              {/* Botão Ações */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
                  onClick={() => setActionsOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={actionsOpen}
                  aria-controls="actions-menu"
                >
                  Ações
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown Ações */}
                {actionsOpen && (
                  <ul
                    id="actions-menu"
                    className="absolute right-0 mt-2 w-48 bg-[#1f2937] rounded-md shadow-lg z-50 py-1 text-white border border-gray-700 animate-fadeIn"
                    role="menu"
                    aria-label="Menu de ações"
                  >
                    <li role="none">
                      <Link
                        to={`/dashboard/finance/edit-goal/${goal.id}`}
                        className={`block w-full text-left px-4 py-2 hover:bg-blue-600 transition ${
                          canEdit ? '' : 'opacity-50 cursor-not-allowed'
                        }`}
                        tabIndex={canEdit ? 0 : -1}
                        aria-disabled={!canEdit}
                        role="menuitem"
                        onClick={e => {
                          if (!canEdit) e.preventDefault();
                          setActionsOpen(false);
                        }}
                      >
                        <Edit3 size={16} className="inline mr-2" />
                        Editar
                      </Link>
                    </li>
                    <li role="none">
                      <button
                        onClick={handleDeleteClick}
                        className="block w-full text-left px-4 py-2 hover:bg-red-600 transition"
                        role="menuitem"
                      >
                        <Trash2 size={16} className="inline mr-2" />
                        Excluir
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              {/* Botão Voltar */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
                aria-label="Voltar"
              >
                <ArrowLeft size={20} />
                Voltar
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
              <div
                ref={chartContainerRef}
                className="bg-[#1f2937] rounded-xl p-4 text-white flex select-none custom-scrollbar-horizontal"
                style={{
                  maxWidth: '100%',
                  width: '100%',
                  overflowX: 'scroll',
                  overflowY: 'hidden',
                  height: 320,
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: 900,
                    height: 250,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={history}
                      margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        tick={{ fontSize: 12 }}
                        padding={{ left: 20, right: 20 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        width={100}
                        domain={['auto', 'auto']}
                        padding={{ left: 10 }}
                        tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
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
                aria-invalid={!!errorMsgAdd}
                aria-describedby="error-aporte"
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
            {errorMsgAdd && (
              <p id="error-aporte" className="text-red-500 mt-2 font-semibold" role="alert">
                {errorMsgAdd}
              </p>
            )}
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
                aria-invalid={!!errorMsgRemove}
                aria-describedby="error-remocao"
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
            {errorMsgRemove && (
              <p id="error-remocao" className="text-red-500 mt-2 font-semibold" role="alert">
                {errorMsgRemove}
              </p>
            )}
          </section>

          {/* Modal de confirmação de exclusão */}
          {showDeleteConfirm && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="bg-white rounded-lg p-6 max-w-sm w-full text-gray-900">
                <h2 id="modal-title" className="text-xl font-semibold mb-4">
                  Confirmar exclusão
                </h2>
                <p className="mb-6">Tem certeza que deseja excluir esta meta financeira?</p>
                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    onClick={confirmDelete}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dicas das metas */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Dicas para melhorar sua meta</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Mantenha aportes regulares para garantir o progresso.</li>
              <li>Revise seu orçamento mensal para aumentar a poupança.</li>
              <li>Evite gastos desnecessários para acelerar a meta.</li>
              <li>Considere investimentos para potencializar seus recursos.</li>
              <li>Reavalie sua meta periodicamente e ajuste se necessário.</li>
            </ul>
          </section>
        </div>
      </main>
      <DashboardRightPanel />
      <style>{`
        .custom-scrollbar-horizontal::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 8px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 8px;
          border: 2px solid #1f2937;
        }
        .custom-scrollbar-horizontal {
          scrollbar-width: thin;
          scrollbar-color: #374151 #1f2937;
        }
        /* Animação para o dropdown */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
