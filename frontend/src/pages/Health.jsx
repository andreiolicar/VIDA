import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import {
  Heart,
  CalendarCheck,
  Activity,
  AlertTriangle,
  Stethoscope,
  FlaskConical,
} from "lucide-react";

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Card({ title, icon, description, to }) {
  return (
    <Link
      to={to}
      className="bg-[#1f2937] flex-shrink-0 w-[22%] rounded-xl p-5 shadow-lg flex flex-col items-center hover:bg-opacity-80 transition group focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-semibold mb-1 text-center">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm text-center">{description}</p>
      )}
    </Link>
  );
}

export default function DashboardHealth() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [wellnessHabits, setWellnessHabits] = useState([]);
  const [manualRecords, setManualRecords] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

    const savedWellnessHabits = localStorage.getItem("wellnessHabits");
    if (savedWellnessHabits) setWellnessHabits(JSON.parse(savedWellnessHabits));

    const savedManualRecords = localStorage.getItem("manualRecords");
    if (savedManualRecords) setManualRecords(JSON.parse(savedManualRecords));

    const savedAlerts = localStorage.getItem("alerts");
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
  }, []);

  function renderAppointments() {
    if (!appointments.length)
      return <p className="text-gray-400 mt-2">Nenhuma consulta ou exame agendado.</p>;

    return appointments.map((item) => (
      <div
        key={item.id}
        className="bg-[#2a3748] rounded p-4 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-[#324057] transition"
        onClick={() =>
          navigate(
            item.type === "consulta"
              ? "/dashboard/health/score"
              : "/dashboard/health/score"
          )
        }
        title={`${item.title} - ${item.description || ""}`}
      >
        <div className="flex items-center gap-3">
          {item.type === "consulta" ? (
            <Stethoscope className="text-blue-400 w-6 h-6" />
          ) : (
            <FlaskConical className="text-purple-400 w-6 h-6" />
          )}
          <div>
            <h4 className="font-semibold">{item.title}</h4>
            {item.description && (
              <p className="text-gray-400 text-sm">{item.description}</p>
            )}
            {item.location && (
              <p className="text-gray-500 text-xs">Local: {item.location}</p>
            )}
          </div>
        </div>
        <div className="mt-2 sm:mt-0 text-sm text-gray-300">
          {formatDateTime(item.dateTime)}
        </div>
      </div>
    ));
  }

  function renderWellnessHabits() {
    if (!wellnessHabits.length)
      return <p className="text-gray-400 mt-2">Nenhum hábito registrado.</p>;

    return wellnessHabits.map((habit) => (
      <div
        key={habit.id}
        className="bg-[#2a3748] rounded p-4 mb-3 flex flex-col sm:flex-row items-center justify-between cursor-pointer hover:bg-[#324057] transition"
        onClick={() => navigate("/dashboard/health/habits")}
        title={`Meta: ${habit.target} | Atual: ${habit.currentValue} ${habit.unit}`}
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
      return <p className="text-gray-400 mt-2">Nenhum registro manual.</p>;

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
            <tr
              key={record.id}
              className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
              onClick={() => navigate("/dashboard/health/manual-records")}
              title={`${record.type} - ${record.notes || ""}`}
            >
              <td className="p-2">{new Date(record.date).toLocaleDateString("pt-BR")}</td>
              <td className="p-2 capitalize">{record.type}</td>
              <td className="p-2 font-semibold">
                {record.value} {record.unit}
              </td>
              <td className="p-2 truncate max-w-xs">{record.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderAlerts() {
    if (!alerts.length)
      return <p className="text-gray-400 mt-2">Nenhum alerta no momento.</p>;

    return alerts.map((alert) => (
      <div
        key={alert.id}
        className={`rounded p-3 mb-2 flex items-center gap-3 cursor-pointer transition ${
          alert.priority === "alta"
            ? "bg-red-700 hover:bg-red-800"
            : alert.priority === "média"
            ? "bg-yellow-700 hover:bg-yellow-800"
            : "bg-gray-700 hover:bg-gray-800"
        }`}
        title={alert.details}
        onClick={() => alert.userAction && navigate(alert.userAction)}
      >
        <AlertTriangle className="text-white w-6 h-6" />
        <div>
          <p className="font-semibold">{alert.title}</p>
          <p className="text-sm text-gray-200">{alert.summary}</p>
          <p className="text-xs text-gray-400">
            Prioridade: {alert.priority || "média"} - {new Date(alert.date).toLocaleDateString("pt-BR")}
          </p>
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
            title="Consultas e Exames"
            icon={<Heart className="w-12 h-12 text-red-400" />}
            description="Gerencie seus agendamentos"
            to="/dashboard/health/score"
          />
          <Card
            title="Check-in Emocional"
            icon={<CalendarCheck className="w-12 h-12 text-yellow-400" />}
            description="Como você está se sentindo?"
            to="/dashboard/health/checkin"
          />
          <Card
            title="Hábitos de Bem-estar"
            icon={<Activity className="w-12 h-12 text-green-400" />}
            description="Sono, alimentação, exercícios..."
            to="/dashboard/health/habits"
          />
          <Card
            title="Alertas"
            icon={<AlertTriangle className="w-12 h-12 text-red-600" />}
            description="Verifique recomendações"
            to="/dashboard/health/alerts"
          />
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 flex justify-between items-center">
            Consultas e Exames Agendados
            <Link
              to="/dashboard/health/score"
              className="text-green-400 hover:underline text-sm"
            >
              Ver todos
            </Link>
          </h2>
          {renderAppointments()}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 flex justify-between items-center">
            Resumo de Hábitos
            <Link
              to="/dashboard/health/habits"
              className="text-green-400 hover:underline text-sm"
            >
              Gerenciar hábitos
            </Link>
          </h2>
          {renderWellnessHabits()}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3 flex justify-between items-center">
            Registros Manuais de Saúde Física
            <Link
              to="/dashboard/health/manual-records"
              className="text-green-400 hover:underline text-sm"
            >
              Ver registros
            </Link>
          </h2>
          {renderManualRecords()}
        </section>

        <section className="mb-20">
          <h2 className="text-xl font-semibold mb-3 flex justify-between items-center">
            Alertas e Recomendações
            <Link
              to="/dashboard/health/alerts"
              className="text-green-400 hover:underline text-sm"
            >
              Ver alertas
            </Link>
          </h2>
          {renderAlerts()}
        </section>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
