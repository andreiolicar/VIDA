import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/services/axios';
import { Plus, KanbanSquare, Edit, Trash, Star } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import TaskCard from '@/components/TaskCard';

const LIST_TYPES = [
  { value: 'mercado', label: 'Mercado' },
  { value: 'projeto', label: 'Projeto' },
  { value: 'doméstica', label: 'Doméstica' },
];

const ITEMS_PER_PAGE = 6;

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

function InlineEditTaskModal({ isOpen, onClose, task, onSave, lists, loadingLists }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [status, setStatus] = useState('a_fazer');
  const [dueDate, setDueDate] = useState('');
  const [listIdTask, setListIdTask] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'media');
      setStatus(task.status || 'a_fazer');
      setDueDate(task.dueDate ? task.dueDate.substring(0, 16) : '');
      setListIdTask(task.listId || '');
      setSaving(false);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const PRIORITIES = ['baixa', 'media', 'alta'];
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
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        listId: Number(listIdTask),
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
          <label className="block mb-1 font-medium">Título</label>
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

        <div className="mb-4">
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
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

  useEffect(() => {
    fetchTasks();
    fetchLists();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await axios.get(`/tasks/user/${userId}`);
      setTasks(res.data || []);
      setErrorTasks('');
    } catch {
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
    } catch {
      setErrorLists('Erro ao carregar listas.');
    } finally {
      setLoadingLists(false);
    }
  };

  const PRIORITY_ORDER = {
    alta: 1,
    média: 2,
    baixa: 3,
  };

  const handleCreateList = async () => {
    if (!title.trim() || !type.trim()) {
      setErrorNewList('Título e tipo são obrigatórios.');
      return;
    }
    setErrorNewList('');
    setCreatingList(true);
    try {
      await axios.post('/task-lists', {
        title: title.trim(),
        type: type.trim(),
        description: description.trim() || null,
        favorite,
        userId,
      });
      setTitle('');
      setType(LIST_TYPES[0].value);
      setDescription('');
      setFavorite(false);
      setShowNewListForm(false);
      fetchLists();
    } catch {
      setErrorNewList('Erro ao criar lista.');
    } finally {
      setCreatingList(false);
    }
  };

  const openEditModal = (list) => {
    setListToEdit(list);
    setEditModalOpen(true);
  };

  const saveListEdits = async (updatedList) => {
    try {
      await axios.patch(`/task-lists/${updatedList.id}`, {
        title: updatedList.title,
        type: updatedList.type,
        description: updatedList.description,
        favorite: updatedList.favorite,
      });
      fetchLists();
      setEditModalOpen(false);
      setListToEdit(null);
    } catch {
      alert('Erro ao salvar lista.');
    }
  };

  const openDeleteModal = (list) => {
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
    } catch {
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
      await axios.patch(`/tasks/${updatedTask.id}`, {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        status: updatedTask.status,
        dueDate: updatedTask.dueDate,
        listId: updatedTask.listId,
      });
      fetchTasks();
      setEditTaskModalOpen(false);
      setTaskToEdit(null);
    } catch {
      alert('Erro ao salvar tarefa.');
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
    } catch {
      alert('Erro ao excluir tarefa.');
    }
  };

  const cancelDeleteTask = () => {
    setDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };

  const filteredLists = lists.filter((list) => {
    const matchesTitle = list.title.toLowerCase().includes(listFilter.toLowerCase());
    const matchesFavorite = showFavoritesOnly ? list.favorite === true : true;
    return matchesTitle && matchesFavorite;
  });

  const paginatedLists = filteredLists.slice(
    (listPage - 1) * ITEMS_PER_PAGE,
    listPage * ITEMS_PER_PAGE
  );

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(taskFilter.toLowerCase()))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

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
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  const hasFavorites = lists.some((list) => list.favorite === true);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col px-12 py-8 overflow-y-auto">
        {/* Listas */}
        <div className="mt-12 max-w-5xl mx-auto w-full mb-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">
              Listas de Tarefas {filteredLists.length ? `(${filteredLists.length})` : ''}
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowNewListForm(!showNewListForm)}
                className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={18} /> {showNewListForm ? 'Cancelar' : 'Nova Lista'}
              </button>

              <button
                onClick={() => {
                  if (!hasFavorites) return;
                  setShowFavoritesOnly((prev) => !prev);
                  setListPage(1);
                }}
                disabled={!hasFavorites}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  showFavoritesOnly
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300 cursor-pointer'
                } ${!hasFavorites ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={showFavoritesOnly}
                aria-label="Filtrar listas favoritas"
              >
                Favoritos
              </button>
            </div>
          </div>

          <div className="mb-2 w-full max-w-5xl mx-auto">
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
                <label className="block mb-1 font-medium">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-green-500"
                  placeholder="Ex: Lista de Mercado"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Tipo</label>
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
                  rows={3}
                  className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-green-500"
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

          <ul className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
            {loadingLists ? (
              <p>Carregando listas...</p>
            ) : errorLists ? (
              <p className="text-red-400">{errorLists}</p>
            ) : paginatedLists.length === 0 ? (
              <p className="text-gray-400">Nenhuma lista cadastrada.</p>
            ) : (
              paginatedLists.map((list) => (
                <div
                  key={list.id}
                  className="relative bg-[#1f2937] rounded-2xl p-6 min-h-[160px] hover:bg-[#374151] transition-shadow shadow-md cursor-pointer group max-w-sm"
                >
                  <Link
                    to={`/dashboard/task-list/${list.id}`}
                    className="block h-full"
                    aria-label={`Abrir lista ${list.title}`}
                  >
                    <div className="flex flex-col space-y-1 max-w-[calc(100%-64px)]">
                      <h3
                        className="text-xl font-semibold leading-tight overflow-hidden text-ellipsis break-words"
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
                        lang="pt"
                        title={list.title}
                      >
                        {list.title}
                      </h3>

                      <span className="text-base font-medium text-gray-300">
                        {list.type.charAt(0).toUpperCase() + list.type.slice(1)}
                      </span>

                      {list.description && (
                        <p
                          className="text-gray-400 text-sm leading-relaxed break-words whitespace-pre-wrap max-w-full overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                          }}
                          title={list.description}
                        >
                          {list.description}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="absolute top-3 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition items-start">
                    {list.favorite && (
                      <Star
                        size={18}
                        className="text-green-400 self-start"
                        fill="currentColor"
                        stroke="currentColor"
                        aria-label="Lista favorita"
                        title="Lista favorita"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => openEditModal(list)}
                      title="Editar lista"
                      className="text-blue-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      aria-label="Editar lista"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(list)}
                      title="Excluir lista"
                      className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label="Excluir lista"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </ul>

          {filteredLists.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-4 text-white">
              <button
                onClick={() => changeListPage(listPage - 1)}
                disabled={listPage === 1}
                className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {listPage} de {Math.ceil(filteredLists.length / ITEMS_PER_PAGE)}
              </span>
              <button
                onClick={() => changeListPage(listPage + 1)}
                disabled={listPage === Math.ceil(filteredLists.length / ITEMS_PER_PAGE)}
                className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>

        {/* Tarefas */}
        <div className="mt-12 max-w-5xl mx-auto w-full">
          <div className="max-w-5xl mx-auto w-full mb-2">
            {lists.length === 0 && (
              <p className="text-red-400 text-sm text-right max-w-xs ml-auto">
                Para criar uma tarefa, você deve primeiro criar uma lista.
              </p>
            )}
          </div>

          <div className="flex justify-between items-center max-w-5xl mx-auto w-full mb-4">
            <h1 className="text-2xl font-semibold">
              Tarefas {filteredTasks.length ? `(${filteredTasks.length})` : ''}
            </h1>

            <div className="flex gap-4">
              <Link to="/dashboard/newtask">
                <button
                  disabled={lists.length === 0}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold ${
                    lists.length === 0
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white transition`}
                  title={lists.length === 0 ? 'Crie uma lista antes de adicionar tarefas' : 'Nova Tarefa'}
                >
                  <Plus size={18} /> Nova Tarefa
                </button>
              </Link>

              <Link to="/dashboard/kanban">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold transition">
                  <KanbanSquare size={18} /> Kanban
                </button>
              </Link>
            </div>
          </div>

          <div className="mb-4">
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
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
              {paginatedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={() => openDeleteTaskModal(task)}
                  onToggleStatus={() => handleToggleStatus(task)}
                  onEdit={() => openEditTaskModal(task)}
                  className="min-h-[160px] min-w-[220px] max-w-[280px]"
                />
              ))}
            </div>
          )}

          {filteredTasks.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mt-4 text-white">
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

      <InlineEditTaskModal
        isOpen={editTaskModalOpen}
        onClose={() => {
          setEditTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        task={taskToEdit}
        onSave={saveTaskEdits}
        lists={lists}
        loadingLists={loadingLists}
      />

      <ConfirmModal
        isOpen={modalOpen}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir a lista "${listToDelete?.title}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDeleteList}
        onCancel={cancelDelete}
      />

      <ConfirmModal
        isOpen={deleteTaskModalOpen}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir a tarefa "${taskToDelete?.title}"? Essa ação não pode ser desfeita.`}
        onConfirm={confirmDeleteTask}
        onCancel={cancelDeleteTask}
      />

      <style>{`
        /* Custom scrollbar para a descrição da lista */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 8px;
          border: 2px solid #1f2937;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #374151 #1f2937;
        }
      `}</style>

      <DashboardRightPanel tasks={tasks} />
    </div>
  );
}
