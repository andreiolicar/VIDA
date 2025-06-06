import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BadgeCheck, Plus, Trash, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';

const PRIORIDADES = ['Alta', 'Média', 'Baixa'];
const STATUS = [
  { value: 'a_fazer', label: 'A Fazer' },
  { value: 'fazendo', label: 'Fazendo' },
  { value: 'feito', label: 'Feito' },
];

export default function NewTask() {
  const user = localStorage.getItem('user');
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [listId, setListId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState(['']);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [errorLists, setErrorLists] = useState('');

  // Buscar listas do usuário
  const fetchLists = async () => {
    try {
      setLoadingLists(true);
      const res = await axios.get(`/task-lists/user/${user}`);
      setLists(res.data || []);
      setErrorLists('');
    } catch (err) {
      setErrorLists('Erro ao carregar listas.');
      setLists([]);
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleSubtaskChange = (value, index) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const addSubtask = () => setSubtasks([...subtasks, '']);
  const removeSubtask = (index) => {
    if (subtasks.length > 1) {
      setSubtasks(subtasks.filter((_, i) => i !== index));
    }
  };

  const formatDueDateForBackend = (dt) => {
    if (!dt) return null;
    if (dt.includes('T')) {
      return new Date(dt).toISOString();
    }
    return new Date(dt + 'T00:00').toISOString();
  };

  const isFormValid = () => {
    return (
      user &&
      title.trim() !== '' &&
      priority !== '' &&
      status !== '' &&
      listId !== '' &&
      dueDate !== '' &&
      subtasks.every((t) => t.trim() !== '')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`/tasks/${user}`, {
        title,
        description,
        priority: priority.toLowerCase(),
        dueDate: formatDueDateForBackend(dueDate),
        status,
        listId: Number(listId),
        subtasks: subtasks.filter((t) => t.trim() !== ''),
      });

      if (!response.data) {
        throw new Error(response.data?.message || 'Erro ao criar tarefa.');
      }

      navigate('/dashboard/tasks');
    } catch (err) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1f2937] rounded-xl p-6 sm:p-10 shadow-xl relative">
            <div className="flex justify-end mb-6">
              <Link
                to="/dashboard/tasks"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-3 py-1 rounded-lg transition-all text-xl leading-none"
              >
                ×
              </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2">
              <BadgeCheck className="w-6 h-6 text-blue-400" />
              Criar Nova Tarefa
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Todos os campos devem ser preenchidos antes de criar a tarefa.</span>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div>
                <label className="block text-sm mb-1">Título</label>
                <input
                  type="text"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {title === '' && <p className="text-red-400 text-xs mt-1">Título é obrigatório.</p>}
              </div>

              <div>
                <label className="block text-sm mb-1">Descrição</label>
                <textarea
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Prioridade</label>
                <select
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">Selecione uma prioridade</option>
                  {PRIORIDADES.map((p, i) => (
                    <option key={i} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {priority === '' && (
                  <p className="text-red-400 text-xs mt-1">Prioridade é obrigatória.</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Lista</label>
                {loadingLists ? (
                  <p>Carregando listas...</p>
                ) : errorLists ? (
                  <p className="text-red-400">{errorLists}</p>
                ) : lists.length === 0 ? (
                  <p className="text-gray-400">Nenhuma lista cadastrada.</p>
                ) : (
                  <>
                    <select
                      className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500"
                      value={listId}
                      onChange={(e) => setListId(e.target.value)}
                    >
                      <option value="">Selecione uma lista</option>
                      {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.title}
                        </option>
                      ))}
                    </select>
                    {listId === '' && (
                      <p className="text-red-400 text-xs mt-1">Selecione uma lista.</p>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Prazo</label>
                <input
                  type="datetime-local"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                {dueDate === '' && (
                  <p className="text-red-400 text-xs mt-1">Prazo é obrigatório.</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Selecione um status</option>
                  {STATUS.map((s, i) => (
                    <option key={i} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {status === '' && (
                  <p className="text-red-400 text-xs mt-1">Status é obrigatório.</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Subtarefas</label>
                <div className="space-y-3">
                  {subtasks.map((subtask, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={subtask}
                        onChange={(e) => handleSubtaskChange(e.target.value, i)}
                        className="flex-1 bg-[#111827] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500"
                        placeholder={`Subtarefa ${i + 1}`}
                      />
                      {subtasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubtask(i)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {subtasks.some((t) => t.trim() === '') && (
                    <p className="text-red-400 text-xs">Preencha todas as subtarefas.</p>
                  )}
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar subtarefa
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  className={`font-semibold px-6 py-3 rounded-lg transition-all ${
                    !isFormValid() || loading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {loading ? 'Criando...' : 'Criar Tarefa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
