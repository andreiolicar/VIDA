
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BadgeCheck, Trash, Plus } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';

const PRIORIDADES = ['Alta', 'Média', 'Baixa'];
const STATUS = [
  { value: 'a_fazer', label: 'A Fazer' },
  { value: 'fazendo', label: 'Fazendo' },
  { value: 'feito', label: 'Feito' },
];

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Média');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState(['']);
  const [status, setStatus] = useState('a_fazer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await axios.get(`/tasks/${id}`);
        const data = res.data;
        setTitle(data.title || '');
        setDescription(data.description || '');
        setPriority(data.priority ? capitalize(data.priority) : 'Média');
        setDueDate(data.dueDate ? data.dueDate.slice(0, 10) : '');
        setStatus(data.status || 'a_fazer');
        setSubtasks(data.subtasks && data.subtasks.length > 0 ? data.subtasks : ['']);
      } catch (err) {
        setError('Erro ao carregar tarefa.');
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
    if (!title || !priority || !status || subtasks.some((t) => t.trim() === '')) {
      setError('Preencha todos os campos obrigatórios e não deixe subtarefas em branco.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await axios.put(`/tasks/${id}`, {
        title,
        description,
        priority: priority.toLowerCase(),
        dueDate,
        status,
        subtasks: subtasks.filter((t) => t.trim() !== ''),
      });
      navigate('/dashboard/tasks');
    } catch (err) {
      setError('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1f2937] rounded-xl p-6 sm:p-10 shadow-xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2">
              <BadgeCheck className="w-6 h-6 text-blue-400" />
              Editar Tarefa
            </h1>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div>
                  <label className="block text-sm mb-1">Título *</label>
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
                    <label className="block text-sm mb-1">Prioridade *</label>
                    <select
                      className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      required
                    >
                      {PRIORIDADES.map((p, i) => (
                        <option key={i} value={p}>{p}</option>
                      ))}
                    </select>
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
                    <label className="block text-sm mb-1">Status *</label>
                    <select
                      className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      {STATUS.map((s, i) => (
                        <option key={i} value={s.value}>{s.label}</option>
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
                    disabled={saving}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
