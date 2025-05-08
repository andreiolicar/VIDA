import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { BadgeCheck, Plus, Trash } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '../services/axios';

const AREAS = [
  'Programação',
  'Design',
  'Negócios',
  'Marketing',
  'Finanças',
  'Saúde',
  'Educação',
  'Tecnologia',
  'Psicologia',
  'Artes',
];

export default function NewStudyRouteForm() {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState(['', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTopicChange = (value, index) => {
    const updated = [...topics];
    updated[index] = value;
    setTopics(updated);
  };

  const addTopic = () => setTopics([...topics, '']);
  const removeTopic = (index) => {
    if (topics.length > 3) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !user ||
      !title ||
      !area ||
      !description ||
      topics.length < 3 ||
      topics.some((t) => t.trim() === '')
    ) {
      setError('Preencha todos os campos e tenha pelo menos 3 tópicos.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/study-routes/${user}`,
        {
          title,
          area,
          description,
          topics: topics.filter((t) => t.trim() !== ''),
        }
      );  

      const data = await response.data;
      console.log('API response:', data);

      if (!data) {
        throw new Error(data?.message || 'Erro ao criar rota de estudo.');
      }

      navigate('/dashboard/study');
    } catch (err) {
      console.error('Erro ao enviar:', err);
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
          <div className="bg-[#1f2937] rounded-xl p-6 sm:p-10 shadow-xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2">
              <BadgeCheck className="w-6 h-6 text-blue-400" />
              Criar Nova Trilha de Estudos
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div>
                <label className="block text-sm mb-1">Título</label>
                <input
                  type="text"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Área</label>
                <select
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <option value="">Selecione uma área</option>
                  {AREAS.map((a, i) => (
                    <option key={i} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
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
                <label className="block text-sm mb-2">Tópicos (mínimo 3)</label>
                <div className="space-y-3">
                  {topics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => handleTopicChange(e.target.value, i)}
                        className="flex-1 bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                      />
                      {topics.length > 3 && (
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

              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Rota'}
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
