import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, AlertTriangle } from "lucide-react";
import { Bar } from "react-chartjs-2";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";

export default function DashboardWellnessHabit() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("main");

  const [mainHabits, setMainHabits] = useState({
    exercise: [],
    exerciseFrequency: "",
    water: "",
    pressure: "",
    glucose: "",
    oxygen: "",
    diet: "",
    diseases: "",
    notes: "",
  });

  const [newHabit, setNewHabit] = useState({ name: "", description: "" });
  const [habitList, setHabitList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Simulação de risco
  const riskLevel = 4; // Exemplo fixo
  const riskData = {
    labels: ["Risco"],
    datasets: [
      {
        label: "Nível",
        data: [riskLevel],
        backgroundColor: riskLevel >= 5 ? "rgba(239, 68, 68, 0.7)" : "rgba(34,197,94,0.7)",
      },
    ],
  };

  useEffect(() => {
    fetch("/api/wellnessform")
      .then((res) => res.json())
      .then((data) => {
        if (data) setMainHabits(data);
      })
      .catch(() =>
        setMainHabits({
          exercise: [],
          exerciseFrequency: "",
          water: "",
          pressure: "",
          glucose: "",
          oxygen: "",
          diet: "",
          diseases: "",
          notes: "",
        })
      );
  }, []);

  function toggleExercise(opt) {
    const exists = mainHabits.exercise.find((e) =>
      opt === "Outro" ? e.startsWith("Outro:") : e === opt
    );
    let updated;
    if (exists) {
      updated = mainHabits.exercise.filter((e) =>
        opt === "Outro" ? !e.startsWith("Outro:") : e !== opt
      );
    } else {
      updated = [...mainHabits.exercise, opt];
    }
    setMainHabits({ ...mainHabits, exercise: updated });
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/wellnessform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mainHabits),
      });
      if (!res.ok) throw new Error("Erro ao salvar dados");
      alert("Formulário salvo com sucesso!");
    } catch (err) {
      setError("Falha ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function addHabit() {
    if (!newHabit.name.trim()) return;
    setHabitList([...habitList, newHabit]);
    setNewHabit({ name: "", description: "" });
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />
      <main className="flex-1 px-4 md:px-10 py-8 max-w-[1440px] mx-auto overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bem-estar e Hábitos</h1>
          <Link to="/dashboard/health">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
              Voltar
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-3 py-2 rounded ${
              activeTab === "main" ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("main")}
          >
            Hábitos Principais
          </button>
          <button
            className={`px-3 py-2 rounded ${
              activeTab === "add" ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("add")}
          >
            Adicionar Hábito
          </button>
          <button
            className={`px-3 py-2 rounded ${
              activeTab === "risk" ? "bg-green-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("risk")}
          >
            Nível de Preocupação
          </button>
        </div>

        {/* Aba Principal */}
        {activeTab === "main" && (
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Preencha suas informações de saúde e hábitos
            </h2>

            {/* Exercício físico */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 font-medium">Exercício físico *</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Musculação",
                  "Caminhada",
                  "Corrida",
                  "Ciclismo",
                  "Yoga",
                  "Pilates",
                  "Natação",
                  "Crossfit",
                  "Dança",
                  "Alongamento",
                  "Outro",
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleExercise(opt)}
                    className={`px-3 py-1 rounded ${
                      mainHabits.exercise.includes(opt) ||
                      (opt === "Outro" &&
                        mainHabits.exercise.some((e) => e.startsWith("Outro:")))
                        ? "bg-green-600"
                        : "bg-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {mainHabits.exercise.some((e) => e.startsWith("Outro:")) && (
                <input
                  type="text"
                  placeholder="Especifique outro exercício"
                  value={
                    mainHabits.exercise.find((e) => e.startsWith("Outro:"))?.split(": ")[1] || ""
                  }
                  onChange={(e) => {
                    const others = mainHabits.exercise.filter(
                      (x) => !x.startsWith("Outro:")
                    );
                    setMainHabits({
                      ...mainHabits,
                      exercise: [...others, `Outro: ${e.target.value}`],
                    });
                  }}
                  className="w-full bg-gray-800 p-2 rounded mt-2"
                />
              )}
            </div>

            {/* Frequência e água */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">
                  Quantas vezes por semana? *
                </label>
                <input
                  type="text"
                  value={mainHabits.exerciseFrequency}
                  onChange={(e) =>
                    setMainHabits({ ...mainHabits, exerciseFrequency: e.target.value })
                  }
                  className="bg-gray-800 p-2 rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">
                  Consumo médio de água (litros/dia) *
                </label>
                <input
                  type="text"
                  value={mainHabits.water}
                  onChange={(e) =>
                    setMainHabits({ ...mainHabits, water: e.target.value })
                  }
                  className="bg-gray-800 p-2 rounded"
                />
              </div>
            </div>

            {/* Pressão, glicemia, saturação, dieta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[
                { label: "Pressão arterial", field: "pressure", options: ["Normal", "Alta", "Baixa"] },
                { label: "Glicemia", field: "glucose", options: ["Normal", "Alta", "Baixa"] },
                { label: "Saturação de oxigênio", field: "oxygen", options: ["Normal", "Baixa"] },
                { label: "Pratica alguma dieta?", field: "diet", options: ["Sim", "Não"] },
              ].map(({ label, field, options }) => (
                <div className="flex flex-col" key={field}>
                  <label className="mb-1 font-medium">{label} *</label>
                  <select
                    value={mainHabits[field]}
                    onChange={(e) =>
                      setMainHabits({ ...mainHabits, [field]: e.target.value })
                    }
                    className="bg-gray-800 p-2 rounded"
                  >
                    <option value="">Selecione</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Doenças e notas */}
            <div className="flex flex-col mb-4">
              <label className="mb-1 font-medium">
                Possui alguma doença ou condição médica importante? *
              </label>
              <textarea
                rows={3}
                value={mainHabits.diseases}
                onChange={(e) =>
                  setMainHabits({ ...mainHabits, diseases: e.target.value })
                }
                className="bg-gray-800 p-2 rounded"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="mb-1 font-medium">Observações adicionais</label>
              <textarea
                rows={3}
                value={mainHabits.notes}
                onChange={(e) =>
                  setMainHabits({ ...mainHabits, notes: e.target.value })
                }
                className="bg-gray-800 p-2 rounded"
              />
            </div>

            {error && <p className="mt-2 text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-4 px-4 py-2 rounded ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </section>
        )}

        {/* Aba Adicionar Hábitos */}
        {activeTab === "add" && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus /> Adicionar Novo Hábito
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Nome do hábito *</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full bg-gray-800 p-2 rounded mt-1"
                />
              </div>
              <div>
                <label>Descrição *</label>
                <input
                  type="text"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  className="w-full bg-gray-800 p-2 rounded mt-1"
                />
              </div>
            </div>
            <button
              className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
              onClick={addHabit}
            >
              Adicionar
            </button>

            {habitList.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Hábitos cadastrados:</h3>
                <ul className="space-y-2">
                  {habitList.map((h, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-700 rounded p-2 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{h.name}</p>
                        <p className="text-gray-300">{h.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Aba Preocupação */}
        {activeTab === "risk" && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle /> Nível de Preocupação
            </h2>
            <Bar data={riskData} />
            {riskLevel >= 5 ? (
              <div className="mt-4 text-red-400">
                🚨 Sua situação requer atenção. Por favor, verifique seus{" "}
                <button
                  onClick={() => navigate("/dashboard/health/alerts")}
                  className="underline"
                >
                  alertas de saúde
                </button>.
              </div>
            ) : (
              <div className="mt-4 text-green-400">
                ✅ Nenhum risco imediato detectado.
              </div>
            )}
          </section>
        )}
      </main>
      <DashboardRightPanel />
    </div>
  );
}
