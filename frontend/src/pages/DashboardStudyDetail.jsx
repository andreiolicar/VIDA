// src/pages/DashboardStudyDetail.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import {
  ArrowLeft,
  CheckCircle,
  Trophy,
  Clock,
  BookOpen,
  Target,
  Play,
  Plus,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function DashboardStudyDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTopicId, setUpdatingTopicId] = useState(null);

  const fetchRoute = async () => {
    try {
      const res = await axios.get(`/study-routes/getone/${id}`);
      setRoute(res.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar a trilha de estudos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
    // eslint-disable-next-line
  }, [id]);

  const handleToggleTopic = async (topicId, currentStatus) => {
    setUpdatingTopicId(topicId);
    try {
      await axios.patch(`/study-routes/topics/${topicId}`, {
        completed: !currentStatus,
      });
      await fetchRoute();
    } catch (err) {
      alert('Erro ao atualizar status do tópico.');
    } finally {
      setUpdatingTopicId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando trilha...</p>
          </div>
        </div>
        <DashboardRightPanel />
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="p-6 bg-red-900/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-red-400" />
            </div>
            <p className="text-red-400 text-lg">{error || 'Trilha não encontrada.'}</p>
            <Link
              to="/dashboard/study"
              className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para estudos
            </Link>
          </div>
        </div>
        <DashboardRightPanel />
      </div>
    );
  }

  const completed = route.topics?.filter(t => t.completed).length || 0;
  const total = route.topics?.length || 0;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const isCompleted = completed === total && total > 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-gray-700 bg-transparent px-8 py-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
            {/* Botão voltar */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard/study"
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                title="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
            </div>

            {/* Título e meta-dados */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2 md:mb-0 break-words">
                  {route.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 text-sm font-medium">
                    {route.area}
                  </span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600/20 text-green-300 text-sm font-medium">
                      <Trophy className="w-3 h-3" />
                      Concluída
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-gray-300 text-base">{route.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-blue-400" />
                <span className="text-2xl font-bold text-white">{completed}/{total}</span>
              </div>
              <p className="text-gray-300">Tópicos Concluídos</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-green-400" />
                <span className="text-2xl font-bold text-white">{progress}%</span>
              </div>
              <p className="text-gray-300">Progresso Total</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <span className="text-2xl font-bold text-white">{total - completed}</span>
              </div>
              <p className="text-gray-300">Tópicos Restantes</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-5xl mx-auto mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Progresso da Trilha</span>
              <span className="text-blue-200">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <div className="flex-1 bg-transparent">
          <div className="max-w-5xl mx-auto p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-400" />
                Roadmap de Estudos Gerado por IA
              </h2>

              {/* Alinhamento: roadmap e etapas alinhados ao header */}
              <div className="space-y-8">
                {route.roadmap && (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      Roadmap Personalizado
                    </h3>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                      <ReactMarkdown>
                        {route.roadmap}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {route.topics && route.topics.length > 0 ? (
                  <div className="space-y-4">
                    {route.topics.map((topic, index) => (
                      <div
                        key={topic.id}
                        className={`group relative bg-gray-800 border rounded-xl overflow-hidden transition-all duration-200 ${topic.completed
                            ? 'border-green-500/50 bg-green-500/5'
                            : 'border-gray-700 hover:border-gray-600'
                          }`}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${topic.completed
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-300'
                              }`}>
                              {topic.completed ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className={`text-lg font-semibold ${topic.completed ? 'text-green-400' : 'text-white'
                                  }`}>
                                  {topic.title}
                                </h3>
                                <button
                                  onClick={() => handleToggleTopic(topic.id, topic.completed)}
                                  disabled={updatingTopicId === topic.id}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${topic.completed
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                    } ${updatingTopicId === topic.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {updatingTopicId === topic.id ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                  ) : topic.completed ? (
                                    <>
                                      <CheckCircle className="w-4 h-4" />
                                      Concluído
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4" />
                                      Marcar como concluído
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className={`prose prose-sm max-w-none ${topic.completed ? 'text-gray-300' : 'text-gray-400'
                                }`}>
                                <ReactMarkdown>{topic.content}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="p-6 bg-gray-800 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum tópico encontrado</h3>
                    <p className="text-gray-400">Esta trilha ainda não possui tópicos de estudo.</p>
                  </div>
                )}
              </div>
            </div>

            {isCompleted && (
              <div className="bg-green-600 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">🎉 Parabéns!</h3>
                <p className="text-green-100 text-lg">
                  Você concluiu toda a trilha "{route.title}"!
                </p>
                <p className="text-green-200 mt-2">
                  Continue aprendendo criando uma nova trilha de estudos.
                </p>
                <Link
                  to="/dashboard/study/new"
                  className="inline-flex items-center gap-2 mt-6 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Criar Nova Trilha
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <DashboardRightPanel />
    </div>
  );
}