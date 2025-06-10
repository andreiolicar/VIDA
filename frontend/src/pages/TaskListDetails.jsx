import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';
import TaskCard from '@/components/TaskCard';
import { Edit } from 'lucide-react';

function EditListModal({ isOpen, onClose, list, onSave }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [saving, setSaving] = useState(false);

  const LIST_TYPES = [
    { value: 'mercado', label: 'Mercado' },
    { value: 'projeto', label: 'Projeto' },
    { value: 'doméstica', label: 'Doméstica' },
  ];

  useEffect(() => {
    if (isOpen && list) {
      setTitle(list.title || '');
      setType(list.type || 'mercado');
      setDescription(list.description || '');
      setFavorite(list.favorite || false);
      setSaving(false);
    }
  }, [isOpen, list]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      await onSave({ id: list.id, title, type, description, favorite });
      onClose();
    } catch {
      alert('Erro ao salvar lista.');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1f2937] p-6 rounded-xl max-w-md w-full text-white shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Editar Lista</h2>

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
          <label className="block mb-1 font-medium">Tipo </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
          >
            {LIST_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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

        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="favorite"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="favorite" className="select-none">
            Marcar como favorita
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
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
  );
}

function ConfirmTaskDeleteModal({ isOpen, title, message, onConfirm, onCancel }) {
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

export default function TaskListDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editListModalOpen, setEditListModalOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState(null);

  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [deleteListModalOpen, setDeleteListModalOpen] = useState(false);
  const [deletingList, setDeletingList] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [previouslyIncompleteTasks, setPreviouslyIncompleteTasks] = useState(null);

  // Função corrigida para salvar edição da lista
  const saveListEdits = async (updatedList) => {
    try {
      await axios.patch(
        `/task-lists/${updatedList.id}`,
        {
          title: updatedList.title,
          type: updatedList.type,
          description: updatedList.description,
          favorite: updatedList.favorite,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditListModalOpen(false);
      setListToEdit(null);
      fetchList();
    } catch (err) {
      alert('Erro ao salvar lista.');
      console.error(err);
      throw err;
    }
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/task-lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar lista:', err);
      setError('Erro ao carregar a lista.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [id]);

  // Funções para edição, exclusão e toggle de tarefas (copiado do seu código original)

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'media');
    setStatus(task.status || 'a_fazer');
    setDueDate(task.dueDate ? task.dueDate.substring(0, 16) : '');
    setListIdTask(task.listId || '');
    fetchLists();
    setSavingTask(false);
    setEditTaskModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setEditTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const saveTaskEdits = async (e) => {
    e.preventDefault();
    if (savingTask) return;

    setSavingTask(true);
    try {
      await axios.patch(
        `/tasks/${taskToEdit.id}`,
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          listId: Number(listIdTask),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditTaskModalOpen(false);
      fetchList();
    } catch {
      alert('Erro ao salvar tarefa.');
      setSavingTask(false);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const novoStatus = task.status === 'feito' ? 'a_fazer' : 'feito';
      await axios.patch(
        `/tasks/${task.id}`,
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchList();
    } catch {
      alert('Erro ao atualizar status da tarefa.');
    }
  };

  const openDeleteTaskModal = (task) => {
    setTaskToDelete(task);
    setDeleteTaskModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await axios.delete(`/tasks/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteTaskModalOpen(false);
      setTaskToDelete(null);
      fetchList();
    } catch {
      alert('Erro ao excluir tarefa.');
    }
  };

  const cancelDeleteTask = () => {
    setDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };

  const handleDeleteList = async () => {
    if (deletingList) return;
    setDeletingList(true);
    try {
      await axios.delete(`/task-lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletingList(false);
      setDeleteListModalOpen(false);
      navigate('/dashboard/tasks');
    } catch {
      alert('Erro ao excluir lista.');
      setDeletingList(false);
    }
  };

  const cancelDeleteList = () => {
    setDeleteListModalOpen(false);
  };

  const formatListType = (type) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleCompleteList = async () => {
    if (!list || !list.tasks || list.tasks.length === 0) {
      setDropdownOpen(false);
      return;
    }

    const allDone = list.tasks.every((task) => task.status === 'feito');

    try {
      if (!allDone) {
        const incompleteTasks = list.tasks.filter((task) => task.status !== 'feito').map((t) => t.id);
        setPreviouslyIncompleteTasks(incompleteTasks);

        await Promise.all(
          list.tasks.map((task) =>
            axios.patch(
              `/tasks/${task.id}`,
              { status: 'feito' },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      } else {
        if (previouslyIncompleteTasks && previouslyIncompleteTasks.length > 0) {
          await Promise.all(
            previouslyIncompleteTasks.map((taskId) =>
              axios.patch(
                `/tasks/${taskId}`,
                { status: 'a_fazer' },
                { headers: { Authorization: `Bearer ${token}` } }
              )
            )
          );
        }
        setPreviouslyIncompleteTasks(null);
      }

      fetchList();
      setDropdownOpen(false);
    } catch {
      alert('Erro ao atualizar as tarefas da lista.');
    }
  };

  const PRIORITY_ORDER = {
    alta: 1,
    média: 2,
    baixa: 3,
  };

  // Estados e funções para formulário de edição da tarefa
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [status, setStatus] = useState('a_fazer');
  const [dueDate, setDueDate] = useState('');
  const [listIdTask, setListIdTask] = useState('');
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [savingTask, setSavingTask] = useState(false);

  const fetchLists = async () => {
    try {
      setLoadingLists(true);
      const res = await axios.get(`/task-lists/user/${localStorage.getItem('user')}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(res.data || []);
    } catch {
      setLists([]);
    } finally {
      setLoadingLists(false);
    }
  };

  if (loading) return <p className="p-8 text-white">Carregando...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;
  if (!list) return <p className="p-8 text-gray-400">Lista não encontrada.</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1
              className="text-3xl font-semibold break-words overflow-wrap-anywhere"
              style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
            >
              {list.title}
            </h1>
            <div
              className="text-gray-400 italic mt-1 break-words overflow-wrap-anywhere"
              style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
            >
              Tipo: {formatListType(list.type)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
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
                    <button
                      onClick={handleCompleteList}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-600 transition"
                    >
                      {list.tasks && list.tasks.length > 0 && list.tasks.every((task) => task.status === 'feito')
                        ? 'Reverter conclusão da lista'
                        : 'Concluir toda a lista'}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setEditListModalOpen(true);
                        setListToEdit(list);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-600 transition"
                    >
                      Editar Lista
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(`/dashboard/newtask?listId=${id}`);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-green-600 transition"
                    >
                      Nova Tarefa
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setDeleteListModalOpen(true)}
                      className="block w-full text-left px-4 py-2 hover:bg-red-600 transition"
                    >
                      Excluir Lista
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
            >
              Voltar
            </button>
          </div>
        </div>

        {list.description && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
            <p
              className="text-gray-300 whitespace-pre-wrap break-words overflow-wrap-anywhere"
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
            >
              {list.description}
            </p>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-4">Tarefas</h2>
          {list.tasks && list.tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {list.tasks
                .slice()
                .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={() => openEditTaskModal(task)}
                    onDelete={() => openDeleteTaskModal(task)}
                    onToggleStatus={() => toggleTaskStatus(task)}
                  />
                ))}
            </div>
          ) : (
            <p className="text-gray-400">Nenhuma tarefa nesta lista.</p>
          )}
        </section>
      </main>

      <DashboardRightPanel />

      <EditListModal
        isOpen={editListModalOpen}
        onClose={() => {
          setEditListModalOpen(false);
          setListToEdit(null);
        }}
        list={listToEdit}
        onSave={saveListEdits}
      />

      {/* Modal inline para edição da tarefa */}
      {editTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={saveTaskEdits}
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
                  value={listIdTask}
                  onChange={(e) => setListIdTask(e.target.value)}
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
                onClick={() => setEditTaskModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
                disabled={savingTask}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                disabled={savingTask}
              >
                {savingTask ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de confirmação exclusão da tarefa */}
      {deleteTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f2937] p-6 rounded-xl max-w-sm w-full text-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir a tarefa "{taskToDelete?.title}"? Essa ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDeleteTask}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de exclusão da lista */}
      {deleteListModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f2937] p-6 rounded-xl max-w-sm w-full text-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir a lista "{list?.title}"? Essa ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDeleteList}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
                disabled={deletingList}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteList}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                disabled={deletingList}
              >
                {deletingList ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
