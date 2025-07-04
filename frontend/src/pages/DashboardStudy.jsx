import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '@/services/axios';

import {
  Plus,
  BookOpen,
  Calendar,
  Trophy,
  TrendingUp,
  Target,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';

import StudyRouteCard from '@/components/StudyRouteCard';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';

const dt = (iso, opts) => new Date(iso).toLocaleString('pt-BR', opts);

const formatEventDate = (iso) => {
  const d = new Date(iso);
  const diff = Math.ceil((d - new Date()) / 86_400_000);

  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff <= 7) return `Em ${diff} dias`;

  return dt(iso, { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const urgency = (iso) => {
  const diff = Math.ceil((new Date(iso) - new Date()) / 86_400_000);
  if (diff <= 1) return 'urgent';
  if (diff <= 3) return 'soon';
  return 'normal';
};

export default function DashboardStudy() {
  const userId = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [routes, setRoutes] = useState([]);
  const [events, setEvents] = useState([]);

  const [stats, setStats] = useState({
    totalRoutes: 0,
    completedRoutes: 0,
    totalTopics: 0,
    completedTopics: 0,
    overallProgress: 0,
  });

  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorRoutes, setErrorRoutes] = useState('');
  const [errorEvents, setErrorEvents] = useState('');

  useEffect(() => {
    if (!userId || !token) return;

    const fetchRoutes = async () => {
      try {
        setLoadingRoutes(true);
        const { data } = await axios.get(`/study-routes/${userId}`);
        setRoutes(data);
        calcStats(data);
        setErrorRoutes('');
      } catch {
        setErrorRoutes('Erro ao carregar trilhas.');
      } finally {
        setLoadingRoutes(false);
      }
    };

    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const { data } = await axios.get(`/events/${userId}`);
        setEvents(data);
        setErrorEvents('');
      } catch {
        setErrorEvents('Erro ao carregar eventos.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchRoutes();
    fetchEvents();
  }, [userId, token]);

  const calcStats = (list) => {
    const totalRoutes = list.length;
    const totalTopics = list.reduce((a, r) => a + (r.topics?.length || 0), 0);
    const completedTopics = list.reduce(
      (a, r) => a + (r.topics?.filter((t) => t.completed).length || 0),
      0
    );
    const completedRoutes = list.filter((r) => {
      const all = r.topics?.length || 0;
      const done = r.topics?.filter((t) => t.completed).length || 0;
      return all > 0 && done === all;
    }).length;

    setStats({
      totalRoutes,
      completedRoutes,
      totalTopics,
      completedTopics,
      overallProgress: totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0,
    });
  };

  const visibleRoutes = [...routes]
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))
    .slice(0, 3);

  const visibleEvents = [...events]
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .slice(0, 3);

  const calendarTasks = events.map((e) => ({ ...e, dueDate: e.datetime }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="border-b border-gray-700 px-8 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Centro de Estudos</h1>

            <Link
              to="/dashboard/study/new"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3
                         font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nova Trilha
            </Link>
          </div>

          {/* Estatísticas ------------------------------------------------ */}
          <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
            <StatCard
              icon={<BookOpen className="h-8 w-8 text-blue-400" />}
              value={stats.totalRoutes}
              label="Trilhas Criadas"
            />
            <StatCard
              icon={<Trophy className="h-8 w-8 text-green-400" />}
              value={stats.completedRoutes}
              label="Trilhas Concluídas"
            />
            <StatCard
              icon={<Target className="h-8 w-8 text-purple-400" />}
              value={`${stats.completedTopics}/${stats.totalTopics}`}
              label="Tópicos Estudados"
            />
            <StatCard
              icon={<TrendingUp className="h-8 w-8 text-yellow-400" />}
              value={`${stats.overallProgress}%`}
              label="Progresso Geral"
            />
          </section>
        </header>

        {/* Conteúdo ------------------------------------------------------ */}
        <main className="space-y-12 px-8 py-8">
          {/* Trilhas ---------------------------------------------------- */}
          <Section
            title="Minhas Trilhas"
            total={routes.length}
            moreLink={routes.length > 3 ? '/dashboard/study/all' : null}
            onMore={() => navigate('/dashboard/study/all')}
          >
            {loadingRoutes ? (
              <Loading msg="Carregando trilhas..." />
            ) : errorRoutes ? (
              <Error msg={errorRoutes} icon={<BookOpen className="h-12 w-12 text-red-400" />} />
            ) : routes.length === 0 ? (
              <Empty
                icon={<BookOpen className="h-12 w-12 text-gray-400" />}
                title="Nenhuma trilha criada"
                action="/dashboard/study/new"
              />
            ) : (
              <Grid>
                {visibleRoutes.map((r) => (
                  <StudyRouteCard key={r.id} route={r} onDelete={calcStats} onToggleFavorite={calcStats} />
                ))}
              </Grid>
            )}
          </Section>

          {/* Eventos ----------------------------------------------------- */}
          <Section
            title="Eventos de Estudo"
            total={events.length}
            newLink="/dashboard/events/new"
            moreLink={events.length > 3 ? '/dashboard/events' : null}
            onMore={() => navigate('/dashboard/events')}
          >
            {loadingEvents ? (
              <Loading msg="Carregando eventos..." />
            ) : errorEvents ? (
              <Error msg={errorEvents} icon={<Calendar className="h-12 w-12 text-red-400" />} />
            ) : events.length === 0 ? (
              <Empty
                icon={<Calendar className="h-12 w-12 text-gray-400" />}
                title="Nenhum evento agendado"
                action="/dashboard/events/new"
              />
            ) : (
              <Grid>
                {visibleEvents.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </Grid>
            )}
          </Section>
        </main>
      </div>

      <DashboardRightPanel tasks={calendarTasks} />
    </div>
  );
}

const StatCard = ({ icon, value, label }) => (
  <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
    <div className="mb-2 flex items-center justify-between">{icon}<span className="text-2xl font-bold text-white">{value}</span></div>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const Section = ({ title, total, moreLink, newLink, onMore, children }) => (
  <section>
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex items-center gap-4">
        {total !== undefined && <span className="text-sm text-gray-400">{total}</span>}
        {newLink && (
          <Link
            to={newLink}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2
                       text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Novo
          </Link>
        )}
        {moreLink && (
          <button
            onClick={onMore}
            className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            Ver todos →
          </button>
        )}
      </div>
    </div>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>
);

const Loading = ({ msg }) => (
  <div className="py-16 text-center">
    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
    <p className="text-gray-400">{msg}</p>
  </div>
);

const Error = ({ msg, icon }) => (
  <div className="py-16 text-center">
    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-900/20">{icon}</div>
    <p className="text-red-400">{msg}</p>
  </div>
);

const Empty = ({ icon, title, action }) => (
  <div className="py-16 text-center">
    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-800">{icon}</div>
    <h3 className="mb-6 text-xl font-semibold text-white">{title}</h3>
    <Link
      to={action}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3
                 font-semibold text-white transition-colors hover:bg-blue-700"
    >
      <Plus className="h-5 w-5" /> Criar
    </Link>
  </div>
);

const Badge = ({ color, icon, children }) => (
  <span
    className={`mb-2 inline-flex items-center gap-1 rounded-full bg-${color}-500/20 px-2 py-1
                text-xs font-medium text-${color}-400`}
  >
    {icon} {children}
  </span>
);

const EventCard = ({ ev }) => {
  const u = urgency(ev.datetime);

  return (
    <div
      className={`rounded-xl border p-6 transition-colors ${u === 'urgent'
        ? 'border-red-500/50 bg-red-500/5'
        : u === 'soon'
          ? 'border-yellow-500/50 bg-yellow-500/5'
          : 'border-gray-700 hover:border-gray-600'
        }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          {u === 'urgent' && (
            <Badge color="red" icon={<AlertCircle className="h-3 w-3" />}>
              Urgente
            </Badge>
          )}
          {u === 'soon' && (
            <Badge color="yellow" icon={<Clock className="h-3 w-3" />}>
              Em breve
            </Badge>
          )}

          <h3 className="mb-2 text-lg font-semibold text-white">{ev.title}</h3>
          <p className="line-clamp-2 text-sm text-gray-400">{ev.description}</p>
        </div>

        <div className="rounded-lg bg-blue-600 p-2">
          <Calendar className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{formatEventDate(ev.datetime)}</span>
          <span>•</span>
          <span>{dt(ev.datetime, { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        {ev.location && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{ev.location}</span>
          </div>
        )}
      </div>

      <Link
        to={`/dashboard/events/${ev.id}`}
        className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
      >
        Ver detalhes →
      </Link>
    </div>
  );
};