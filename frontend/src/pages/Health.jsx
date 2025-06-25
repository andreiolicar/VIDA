import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '@/services/axios'; // axios configurado com baseURL para seu backend
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { Heart, CalendarCheck, Activity, AlertTriangle, BookOpen, Headphones } from 'lucide-react';

// Função utilitária para formatar datas
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

// Formatar porcentagens
function formatPercent(value) {
  return typeof value === 'number' ? `${value.toFixed(1)}%` : '--';
}

// Componente Card para áreas principais
function Card({ title, icon, value, description, to, className }) {
  return (
    <Link
      to={to}
      className={`bg-[#1f2937] rounded-xl p-5 shadow-lg flex flex-col items-center hover:bg-opacity-80 transition group focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
      style={{ minWidth: 240 }}
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-semibold mb-1 text-center">{title}</h3>
      <p className="text-white text-3xl font-bold mb-1">{value}</p>
      {description && <p className="text-gray-400 text-sm text-center">{description}</p>}
    </Link>
  );
}

// Componente Carrossel para meditações, artigos etc
function Carousel({ items, interval = 6000 }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg min-h-[180px] flex flex-col items-center">
      <div className="w-full min-h-[130px] flex flex-col items-center justify-center">
        {items[index]}
      </div>
      <div className="flex gap-2 mt-4">
        {items.map((_, i) => (
          <span
            key={i}
            className={`block w-3 h-3 rounded-full cursor-pointer ${
              i === index ? 'bg-green-500' : 'bg-gray-600'
            }`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default function DashboardHealth() {
  const rawUser = localStorage.getItem('user');
  let userId = null;
  try {
    userId = JSON.parse(rawUser)?.id ?? rawUser;
  } catch {
    userId = rawUser;
  }

  const navigate = useNavigate();

  // Estados principais
  const [healthScore, setHealthScore] = useState(null);
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [checkInToday, setCheckInToday] = useState(null);
  const [wellnessHabits, setWellnessHabits] = useState([]);
  const [manualRecords, setManualRecords] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [meditationItems, setMeditationItems] = useState([]);
  const [educationalArticles, setEducationalArticles] = useState([]);

  // Buscar dados iniciais do backend
  useEffect(() => {
    if (!userId) return;

    async function fetchHealthData() {
      try {
        // Health Score geral com feedback da IA
        const scoreRes = await axios.get(`/health/${userId}/score`);
        setHealthScore(scoreRes.data.score ?? null);

        // Calendário de Saúde (hábitos + check-ins)
        const calendarRes = await axios.get(`/health/${userId}/calendar`);
        setCalendarEntries(calendarRes.data ?? []);

        // Check-in emocional do dia
        const checkInRes = await axios.get(`/health/${userId}/checkin/today`);
        setCheckInToday(checkInRes.data ?? null);

        // Hábitos de Bem-estar (sono, alimentação, exercícios)
        const habitsRes = await axios.get(`/health/${userId}/habits`);
        setWellnessHabits(habitsRes.data ?? []);

        // Registros manuais físicos (pressão, glicemia, peso)
        const recordsRes = await axios.get(`/health/${userId}/manual-records`);
        setManualRecords(recordsRes.data ?? []);

        // Alertas (ex: pressão alta, humor crítico)
        const alertsRes = await axios.get(`/health/${userId}/alerts`);
        setAlerts(alertsRes.data ?? []);

        // Meditações guiadas e textos educativos
        const meditationRes = await axios.get(`/health/meditations`);
        setMeditationItems(
          meditationRes.data.map((m) => (
            <div key={m.id} className="text-center px-4">
              <Headphones className="mx-auto mb-3 text-green-400" />
              <h4 className="font-semibold mb-2">{m.title}</h4>
              <audio controls src={m.audioUrl} className="w-full rounded" />
            </div>
          ))
        );

        const articlesRes = await axios.get(`/health/articles`);
        setEducationalArticles(
          articlesRes.data.map((a) => (
            <div key={a.id} className="text-center px-4">
              <BookOpen className="mx-auto mb-3 text-green-400" />
              <h4 className="font-semibold mb-2">{a.title}</h4>
              <p className="text-gray-400 text-sm">{a.summary}</p>
              <Link
                to={`/health/articles/${a.id}`}
                className="text-green-400 hover:underline mt-2 inline-block"
              >
                Ler mais
              </Link>
            </div>
          ))
        );
      } catch (error) {
        console.error('Erro ao buscar dados da saúde:', error);
      }
    }

    fetchHealthData();
  }, [userId]);

  // Componentes auxiliares para mostrar dados da saúde
  function renderCalendar() {
    if (!calendarEntries.length) return <p className="text-gray-400">Nenhum registro no calendário.</p>;
    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarEntries.map((entry) => (
          <div
            key={entry.date}
            className={`rounded-md p-1 text-center cursor-pointer ${
              entry.completed ? 'bg-green-600' : 'bg-gray-700'
            }`}
            title={`${formatDate(entry.date)} - ${entry.habitName}`}
          >
            {new Date(entry.date).getDate()}
          </div>
        ))}
      </div>
    );
  }

  function renderWellnessHabits() {
    if (!wellnessHabits.length) return <p className="text-gray-400">Nenhum hábito registrado.</p>;
    return wellnessHabits.map((habit) => (
      <div
        key={habit.id}
        className="bg-[#2a3748] rounded p-4 mb-3 flex flex-col sm:flex-row items-center justify-between"
      >
        <div>
          <h4 className="font-semibold">{habit.name}</h4>
          <p className="text-gray-400 text-sm">{habit.description}</p>
        </div>
        <div className="mt-2 sm:mt-0 flex gap-4">
          <span className="text-green-400 font-semibold">Meta: {habit.target}</span>
          <span className="text-gray-300">
            Atual: {habit.currentValue} {habit.unit}
          </span>
        </div>
      </div>
    ));
  }

  function renderManualRecords() {
    if (!manualRecords.length) return <p className="text-gray-400">Nenhum registro manual.</p>;
    return (
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">Data</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Valor</th>
            <th className="p-2">Notas</th>
          </tr>
        </thead>
        <tbody>
          {manualRecords.map((record) => (
            <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer">
              <td className="p-2">{new Date(record.date).toLocaleDateString('pt-BR')}</td>
              <td className="p-2">{record.type}</td>
              <td className="p-2 font-semibold">{record.value} {record.unit}</td>
              <td className="p-2">{record.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderAlerts() {
    if (!alerts.length) return <p className="text-gray-400">Nenhum alerta no momento.</p>;
    return alerts.map((alert) => (
      <div
        key={alert.id}
        className="bg-red-700 rounded p-3 mb-2 flex items-center gap-3 cursor-pointer hover:bg-red-800 transition"
        title={alert.details}
        onClick={() => alert.userAction && navigate(alert.userAction)}
      >
        <AlertTriangle className="text-white w-6 h-6" />
        <div>
          <p className="font-semibold">{alert.title}</p>
          <p className="text-sm text-gray-200">{alert.summary}</p>
        </div>
      </div>
    ));
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a1f2c] to-[#113f4e] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col px-10 py-8 max-w-[1280px] mx-auto overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard Saúde</h1>

        {/* Cards principais */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <Card
            title="Health Score"
            value={healthScore !== null ? healthScore.toFixed(1) : '...'}
            icon={<Heart className="w-12 h-12 text-red-400" />}
            description="Feedback geral de saúde baseado em dados e IA"
            to="/health/score"
          />
          <Card
            title="Check-in Emocional"
            value={checkInToday ? checkInToday.mood : 'Nenhum'}
            icon={<CalendarCheck className="w-12 h-12 text-yellow-400" />}
            description="Como você se sente hoje?"
            to="/health/checkin"
          />
          <Card
            title="Hábitos de Bem-estar"
            value={`${wellnessHabits.length} registrados`}
            icon={<Activity className="w-12 h-12 text-green-400" />}
            description="Sono, alimentação, exercícios e mais"
            to="/health/habits"
          />
          <Card
            title="Alertas Ativos"
            value={alerts.length}
            icon={<AlertTriangle className="w-12 h-12 text-red-600" />}
            description="Atenção para sua saúde"
            to="/health/alerts"
          />
        </section>

        {/* Calendário de Saúde */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Calendário de Saúde</h2>
          {renderCalendar()}
        </section>

        {/* Dashboard resumo de hábitos */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Resumo de Hábitos</h2>
          {renderWellnessHabits()}
        </section>

        {/* Registro Manual */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Registros Manuais de Saúde Física</h2>
          {renderManualRecords()}
        </section>

        {/* Alertas */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Alertas e Recomendações</h2>
          {renderAlerts()}
        </section>

        {/* Carrossel meditações guiadas */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Meditações Guiadas</h2>
          <Carousel items={meditationItems} />
        </section>

        {/* Carrossel textos educativos */}
        <section className="mb-20">
          <h2 className="text-xl font-semibold mb-3">Textos Educativos</h2>
          <Carousel items={educationalArticles} />
        </section>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
