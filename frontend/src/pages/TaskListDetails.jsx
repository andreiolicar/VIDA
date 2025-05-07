import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';
import TaskCard from '@/components/TaskCard';

export default function TaskListDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para modais e tarefa selecionada
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Função para buscar lista e tarefas
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

  // Abrir modal edição tarefa
  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setEditTaskModalOpen(true);
  };

  // Salvar edição tarefa
  const saveTaskEdits = async (updatedTask) => {
    try {
      await axios.patch(
        `/tasks/${updatedTask.id}`,
        {
          title: updatedTask.title,
          description: updatedTask.description,
          priority: updatedTask.priority,
          status: updatedTask.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditTaskModalOpen(false);
      setTaskToEdit(null);
      fetchList();
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err);
      throw err;
    }
  };

  // Abrir modal exclusão tarefa
  const openDeleteTaskModal = (task) => {
    setTaskToDelete(task);
    setDeleteTaskModalOpen(true);
  };

  // Confirmar exclusão tarefa
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await axios.delete(`/tasks/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteTaskModalOpen(false);
      setTaskToDelete(null);
      fetchList();
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err.response || err);
      alert('Erro ao excluir tarefa: ' + (err.response?.data?.message || err.message));
    }
  };

  // Cancelar exclusão tarefa
  const cancelDeleteTask = () => {
    setDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };

  // Alternar status da tarefa (concluir/reabrir)
  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'feito' ? 'a_fazer' : 'feito';
      await axios.patch(
        `/tasks/${task.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchList();
    } catch (err) {
      console.error('Erro ao atualizar status da tarefa:', err);
      alert('Erro ao atualizar status');
    }
  };

  // --- Modais inline copiados do dashboard ---

  // Modal para edição inline da tarefa
  function EditTaskModal({ isOpen, onClose, task, onSave }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('baixa');
    const [status, setStatus] = useState('a_fazer');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setPriority(task.priority || 'baixa');
        setStatus(task.status || 'a_fazer');
      }
    }, [task]);

    if (!isOpen) return null;

    const PRIORITIES = ['baixa', 'média', 'alta'];
    const STATUSES = ['a_fazer', 'em_andamento', 'feito'];

    const handleSubmit = async (e) => {
      e.preventDefault();
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
              onClick={onClose}
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

  // Modal para confirmação de exclusão da tarefa
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

  // --- Fim dos modais inline ---

  if (loading) return <p className="p-8 text-white">Carregando...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;
  if (!list) return <p className="p-8 text-gray-400">Lista não encontrada.</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">{list.title}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/dashboard/task-list/edit/${list.id}`)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              Editar Lista
            </button>
            <Link
              to="/dashboard/tasks"
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
            >
              Voltar
            </Link>
          </div>
        </div>

        {list.description && (
          <p className="mb-6 text-gray-300">{list.description}</p>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">Tarefas da Lista</h2>
          {list.tasks && list.tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {list.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => openEditTaskModal(task)}
                  onDelete={() => openDeleteTaskModal(task)}
                  onToggleStatus={() => handleToggleStatus(task)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Nenhuma tarefa nesta lista.</p>
          )}
        </div>
      </main>

      <DashboardRightPanel />

      {/* Modais inline */}

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
