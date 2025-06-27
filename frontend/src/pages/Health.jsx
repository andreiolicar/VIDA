// DashboardHealth.jsx
import { useEffect, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { Heart, CalendarCheck, Activity, AlertTriangle } from 'lucide-react';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function Card({ title, icon, description, to }) {
  return (
    <Link
      to={to}
      className="bg-[#1f2937] flex-shrink-0 w-[22%] rounded-xl p-5 shadow-lg flex flex-col items-center hover:bg-opacity-80 transition group focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-semibold mb-1 text-center">{title}</h3>
      {description && <p className="text-gray-400 text-sm text-center">{description}</p>}
    </Link>
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

  const [healthScore, setHealthScore] = useState(null);
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [checkInToday, setCheckInToday] = useState(null);
  const [wellnessHabits, setWellnessHabits] = useState([]);
  const [manualRecords, setManualRecords] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!userId) return;

    async function fetchHealthData() {
      try {
        const scoreRes = await axios.get(`/health/${userId}/score`);
        setHealthScore(scoreRes.data.score ?? null);

        const calendarRes = await axios.get(`/health/${userId}/calendar`);
        setCalendarEntries(calendarRes.data ?? []);

        const checkInRes = await axios.get(`/health/${userId}/checkin/today`);
        setCheckInToday(checkInRes.data ?? null);

        const habitsRes = await axios.get(`/health/${userId}/habits`);
        setWellnessHabits(habitsRes.data ?? []);

        const recordsRes = await axios.get(`/health/${userId}/manual-records`);
        setManualRecords(recordsRes.data ?? []);

        const alertsRes = await axios.get(`/health/${userId}/alerts`);
        setAlerts(alertsRes.data ?? []);
      } catch (error) {
        console.error('Erro ao buscar dados da saúde:', error);
      }
    }

    fetchHealthData();
  }, [userId]);

  function renderCalendar() {
    if (!calendarEntries.length)
      return <p className="text-[#ef4444] font-medium">Nenhum registro no calendário.</p>;
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
    if (!wellnessHabits.length)
      return <p className="text-[#ef4444] font-medium">Nenhum hábito registrado.</p>;
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
    if (!manualRecords.length)
      return <p className="text-[#ef4444] font-medium">Nenhum registro manual.</p>;
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
    if (!alerts.length)
      return <p className="text-[#ef4444] font-medium">Nenhum alerta no momento.</p>;
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
    <div className="flex min-h-screen bg-gradient-to-br from-[#06141e] to-[#0f2533] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col px-4 md:px-10 py-8 max-w-[1440px] mx-auto overflow-y-auto">
        <section className="w-full flex flex-nowrap justify-between gap-6 mb-8 overflow-x-auto">
          <Card
            title="Health Score"
            icon={<Heart className="w-12 h-12 text-red-400" />}
            description="Feedback geral de saúde baseado em dados e IA"
            to="/health/score"
          />
          <Card
            title="Check-in Emocional"
            icon={<CalendarCheck className="w-12 h-12 text-yellow-400" />}
            description="Como você se sente hoje?"
            to="/health/checkin"
          />
          <Card
            title="Hábitos de Bem-estar"
            icon={<Activity className="w-12 h-12 text-green-400" />}
            description="Sono, alimentação, exercícios e mais"
            to="/health/habits"
          />
          <Card
            title="Alertas Ativos"
            icon={<AlertTriangle className="w-12 h-12 text-red-600" />}
            description="Atenção para sua saúde"
            to="/health/alerts"
          />
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Consultas e Exames</h2>
          {renderCalendar()}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Resumo de Hábitos</h2>
          {renderWellnessHabits()}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Registros Manuais de Saúde Física</h2>
          {renderManualRecords()}
        </section>

        <section className="mb-20">
          <h2 className="text-xl font-semibold mb-3">Alertas e Recomendações</h2>
          {renderAlerts()}
        </section>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
