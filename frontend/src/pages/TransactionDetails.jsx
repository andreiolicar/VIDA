import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { Edit, Trash, Copy, Repeat, UploadCloud } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function ConfirmDeleteModal({ isOpen, onConfirm, onCancel, title }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] p-6 rounded-xl max-w-sm w-full text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
        <p className="mb-6">
          Tem certeza que deseja excluir a transação &quot;{title}&quot;? Essa ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionDetails() {
  const { id } = useParams();
  const userId = localStorage.getItem('user');
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Comentários
  const [comments, setComments] = useState('');
  const [editComments, setEditComments] = useState(false);
  const [savingComments, setSavingComments] = useState(false);

  // Histórico de alterações
  const [history, setHistory] = useState([]);

  // Anexos
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Categorias relacionadas
  const [relatedCategories, setRelatedCategories] = useState([]);

  // Gráfico de impacto financeiro (saldo mensal)
  const [monthlyImpact, setMonthlyImpact] = useState([]);

  // Função para buscar dados da transação e dados relacionados
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/finance/${userId}/transactions`);
      const tx = res.data.find((t) => t.id === Number(id));
      if (!tx) {
        setError('Transação não encontrada.');
        setLoading(false);
        return;
      }
      setTransaction(tx);
      setComments(tx.comments || '');
      setAttachments(tx.attachments || []);
      // Simular histórico de alterações (ideal buscar da API)
      setHistory([
        { date: '2025-05-01T10:00:00Z', field: 'amount', oldValue: '100.00', newValue: '150.00' },
        { date: '2025-05-03T14:30:00Z', field: 'category', oldValue: 'Lazer', newValue: 'Restaurante' },
      ]);
      // Simular categorias relacionadas
      setRelatedCategories(['Alimentação', 'Lazer', 'Transporte']);
      // Simular gráfico de impacto financeiro mensal
      setMonthlyImpact([
        { month: 'Jan', balance: 5000 },
        { month: 'Feb', balance: 4800 },
        { month: 'Mar', balance: 5100 },
        { month: 'Apr', balance: 4950 },
        { month: 'May', balance: 5200 },
      ]);
    } catch {
      setError('Erro ao carregar transação.');
    } finally {
      setLoading(false);
    }
  }, [id, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isIncome = transaction?.type === 'income';

  const handleDelete = async () => {
    try {
      await axios.delete(`/finance/${userId}/transactions/${id}`);
      navigate('/dashboard/finance');
    } catch {
      alert('Erro ao excluir transação.');
    }
  };

  const handleSaveComments = async () => {
    setSavingComments(true);
    try {
      await axios.patch(`/finance/${userId}/transactions/${id}`, { comments });
      setEditComments(false);
    } catch {
      alert('Erro ao salvar comentários.');
    } finally {
      setSavingComments(false);
    }
  };

  const handleDuplicate = () => {
    navigate('/dashboard/finance/new-transaction', { state: { duplicate: transaction } });
  };

  const handleToggleRecurring = async () => {
    try {
      await axios.patch(`/finance/${userId}/transactions/${id}`, { recurring: !transaction.recurring });
      setTransaction((prev) => ({ ...prev, recurring: !prev.recurring }));
    } catch {
      alert('Erro ao atualizar recorrência.');
    }
  };

  // Upload de anexos
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (let file of files) {
        formData.append('files', file);
      }
      // Supondo que a API aceite upload multipart/form-data em endpoint específico
      const res = await axios.post(`/finance/${userId}/transactions/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Atualiza anexos com resposta da API
      setAttachments((prev) => [...prev, ...res.data]);
    } catch {
      alert('Erro ao enviar anexos.');
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  if (loading) return <p className="text-white p-8">Carregando...</p>;
  if (error) return <p className="text-red-400 p-8">{error}</p>;
  if (!transaction) return <p className="text-gray-400 p-8">Transação não encontrada.</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold break-words overflow-wrap-anywhere mr-6" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
            Detalhes da Transação
          </h1>
          <div className="flex items-center gap-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Ações
              <svg
                className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-56 bg-[#1f2937] rounded-md shadow-lg z-50 py-1 text-white">
                <li>
                  <Link
                    to={`/dashboard/finance/edit-transaction/${transaction.id}`}
                    className="block w-full text-left px-4 py-2 hover:bg-indigo-700 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Edit className="inline mr-2" size={16} />
                    Editar
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-red-700 transition"
                  >
                    <Trash className="inline mr-2" size={16} />
                    Excluir
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleDuplicate();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-indigo-700 transition"
                  >
                    <Copy className="inline mr-2" size={16} />
                    Duplicar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleToggleRecurring();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-indigo-700 transition"
                  >
                    <Repeat className="inline mr-2" size={16} />
                    {transaction.recurring ? 'Desmarcar recorrente' : 'Marcar como recorrente'}
                  </button>
                </li>
              </ul>
            )}
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold ml-2"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Informações Básicas */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-6">Informações Básicas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-lg max-w-md">
            <div>
              <p>
                <strong>Tipo:</strong>{' '}
                <span className={isIncome ? 'text-green-400' : 'text-red-400'}>
                  {isIncome ? 'Receita' : 'Despesa'}
                </span>
              </p>
            </div>
            <div>
              <p><strong>Categoria:</strong> {transaction.category}</p>
            </div>
            <div>
              <p>
                <strong>Valor:</strong>{' '}
                <span className={isIncome ? 'text-green-400' : 'text-red-400'}>
                  R$ {transaction.amount.toFixed(2)}
                </span>
              </p>
            </div>
            <div>
              <p><strong>Data:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
        </section>

        {/* Descrição */}
        {transaction.description && (
          <section className="mb-10 max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">Descrição</h2>
            <p
              className="whitespace-pre-wrap break-words overflow-wrap-anywhere text-gray-300 text-lg"
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
            >
              {transaction.description}
            </p>
          </section>
        )}

        {/* Comentários */}
        <section className="mb-10 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            Comentários
            {!editComments ? (
              <button
                onClick={() => setEditComments(true)}
                className="text-indigo-400 hover:text-indigo-600 font-semibold"
              >
                Editar
              </button>
            ) : (
              <div>
                <button
                  onClick={() => setEditComments(false)}
                  className="mr-2 text-gray-400 hover:text-gray-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveComments}
                  disabled={savingComments}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded font-semibold"
                >
                  {savingComments ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            )}
          </h2>
          {!editComments ? (
            <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere text-gray-300 text-lg" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              {comments || 'Nenhum comentário adicionado.'}
            </p>
          ) : (
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-indigo-500 resize-none"
            />
          )}
        </section>

        {/* Anexos */}
        <section className="mb-10 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Anexos / Comprovantes
            <label htmlFor="file-upload" className="cursor-pointer text-indigo-400 hover:text-indigo-600">
              <UploadCloud size={20} />
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf"
              disabled={uploading}
            />
          </h2>
          {attachments.length === 0 ? (
            <p className="text-gray-400">Nenhum anexo enviado.</p>
          ) : (
            <ul className="flex flex-wrap gap-4">
              {attachments.map((file, idx) => (
                <li key={idx} className="bg-[#111827] rounded-lg p-2 w-32 h-32 flex flex-col items-center justify-center text-sm overflow-hidden">
                  {file.type?.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="max-w-full max-h-20 rounded mb-1 object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-20 mb-1">
                      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    </div>
                  )}
                  <p className="truncate w-full text-center">{file.name}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Categorias Relacionadas */}
        <section className="mb-10 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Categorias Relacionadas</h2>
          {relatedCategories.length === 0 ? (
            <p className="text-gray-400">Nenhuma sugestão disponível.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {relatedCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => alert(`Você pode reclassificar para: ${cat}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-full text-sm font-semibold transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Gráfico de impacto financeiro */}
        <section className="mb-10 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Impacto Financeiro Mensal</h2>
          {monthlyImpact.length === 0 ? (
            <p className="text-gray-400">Dados indisponíveis.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyImpact} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>
      </main>

      <DashboardRightPanel />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onConfirm={() => {
          setDeleteModalOpen(false);
          handleDelete();
        }}
        onCancel={() => setDeleteModalOpen(false)}
        title={transaction.category}
      />
    </div>
  );
}
