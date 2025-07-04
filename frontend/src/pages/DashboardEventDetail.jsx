// src/pages/DashboardEventDetail.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Edit,
} from 'lucide-react';

export default function DashboardEventDetail() {
  const { id } = useParams();
  const userId = localStorage.getItem('user');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/events/${userId}/${id}`);
      setEvent(res.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar os detalhes do evento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line
  }, [id]);

  // Formatação de data/hora
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando evento...</p>
          </div>
        </div>
        <DashboardRightPanel />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="p-6 bg-red-900/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-red-400" />
            </div>
            <p className="text-red-400 text-lg">{error || 'Evento não encontrado.'}</p>
            <Link
              to="/dashboard/events"
              className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para eventos
            </Link>
          </div>
        </div>
        <DashboardRightPanel />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-gray-700 bg-transparent px-8 py-8">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center gap-6">
            {/* Botão voltar */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard/events"
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
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 text-sm font-medium">
                    {event.type || 'Evento'}
                  </span>
                </div>
              </div>
              {event.description && (
                <p className="mt-2 text-gray-300 text-base">{event.description}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold text-white">{formatDate(event.datetime)}</span>
              </div>
              <p className="text-gray-300">Data</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-green-400" />
                <span className="text-lg font-bold text-white">{formatTime(event.datetime)}</span>
              </div>
              <p className="text-gray-300">Horário</p>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <div className="flex-1 bg-transparent">
          <div className="max-w-3xl mx-auto p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Detalhes do Evento
              </h2>

              <div className="space-y-6">
                {event.topics && event.topics.length > 0 && (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      Tópicos/Atividades Relacionadas
                    </h3>
                    <ul className="list-disc pl-6 text-gray-300 space-y-1">
                      {event.topics.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.participants && event.participants.length > 0 && (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Participantes
                    </h3>
                    <ul className="list-disc pl-6 text-gray-300 space-y-1">
                      {event.participants.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Botões centralizados, voltar à esquerda */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to="/dashboard/events"
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors order-1 md:order-none md:mr-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para eventos
              </Link>
              <Link
                to={`/dashboard/events/${event.id}/edit`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition-colors order-2"
              >
                <Edit className="w-4 h-4" />
                Editar Evento
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DashboardRightPanel />
    </div>
  );
}