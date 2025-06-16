import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { Edit, Trash } from 'lucide-react';

function ConfirmSubtaskDeleteModal({ isOpen, subtaskTitle, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] p-6 rounded-xl max-w-sm w-full text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
        <p className="mb-6">
          Tem certeza que deseja excluir a subtarefa &quot;{subtaskTitle}&quot;? Essa ação não pode ser desfeita.
        </p>
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

function EditSubtaskModal({ isOpen, subtask, onSave, onCancel }) {
  const [title, setTitle] = useState(subtask?.title || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && subtask) {
      setTitle(subtask.title || '');
      setSaving(false);
    }
  }, [isOpen, subtask]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!title.trim()) return alert('O título não pode ser vazio.');

    setSaving(true);
    try {
      await onSave({ ...subtask, title: title.trim() });
    } catch {
      alert('Erro ao salvar subtarefa.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1f2937] p-6 rounded-xl max-w-md w-full text-white shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Editar Subtarefa</h2>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
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

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Estados do formulário de edição da tarefa
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [status, setStatus] = useState('a_fazer');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState('');
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal exclusão da tarefa
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Subtasks e modais de subtarefa
  const [subtasks, setSubtasks] = useState([]);
  const [updatingSubtaskIds, setUpdatingSubtaskIds] = useState(new Set());

  const [newSubtask, setNewSubtask] = useState('');

  const [editSubtaskModalOpen, setEditSubtaskModalOpen] = useState(false);
  const [subtaskToEdit, setSubtaskToEdit] = useState(null);

  const [deleteSubtaskModalOpen, setDeleteSubtaskModalOpen] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);

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
      setSubtasks(res.data.subtasks || []);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleDeleteTask = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await axios.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleting(false);
      setDeleteModalOpen(false);
      navigate('/dashboard/tasks');
    } catch (err) {
      alert('Erro ao excluir tarefa.');
      console.error(err);
      setDeleting(false);
    }
  };

  // Função para alternar status da tarefa e subtarefas, usada pelo card e dropdown
  const handleToggleStatusFromCard = async (taskToToggle) => {
    try {
      const novoStatus = taskToToggle.status === 'feito' ? 'a_fazer' : 'feito';

      // Atualiza status da tarefa
      await axios.patch(
        `/tasks/${taskToToggle.id}`,
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza todas as subtarefas para o mesmo status
      if (subtasks.length > 0) {
        await Promise.all(
          subtasks
            .filter((st) => st.completed !== (novoStatus === 'feito'))
            .map((st) =>
              axios.patch(
                `/subtasks/${st.id}`,
                { completed: novoStatus === 'feito' },
                { headers: { Authorization: `Bearer ${token}` } }
              )
            )
        );
      }

      // Atualiza estados locais para refletir as mudanças
      setTask((prev) => (prev && prev.id === taskToToggle.id ? { ...prev, status: novoStatus } : prev));
      setSubtasks((prev) => prev.map((st) => ({ ...st, completed: novoStatus === 'feito' })));
    } catch (error) {
      alert('Erro ao atualizar status da tarefa e subtarefas.');
      console.error(error);
    }
  };

  // Função para alternar status da tarefa via dropdown (mantida para compatibilidade)
  const toggleStatus = async () => {
    if (!task) return;
    await handleToggleStatusFromCard(task);
    setDropdownOpen(false);
  };

  const handleEditClick = () => {
    openEditModal();
    setDropdownOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    setDropdownOpen(false);
  };

  // === FUNÇÃO ATUALIZADA ===
  const toggleSubtaskCompleted = async (subtaskId, currentCompleted) => {
    if (updatingSubtaskIds.has(subtaskId)) return;
    setUpdatingSubtaskIds(new Set(updatingSubtaskIds).add(subtaskId));

    try {
      const newCompleted = !currentCompleted;
      await axios.patch(
        `/subtasks/${subtaskId}`,
        { completed: newCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubtasks((prev) =>
        prev.map((st) =>
          st.id === subtaskId ? { ...st, completed: newCompleted } : st
        )
      );

      // Atualiza o array localmente para verificar o status correto
      const updatedSubtasks = subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: newCompleted } : st
      );

      const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
      const anyCompleted = updatedSubtasks.some(st => st.completed);

      let novoStatus = 'a_fazer';
      if (allCompleted) {
        novoStatus = 'feito';
      } else if (anyCompleted) {
        novoStatus = 'fazendo';
      } else {
        novoStatus = 'a_fazer';
      }

      if (task.status !== novoStatus) {
        await axios.patch(
          `/tasks/${id}`,
          { status: novoStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTask((prev) => ({ ...prev, status: novoStatus }));
      }
    } catch (error) {
      alert('Erro ao atualizar subtarefa.');
      console.error(error);
    } finally {
      const newSet = new Set(updatingSubtaskIds);
      newSet.delete(subtaskId);
      setUpdatingSubtaskIds(newSet);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    try {
      const res = await axios.post(
        '/subtasks',
        {
          taskId: task.id,
          title: newSubtask.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubtasks((prev) => [...prev, res.data]);
      setNewSubtask('');

      // Se a tarefa estiver concluída, ao adicionar subtarefa ela deve ser marcada como não concluída
      if (task.status === 'feito') {
        await axios.patch(
          `/tasks/${id}`,
          { status: 'a_fazer' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTask((prev) => ({ ...prev, status: 'a_fazer' }));
      }
    } catch (error) {
      alert('Erro ao adicionar subtarefa.');
      console.error(error);
    }
  };

  const openEditSubtaskModal = (subtask) => {
    setSubtaskToEdit(subtask);
    setEditSubtaskModalOpen(true);
  };

  const closeEditSubtaskModal = () => {
    setEditSubtaskModalOpen(false);
    setSubtaskToEdit(null);
  };

  const saveEditedSubtask = async (updatedSubtask) => {
    try {
      await axios.patch(
        `/subtasks/${updatedSubtask.id}`,
        { title: updatedSubtask.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubtasks((prev) =>
        prev.map((st) => (st.id === updatedSubtask.id ? updatedSubtask : st))
      );
      closeEditSubtaskModal();
    } catch {
      alert('Erro ao salvar subtarefa.');
    }
  };

  const openDeleteSubtaskModal = (subtask) => {
    setSubtaskToDelete(subtask);
    setDeleteSubtaskModalOpen(true);
  };

  const closeDeleteSubtaskModal = () => {
    setDeleteSubtaskModalOpen(false);
    setSubtaskToDelete(null);
  };

  const confirmDeleteSubtask = async () => {
    if (!subtaskToDelete) return;
    try {
      await axios.delete(`/subtasks/${subtaskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubtasks((prev) => prev.filter((st) => st.id !== subtaskToDelete.id));
      closeDeleteSubtaskModal();
    } catch {
      alert('Erro ao excluir subtarefa.');
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
          <h1
            className="text-3xl font-semibold break-words overflow-wrap-anywhere mr-6"
            style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
          >
            {task.title}
          </h1>
          <div className="flex items-center gap-2">
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
                <ul className="absolute right-0 mt-2 w-48 bg-[#1f2937] rounded-md shadow-lg z-50 py-1 text-white">
                  <li>
                    <button
                      onClick={toggleStatus}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-600 transition"
                    >
                      {task.status === 'feito' ? 'Reverter conclusão' : 'Marcar como concluída'}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleEditClick}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-600 transition"
                    >
                      Editar
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleDeleteClick}
                      className="block w-full text-left px-4 py-2 hover:bg-red-600 transition"
                    >
                      Excluir
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

        {task.list && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Lista</h2>
            <p
              className="text-gray-300 break-words overflow-wrap-anywhere"
              style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
            >
              {task.list.title}
            </p>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Descrição</h2>
          <p
            className="whitespace-pre-wrap break-words overflow-wrap-anywhere text-gray-300"
            style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
          >
            {task.description || 'Sem descrição'}
          </p>
        </section>

        <section className="mb-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Subtarefas</h2>
          {subtasks.length === 0 ? (
            <p className="text-gray-400">Nenhuma subtarefa cadastrada.</p>
          ) : (
            <ul className="space-y-4">
              {subtasks.map((subtask) => (
                <li
                  key={subtask.id}
                  className={`p-4 rounded-lg border flex justify-between items-center ${
                    subtask.completed ? 'border-green-500 bg-green-900' : 'border-gray-600 bg-[#111827]'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      disabled={updatingSubtaskIds.has(subtask.id)}
                      onChange={() => toggleSubtaskCompleted(subtask.id, subtask.completed)}
                      className="w-5 h-5 accent-green-500 cursor-pointer flex-shrink-0"
                      id={`subtask-${subtask.id}`}
                    />
                    <label
                      htmlFor={`subtask-${subtask.id}`}
                      className={`text-lg select-none truncate ${
                        subtask.completed ? 'line-through text-green-400' : 'text-white'
                      }`}
                      title={subtask.title}
                    >
                      {subtask.title}
                    </label>
                  </div>

                  <div className="flex gap-3 ml-4 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSubtaskToEdit(subtask);
                        setEditSubtaskModalOpen(true);
                      }}
                      title="Editar subtarefa"
                      className="text-blue-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubtaskToDelete(subtask);
                        setDeleteSubtaskModalOpen(true);
                      }}
                      title="Excluir subtarefa"
                      className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    >
                      <Trash size={18} />
                    </button>
                  </div>

                  <span
                    className={`text-sm font-semibold ml-4 ${
                      subtask.completed ? 'text-green-400' : 'text-gray-400'
                    }`}
                  >
                    {subtask.completed ? 'Concluído' : 'Pendente'}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddSubtask} className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Adicionar nova subtarefa"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="flex-1 rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
              disabled={!newSubtask.trim()}
            >
              Adicionar
            </button>
          </form>
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

      <EditSubtaskModal
        isOpen={editSubtaskModalOpen}
        subtask={subtaskToEdit}
        onSave={saveEditedSubtask}
        onCancel={() => {
          setEditSubtaskModalOpen(false);
          setSubtaskToEdit(null);
        }}
      />

      <ConfirmSubtaskDeleteModal
        isOpen={deleteSubtaskModalOpen}
        subtaskTitle={subtaskToDelete?.title || ''}
        onConfirm={() => {
          confirmDeleteSubtask();
        }}
        onCancel={() => {
          setDeleteSubtaskModalOpen(false);
          setSubtaskToDelete(null);
        }}
      />

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

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f2937] p-6 rounded-xl max-w-sm w-full text-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">Tem certeza que deseja excluir a tarefa "{task.title}"? Essa ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
