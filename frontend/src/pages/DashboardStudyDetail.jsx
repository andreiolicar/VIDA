import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { ArrowLeft } from 'lucide-react';
const token = localStorage.getItem('token');

export default function DashboardStudyDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTopicId, setUpdatingTopicId] = useState(null); // Para controlar o loading do tópico sendo atualizado
  const fetchRoute = async () => {
    try {
      const res = await axios.get(`/study-routes/getone/${id}`);

      setRoute(res.data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar trilha:', err);
      setError('Erro ao carregar a trilha de estudos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
    // eslint-disable-next-line
  }, [id]);

  // Função para marcar/desmarcar tópico como concluído
  const handleToggleTopic = async (topicId, currentStatus) => {
    setUpdatingTopicId(topicId);
    try {
      await axios.patch(`/study-routes/topics/${topicId}`, {
        completed: !currentStatus,
      });
      await fetchRoute(); // Atualiza a lista após alteração
    } catch (err) {
      alert('Erro ao atualizar status do tópico.');
      console.error(err);
    } finally {
      setUpdatingTopicId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center text-xl font-semibold">
          Carregando...
        </main>
        <DashboardRightPanel />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center text-red-400 font-semibold">
          {error}
        </main>
        <DashboardRightPanel />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center text-gray-400 font-semibold">
          Trilha não encontrada.
        </main>
        <DashboardRightPanel />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 px-12 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-[#1f2937] rounded-xl p-8 shadow-xl">
          <Link
            to="/dashboard/study"
            className="inline-flex items-center gap-2 text-blue-400 hover:underline mb-6"
          >
            <ArrowLeft size={20} /> Voltar para Trilhas
          </Link>

          <h1 className="text-3xl font-bold mb-4">{route.title}</h1>
          <p className="text-gray-300 mb-6">{route.description}</p>

          <div className="mb-6">
            <span className="inline-block bg-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
              Área: {route.area}
            </span>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Tópicos de Estudo</h2>
          {route.topics && route.topics.length > 0 ? (
            <ul className="space-y-4">
              {route.topics.map((topic) => (
                <li
                  key={topic.id}
                  className={`p-4 rounded-lg border flex justify-between items-center ${
                    topic.completed
                      ? 'border-green-500 bg-green-900'
                      : 'border-gray-600 bg-[#111827]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={topic.completed}
                      disabled={updatingTopicId === topic.id}
                      onChange={() => handleToggleTopic(topic.id, topic.completed)}
                      className="w-5 h-5 accent-green-500"
                    />
                    <span className="text-lg">{topic.title}</span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      topic.completed ? 'text-green-400' : 'text-gray-400'
                    }`}
                  >
                    {topic.completed ? 'Concluído' : 'Pendente'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Nenhum tópico cadastrado.</p>
          )}

          {/* Roadmap exibido, porém vazio */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">Roadmap Completo</h2>
          <pre className="bg-[#111827] p-4 rounded-lg whitespace-pre-wrap text-sm">{''}</pre>
        </div>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
