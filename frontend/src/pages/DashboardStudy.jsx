import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/services/axios';
import { Plus } from 'lucide-react';
import StudyRouteCard from '@/components/StudyRouteCard';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { Trash2 } from 'lucide-react';

export default function DashboardStudy() {
  const userId = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  const [routes, setRoutes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState('');

  const fetchRoutes = async () => {
    try {
      const res = await axios.get(`/study-routes/${userId}`);
      setRoutes(res.data);
    } catch (err) {
      console.error('Erro ao buscar trilhas:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await axios.get(`/events/${userId}`);
      setEvents(res.data);
      setErrorEvents('');
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setErrorEvents('Erro ao carregar eventos.');
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchEvents();
  }, []);
  // Excluir trilha
  const handleDeleteRoute = async (route) => {
    if (window.confirm(`Tem certeza que deseja excluir a trilha "${route.title}"?`)) {
      try {
        await axios.delete(`/study-routes/${route.id}`);
        fetchRoutes();
      } catch (err) {
        console.error('Erro ao excluir trilha:', err);
        alert('Erro ao excluir trilha');
      }
    }
  };

  // Favoritar/desfavoritar trilha
  const handleToggleFavorite = async (route) => {
    try {
      await axios.patch(`/study-routes/${route.id}`, { favorite: !route.favorite });
      fetchRoutes();
    } catch (err) {
      console.error('Erro ao favoritar/desfavoritar trilha:', err);
      alert('Erro ao favoritar/desfavoritar trilha');
    }
  };

  const sortedRoutes = [...routes].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  const sortedEvents = [...events].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col px-12 py-8 overflow-y-auto">
        {/* Trilhas */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Trilhas de Estudos {routes.length ? `(${routes.length})` : ''}
            </h1>
            <Link to="/dashboard/study/new">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Plus size={18} /> Nova Trilha
              </button>
            </Link>
          </div>

          {sortedRoutes.length === 0 ? (
            <p className="text-gray-400 mt-8">Nenhuma trilha cadastrada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedRoutes.map((route) => (
                <StudyRouteCard
                  key={route.id}
                  route={route}
                  onDelete={handleDeleteRoute}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>

        {/* Eventos */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Eventos {events.length ? `(${events.length})` : ''}
            </h1>
            <Link to="/dashboard/events/new">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus size={18} /> Novo Evento
              </button>
            </Link>
          </div>

          {loadingEvents ? (
            <p>Carregando eventos...</p>
          ) : errorEvents ? (
            <p className="text-red-400">{errorEvents}</p>
          ) : sortedEvents.length === 0 ? (
            <p className="text-gray-400">Nenhum evento cadastrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedEvents.map((event) => (
                <div className="relative group">
                  {/* Botão de excluir */}
                  <button
                    title="Excluir evento"
                    className="absolute top-3 right-3 z-10 transition"
                  >
                    <Trash2 size={18} className="text-gray-400 hover:text-red-500" />
                  </button>

                  {/* Conteúdo do card */}
                  <div className="p-4 bg-white/10 backdrop-blur rounded-xl shadow hover:shadow-lg transition cursor-pointer h-full flex flex-col justify-between">
                    <h2 className="text-lg font-semibold mb-2 text-white">{event.title}</h2>
                    <p className="text-sm text-gray-400 mb-4">
                      {new Date(event.datetime).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                    <Link
                      to={`/dashboard/events/${event.id}`}
                      className="mt-auto text-blue-400 hover:underline"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DashboardRightPanel />
    </div>
  );
}
