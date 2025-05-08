import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/services/axios';
import { Plus, KanbanSquare, Edit, Trash } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import TaskCard from '@/components/TaskCard';

const LIST_TYPES = [
  { value: 'mercado', label: 'Mercado' },
  { value: 'projeto', label: 'Projeto' },
  { value: 'doméstica', label: 'Doméstica' },
];

const ITEMS_PER_PAGE = 6;

function EditListModal({ isOpen, onClose, list, onSave }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [saving, setSaving] = useState(false);

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
  const STATUSES = ['a_fazer', 'fazendo', 'feito']; // status corrigido

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

export default function DashboardTasks() {
  const userId = Number(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState('');

  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [errorLists, setErrorLists] = useState('');

  const [showNewListForm, setShowNewListForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState(LIST_TYPES[0].value);
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [errorNewList, setErrorNewList] = useState('');

  const [listFilter, setListFilter] = useState('');
  const [listPage, setListPage] = useState(1);

  const [taskFilter, setTaskFilter] = useState('');
  const [taskPage, setTaskPage] = useState(1);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await axios.get(`/tasks/user/${userId}`);
      setTasks(res.data || []);
      setErrorTasks('');
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
      setErrorTasks('Erro ao carregar tarefas.');
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchLists = async () => {
    try {
      setLoadingLists(true);
      const res = await axios.get(`/task-lists/user/${userId}`);
      setLists(res.data || []);
      setErrorLists('');
    } catch (err) {
      console.error('Erro ao buscar listas:', err);
      setErrorLists('Erro ao carregar listas.');
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchLists();
  }, []);

  const handleCreateList = async () => {
    if (!title.trim() || !type.trim()) {
      setErrorNewList('Título e tipo são obrigatórios.');
      return;
    }
    setErrorNewList('');
    setCreatingList(true);
    try {
      await axios.post(
        '/task-lists',
        {
          title: title.trim(),
          type: type.trim(),
          description: description.trim() || null,
          favorite,
          userId,
        }
      );
      setTitle('');
      setType(LIST_TYPES[0].value);
      setDescription('');
      setFavorite(false);
      setShowNewListForm(false);
      fetchLists();
    } catch (err) {
      console.error('Erro ao criar lista:', err);
      setErrorNewList('Erro ao criar lista.');
    } finally {
      setCreatingList(false);
    }
  };

  const openEditModal = (e, list) => {
    e.preventDefault();
    e.stopPropagation();
    setListToEdit(list);
    setEditModalOpen(true);
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
      fetchLists();
    } catch (err) {
      console.error('Erro ao salvar lista:', err);
      throw err;
    }
  };

  const openDeleteModal = (e, list) => {
    e.preventDefault();
    e.stopPropagation();
    setListToDelete(list);
    setModalOpen(true);
  };

  const confirmDeleteList = async () => {
    if (!listToDelete) return;
    try {
      await axios.delete(`/task-lists/${listToDelete.id}`);
      setModalOpen(false);
      setListToDelete(null);
      fetchLists();
      fetchTasks();
    } catch (err) {
      console.error('Erro ao excluir lista:', err);
      alert('Erro ao excluir lista.');
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setListToDelete(null);
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
      fetchTasks();
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err);
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
      console.error('Erro ao excluir tarefa:', err.response || err);
      alert('Erro ao excluir tarefa: ' + (err.response?.data?.message || err.message));
    }
  };

  const cancelDeleteTask = () => {
    setDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(listFilter.toLowerCase())
  );

  const paginatedLists = filteredLists.slice(
    (listPage - 1) * ITEMS_PER_PAGE,
    listPage * ITEMS_PER_PAGE
  );

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(taskFilter.toLowerCase())
  );

  const paginatedTasks = filteredTasks.slice(
    (taskPage - 1) * ITEMS_PER_PAGE,
    taskPage * ITEMS_PER_PAGE
  );

  const changeListPage = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(filteredLists.length / ITEMS_PER_PAGE)) return;
    setListPage(newPage);
  };

  const changeTaskPage = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)) return;
    setTaskPage(newPage);
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'feito' ? 'a_fazer' : 'feito';
      await axios.patch(`/tasks/${task.id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col px-12 py-8 overflow-y-auto">
        {/* Listas */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">
              Listas de Tarefas {filteredLists.length ? `(${filteredLists.length})` : ''}
            </h1>
            <button
              onClick={() => setShowNewListForm(!showNewListForm)}
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={18} /> {showNewListForm ? 'Cancelar' : 'Nova Lista'}
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Filtrar listas pelo título"
              value={listFilter}
              onChange={(e) => {
                setListFilter(e.target.value);
                setListPage(1);
              }}
              className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-green-500"
            />
          </div>

          {showNewListForm && (
            <div className="mb-6 bg-[#1f2937] p-6 rounded-lg shadow-md max-w-5xl mx-auto">
              <div className="mb-4">
                <label className="block mb-1 font-medium">Título </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-green-500"
                  placeholder="Ex: Lista de Mercado"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Tipo 1</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-green-500"
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
                  className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-green-500"
                  rows={3}
                  placeholder="Descrição opcional"
                />
              </div>

              <div className="mb-4 flex items-center gap-2">
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

              {errorNewList && <p className="text-red-500 mb-4">{errorNewList}</p>}

              <button
                onClick={handleCreateList}
                disabled={creatingList}
                className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-700 font-semibold w-full"
              >
                {creatingList ? 'Criando...' : 'Criar Lista'}
              </button>
            </div>
          )}

          {loadingLists ? (
            <p>Carregando listas...</p>
          ) : errorLists ? (
            <p className="text-red-400">{errorLists}</p>
          ) : paginatedLists.length === 0 ? (
            <p className="text-gray-400">Nenhuma lista cadastrada.</p>
          ) : (
            <ul className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
              {paginatedLists.map((list) => (
                <Link
                  key={list.id}
                  to={`/dashboard/task-list/${list.id}`}
                  className="relative block bg-[#1f2937] rounded-2xl p-6 min-h-[160px] hover:bg-[#374151] transition-shadow shadow-md cursor-pointer group"
                >
                  <div className="absolute top-3 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => openEditModal(e, list)}
                      title="Editar lista"
                      className="text-blue-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      aria-label="Editar lista"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={(e) => openDeleteModal(e, list)}
                      title="Excluir lista"
                      className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label="Excluir lista"
                    >
                      <Trash size={18} />
                    </button>
                  </div>

                  <strong className="block text-2xl font-semibold mb-3 pr-12 leading-tight">{list.title}</strong>

                  <span className="inline-block text-base font-medium text-gray-300 mb-3">
                    {list.type.charAt(0).toUpperCase() + list.type.slice(1)}
                  </span>

                  {list.favorite && (
                    <span className="inline-block ml-2 text-green-400 font-semibold select-none">★ Favorita</span>
                  )}

                  {list.description && (
                    <p className="mt-2 text-gray-400 text-sm leading-relaxed break-words whitespace-pre-wrap max-h-28 overflow-auto">
                      {list.description}
                    </p>
                  )}
                </Link>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">
              Tarefas {filteredTasks.length ? `(${filteredTasks.length})` : ''}
            </h1>

            <div className="flex gap-4">
              <Link to="/dashboard/newtask">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-semibold">
                  <Plus size={18} /> Nova Tarefa
                </button>
              </Link>
              <Link to="/dashboard/kanban">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold">
                  <KanbanSquare size={18} /> Kanban
                </button>
              </Link>
            </div>
          </div>

          <div className="mb-4 w-full max-w-5xl mx-auto">
            <input
              type="text"
              placeholder="Filtrar tarefas pelo título"
              value={taskFilter}
              onChange={(e) => {
                setTaskFilter(e.target.value);
                setTaskPage(1);
              }}
              className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
            />
          </div>

          {loadingTasks ? (
            <p>Carregando tarefas...</p>
          ) : errorTasks ? (
            <p className="text-red-400">{errorTasks}</p>
          ) : paginatedTasks.length === 0 ? (
            <p className="text-gray-400 mt-8">Nenhuma tarefa cadastrada.</p>
          ) : (
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
              {paginatedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={() => openDeleteTaskModal(task)}
                  onToggleStatus={handleToggleStatus}
                  onEdit={() => openEditTaskModal(task)}
                />
              ))}
            </div>
          )}

          {filteredTasks.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-4 text-white max-w-5xl mx-auto">
              <button
                onClick={() => changeTaskPage(taskPage - 1)}
                disabled={taskPage === 1}
                className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {taskPage} de {Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)}
              </span>
              <button
                onClick={() => changeTaskPage(taskPage + 1)}
                disabled={taskPage === Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)}
                className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>

      <EditListModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        list={listToEdit}
        onSave={saveListEdits}
      />

      <ConfirmModal
        isOpen={modalOpen}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir a lista "${listToDelete?.title}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDeleteList}
        onCancel={cancelDelete}
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

      <ConfirmModal
        isOpen={deleteTaskModalOpen}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir a tarefa "${taskToDelete?.title}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDeleteTask}
        onCancel={cancelDeleteTask}
      />

      <DashboardRightPanel />
    </div>
  );
}
