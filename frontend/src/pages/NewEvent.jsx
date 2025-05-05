import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { BadgeCheck, Plus, Trash } from 'lucide-react';

export default function NewEvent() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState(['']);
  const [datetime, setDatetime] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const addTopic = () => setTopics([...topics, '']);
  const removeTopic = (index) => setTopics(topics.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !datetime) {
      setError('Título e data/hora são obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(
        `/events/${userId}`,
        {
          title,
          description,
          topics: topics.filter((t) => t.trim() !== ''),
          datetime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate('/dashboard/study');
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      setError('Erro ao criar evento.');
    } finally {
      setLoading(false);
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
              Criar Novo Evento
            </h1>

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

              <div>
                <label className="block text-sm mb-2">Tópicos</label>
                <div className="space-y-3">
                  {topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => handleTopicChange(i, e.target.value)}
                        className="flex-1 bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                      />
                      {topics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTopic(i)}
                          className="text-red-400 hover:text-red-300"
                          title="Remover tópico"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTopic}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar tópico
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Data e Hora *</label>
                <input
                  type="datetime-local"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Evento'}
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
