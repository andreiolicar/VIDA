import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import TaskCard from '@/components/TaskCard';

const STATUS = [
  { value: 'a_fazer', label: 'A Fazer' },
  { value: 'fazendo', label: 'Fazendo' }, 
  { value: 'feito', label: 'Feito' },
];

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
  const STATUSES = ['a_fazer', 'fazendo', 'feito']; // corrigido aqui

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

export default function KanbanTasks() {
  const userId = localStorage.getItem('user');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/tasks/user/${userId}`);
      setTasks(res.data || []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setEditTaskModalOpen(true);
  };

  const saveTaskEdits = async (updatedTask) => {
    try {
      await axios.patch(`/tasks/${updatedTask.id}`, {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        status: updatedTask.status,
      });
      setEditTaskModalOpen(false);
      setTaskToEdit(null);
      fetchTasks();
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
      fetchTasks();
    } catch (err) {
      alert('Erro ao excluir tarefa.');
    }
  };

  const cancelDeleteTask = () => {
    setDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'feito' ? 'a_fazer' : 'feito';
      await axios.patch(`/tasks/${task.id}`, { status: newStatus });
      fetchTasks();
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  const handleMoveTask = async (task, newStatus) => {
    if (task.status === newStatus) return;
    try {
      await axios.patch(`/tasks/${task.id}`, { status: newStatus });
      fetchTasks();
    } catch {
      alert('Erro ao mover tarefa.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 px-12 py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Kanban de Tarefas</h1>
            <div className="flex gap-4">
              <Link
                to="/dashboard/tasks"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
              >
                ← Voltar
              </Link>
              <Link
                to="/dashboard/newtask"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
              >
                + Nova Tarefa
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {STATUS.map((col) => (
              <div key={col.value}>
                <h2 className="text-xl font-semibold mb-4">{col.label}</h2>
                <div className="space-y-4 min-h-[120px]">
                  {loading ? (
                    <p className="text-gray-400">Carregando...</p>
                  ) : tasks.filter((t) => t.status === col.value).length === 0 ? (
                    <p className="text-gray-400">Nenhuma tarefa</p>
                  ) : (
                    tasks
                      .filter((t) => t.status === col.value)
                      .map((task) => (
                        <div key={task.id} className="group min-w-[220px]">
                          <TaskCard
                            task={task}
                            onEdit={() => openEditTaskModal(task)}
                            onDelete={() => openDeleteTaskModal(task)}
                            onToggleStatus={() => handleToggleStatus(task)}
                            extraButtons={
                              <div className="flex flex-col gap-1 mt-2">
                                {STATUS.filter((s) => s.value !== col.value).map((s) => (
                                  <button
                                    key={s.value}
                                    className="bg-[#374151] text-xs text-white rounded px-2 py-1 hover:bg-[#4b5563] transition"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleMoveTask(task, s.value);
                                    }}
                                    title={`Mover para "${s.label}"`}
                                  >
                                    {s.label}
                                  </button>
                                ))}
                              </div>
                            }
                          />
                        </div>
                      ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <DashboardRightPanel />

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
