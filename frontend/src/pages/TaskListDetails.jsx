import { useEffect, useState } from 'react';
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

function EditTaskModal({ isOpen, onClose, task, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('baixa');
  const [status, setStatus] = useState('a_fazer');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'baixa');
      setStatus(task.status || 'a_fazer');
      setSaving(false);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const PRIORITIES = ['baixa', 'média', 'alta'];
  const STATUSES = ['a_fazer', 'fazendo', 'feito'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      await onSave({
        id: task.id,
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
      });
      onClose();
    } catch {
      alert('Erro ao salvar tarefa.');
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
        <h2 className="text-xl font-semibold mb-4">Editar Tarefa</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Título *</label>
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
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
              </option>
            ))}
          </select>
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

  const openEditListModal = () => {
    setListToEdit(list);
    setEditListModalOpen(true);
  };

  const saveListEdits = async (updatedList) => {
    try {
      await axios.patch(
        `/task-lists/${updatedList.id}`,
        {
          title: updatedList.title,
          type: updatedList.type,
          description: updatedList.description,
          favorite: updatedList.favorite,
        }
      );
      setEditListModalOpen(false);
      setListToEdit(null);
      fetchList();
    } catch (err) {
      alert('Erro ao salvar lista.');
      throw err;
    }
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setEditTaskModalOpen(true);
  };

  const saveTaskEdits = async (updatedTask) => {
    try {
      await axios.patch(
        `/tasks/${updatedTask.id}`,
        {
          title: updatedTask.title,
          description: updatedTask.description,
          priority: updatedTask.priority,
          status: updatedTask.status,
        }
      );
      setEditTaskModalOpen(false);
      setTaskToEdit(null);
      fetchList();
    } catch (err) {
      alert('Erro ao salvar tarefa.');
      throw err;
    }
  };

  const openDeleteTaskModal = (task) => {
    setTaskToDelete(task);
    setDeleteTaskModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await axios.delete(`/tasks/${taskToDelete.id}`);
      setDeleteTaskModalOpen(false);
      setTaskToDelete(null);
      fetchList();
    } catch (err) {
      alert('Erro ao excluir tarefa.');
    }
  };

  const cancelDeleteTask = () => {
    setDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };

   const PRIORITY_ORDER = {
    alta: 1,
    média: 2,
    baixa: 3,
  };

  if (loading) return <p className="p-8 text-white">Carregando...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;
  if (!list) return <p className="p-8 text-gray-400">Lista não encontrada.</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">{list.title}</h1>

          {/* Botões com ordem invertida: Editar Lista à esquerda, Voltar à direita */}
          <div className="flex items-center gap-3">
            <button
              onClick={openEditListModal}
              title="Editar lista"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              <Edit size={18} /> Editar Lista
            </button>
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
            <p className="text-gray-300 whitespace-pre-wrap">{list.description}</p>
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

      <EditTaskModal
        isOpen={editTaskModalOpen}
        onClose={() => {
          setEditTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        task={taskToEdit}
        onSave={saveTaskEdits}
      />

      <ConfirmTaskDeleteModal
        isOpen={deleteTaskModalOpen}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir a tarefa "${taskToDelete?.title}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDeleteTask}
        onCancel={cancelDeleteTask}
      />
    </div>
  );
}
