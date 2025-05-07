import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BadgeCheck, Plus, Trash } from 'lucide-react';
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
  const [priority, setPriority] = useState('Média');
  const [listId, setListId] = useState(''); // guarda o id da lista selecionada
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState(['']);
  const [status, setStatus] = useState('a_fazer');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !user ||
      !title ||
      !priority ||
      !status ||
      !listId ||
      subtasks.some((t) => t.trim() === '')
    ) {
      setError('Preencha todos os campos obrigatórios e não deixe subtarefas em branco.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`/tasks/${user}`, {
        title,
        description,
        priority: priority.toLowerCase(),
        dueDate,
        status,
        listId: Number(listId), // envia o id numérico da lista
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
            {/* Botão Voltar no canto superior direito */}
            <div className="flex justify-end mb-6">
              <Link
                to="/dashboard/tasks"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-3 py-1 rounded-lg transition-all inline-block text-xl leading-none"
                aria-label="Voltar"
                title="Voltar"
              >
                ×
              </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2">
              <BadgeCheck className="w-6 h-6 text-blue-400" />
              Criar Nova Tarefa
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div>
                <label className="block text-sm mb-1">Título </label>
                <input
                  type="text"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Descrição</label>
                <textarea
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Prioridade </label>
                  <select
                    className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                  >
                    {PRIORIDADES.map((p, i) => (
                      <option key={i} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm mb-1">Lista </label>
                  {loadingLists ? (
                    <p>Carregando listas...</p>
                  ) : errorLists ? (
                    <p className="text-red-400">{errorLists}</p>
                  ) : lists.length === 0 ? (
                    <p className="text-gray-400">Nenhuma lista cadastrada.</p>
                  ) : (
                    <select
                      className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                      value={listId}
                      onChange={(e) => setListId(e.target.value)}
                      required
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

                <div className="flex-1">
                  <label className="block text-sm mb-1">Prazo</label>
                  <input
                    type="date"
                    className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm mb-1">Status </label>
                  <select
                    className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    {STATUS.map((s, i) => (
                      <option key={i} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                        className="flex-1 bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                        placeholder={`Subtarefa ${i + 1}`}
                      />
                      {subtasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubtask(i)}
                          className="text-red-400 hover:text-red-300"
                          title="Remover subtarefa"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
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
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
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
