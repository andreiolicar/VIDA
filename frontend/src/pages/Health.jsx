import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import {
  Heart,
  CalendarCheck,
  Activity,
  Edit2,
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

function Card({ title, icon, description, to, focusRingColor = "ring-green-500", className = "" }) {
  return (
    <Link
      to={to}
      className={`bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center hover:bg-opacity-80 transition group focus:outline-none focus:ring-2 ${focusRingColor} ${className}`}
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
  const [healthRecord, setHealthRecord] = useState(null);
  const [showHealthForm, setShowHealthForm] = useState(false);

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [pains, setPains] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setHealthRecord(data[0]);
        }
      })
      .catch(console.error);

    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

    const savedWellnessHabits = localStorage.getItem("wellnessHabits");
    if (savedWellnessHabits) setWellnessHabits(JSON.parse(savedWellnessHabits));
  }, []);

  async function handleHealthSubmit(e) {
    e.preventDefault();
    const payload = {
      gender,
      age,
      weight,
      height,
      pains,
      notes,
      date: new Date().toISOString(),
    };

    try {
      let res;
      if (healthRecord) {
        res = await fetch(`/api/health/${healthRecord.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/health", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Erro ao salvar registro.");
      const saved = await res.json();
      setHealthRecord(saved);
      setShowHealthForm(false);
    } catch (err) {
      alert("Erro ao salvar dados.");
      console.error(err);
    }
  }

  function renderAppointments() {
    if (!appointments.length)
      return <p className="text-gray-400 mt-2">Nenhuma consulta ou exame agendado.</p>;

    return appointments.map((item) => (
      <div
        key={item.id}
        className="bg-[#2a3748] rounded p-4 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-[#324057] transition"
        onClick={() => navigate("/dashboard/health/score")}
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
          <span className="text-gray-400 font-semibold">Meta: {habit.target}</span>
          <span className="text-gray-300">
            Atual: {habit.currentValue} {habit.unit}
          </span>
        </div>
      </div>
    ));
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col px-4 md:px-10 py-8 max-w-[1440px] mx-auto overflow-y-auto">
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card
            title="Consultas e Exames"
            icon={<Heart className="w-14 h-14 text-red-400" />}
            description="Gerencie seus agendamentos"
            to="/dashboard/health/score"
          />
          <Card
            title="Check-in Emocional"
            icon={<CalendarCheck className="w-14 h-14 text-yellow-400" />}
            description="Como você está se sentindo?"
            to="/dashboard/health/checkin"
          />
        </section>

        <section className="w-full mb-8">
          <Card
            title="Hábitos de Bem-estar"
            icon={<Activity className="w-14 h-14 text-green-400" />}
            description="Sono, alimentação, exercícios, doenças crônicas e condição médica"
            to="/dashboard/health/habits"
            focusRingColor="ring-blue-400"
            className="w-full"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
            Formulário de Saúde Física
            {!showHealthForm && (
              <button
                onClick={() => {
                  if (healthRecord) {
                    setGender(healthRecord.gender);
                    setAge(healthRecord.age);
                    setWeight(healthRecord.weight);
                    setHeight(healthRecord.height);
                    setPains(healthRecord.pains);
                    setNotes(healthRecord.notes);
                  }
                  setShowHealthForm(true);
                }}
                className="text-gray-400 flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" />
                {healthRecord ? "Editar Registro" : "Novo Registro"}
              </button>
            )}
          </h2>

          {showHealthForm && (
            <form
              onSubmit={handleHealthSubmit}
              className="bg-[#1f2937] p-6 rounded-lg max-w-xl"
            >
              <div className="mb-4">
                <label className="block mb-1">Sexo</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#111827] px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Idade</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#111827] px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-[#111827] px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-[#111827] px-3 py-2 rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Dores</label>
                <textarea
                  value={pains}
                  onChange={(e) => setPains(e.target.value)}
                  className="w-full bg-[#111827] px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Observações</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#111827] px-3 py-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
              >
                Salvar Registro
              </button>
            </form>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
            Consultas e Exames Agendados
            <Link
              to="/dashboard/health/score"
              className="text-gray-400 hover:underline text-sm"
            >
              Ver todos
            </Link>
          </h2>
          {renderAppointments()}
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
            Resumo de Hábitos
            <Link
              to="/dashboard/health/habits"
              className="text-gray-400 hover:underline text-sm"
            >
              Gerenciar hábitos
            </Link>
          </h2>
          {renderWellnessHabits()}
        </section>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
