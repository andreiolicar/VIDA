import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Estados do formulário de edição
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [status, setStatus] = useState('a_fazer');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState('');
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [saving, setSaving] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta':
        return 'text-red-500';
      case 'media':
      case 'média':
        return 'text-yellow-400';
      case 'baixa':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const isDueDateExpired = (dueDate, status) => {
    if (!dueDate) return false;
    if (status === 'feito') return false;
    return new Date(dueDate) < new Date();
  };

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar tarefa:', err);
      setError('Erro ao carregar a tarefa.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      setLoadingLists(true);
      const res = await axios.get(`/task-lists/user/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar listas:', err);
      setLists([]);
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const openEditModal = () => {
    if (!task) return;
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'media');
    setStatus(task.status || 'a_fazer');
    setDueDate(task.dueDate ? task.dueDate.substring(0, 16) : '');
    setListId(task.listId || '');
    fetchLists();
    setSaving(false);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      await axios.patch(
        `/tasks/${id}`,
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          listId: Number(listId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditModalOpen(false);
      fetchTask();
    } catch (error) {
      alert('Erro ao salvar tarefa.');
      console.error(error);
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-white">Carregando...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;
  if (!task) return <p className="p-8 text-gray-400">Tarefa não encontrada.</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">{task.title}</h1>
          <div className="flex items-center gap-2">
            {/* Botão Marcar como concluído (toggle) */}
            <button
              onClick={async () => {
                try {
                  const novoStatus = task.status === 'feito' ? 'a_fazer' : 'feito';
                  await axios.patch(
                    `/tasks/${id}`,
                    { status: novoStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  fetchTask();
                } catch (err) {
                  alert('Erro ao atualizar status da tarefa.');
                  console.error(err);
                }
              }}
              className={`px-4 py-2 rounded-lg font-semibold ${
                task.status === 'feito'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              title={task.status === 'feito' ? 'Reverter para não concluída' : 'Marcar como concluída'}
            >
              {task.status === 'feito' ? 'Não Concluir' : 'Concluir'}
            </button>

            {/* Botão Editar */}
            <button
              onClick={openEditModal}
              title="Editar tarefa"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              Editar Tarefa
            </button>

            {/* Botão Voltar */}
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
            >
              Voltar
            </button>
          </div>
        </div>

        {task.list && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Lista</h2>
            <p className="text-gray-300">{task.list.title}</p>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Descrição</h2>
          <p className="whitespace-pre-wrap text-gray-300">{task.description || 'Sem descrição'}</p>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-6 max-w-md">
          <div className="flex flex-col items-start">
            <span className="font-semibold">Prioridade:</span>
            <span className={`font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Não Definida'}
            </span>
          </div>

          <div className="flex flex-col items-start">
            <span className="font-semibold">Status:</span>
            <span className="font-medium">{formatStatus(task.status)}</span>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Data de criação</h3>
            <p className="text-gray-300">{new Date(task.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Última atualização</h3>
            <p className="text-gray-300">{new Date(task.updatedAt).toLocaleString()}</p>
          </div>

          <div>
            <h3
              className={`font-semibold text-lg mb-1 ${
                task.status === 'feito'
                  ? 'text-green-500'
                  : isDueDateExpired(task.dueDate, task.status)
                  ? 'text-red-500'
                  : 'text-blue-400'
              }`}
            >
              Data do prazo
            </h3>
            <p
              className={`flex items-center gap-2 ${
                task.status === 'feito'
                  ? 'text-green-500'
                  : isDueDateExpired(task.dueDate, task.status)
                  ? 'text-red-500'
                  : 'text-gray-300'
              }`}
            >
              {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'Não definido'}

              {task.status === 'feito' ? (
                <span className="font-semibold">Tarefa Concluída</span>
              ) : isDueDateExpired(task.dueDate, task.status) ? (
                <span className="font-semibold">Prazo Expirado</span>
              ) : null}
            </p>
          </div>
        </section>
      </main>

      <DashboardRightPanel />

      {/* Modal Inline */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSave}
            className="bg-[#1f2937] p-6 rounded-xl max-w-md w-full text-white shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Editar Tarefa</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Título </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
              >
                {['baixa', 'media', 'alta'].map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
              >
                {['a_fazer', 'fazendo', 'feito'].map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Lista</label>
              {loadingLists ? (
                <p>Carregando listas...</p>
              ) : lists.length === 0 ? (
                <p className="text-gray-400">Nenhuma lista cadastrada.</p>
              ) : (
                <select
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                  required
                  className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
                >
                  <option value="">Selecione uma lista</option>
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium">Data do Prazo</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
