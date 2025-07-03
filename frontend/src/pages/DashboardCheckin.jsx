import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Smile, Meh, Frown, Angry } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import "chart.js/auto";

const moods = [
  { icon: <Smile className="text-green-400" />, label: "Feliz", value: "happy" },
  { icon: <Meh className="text-yellow-400" />, label: "Ok", value: "neutral" },
  { icon: <Frown className="text-blue-400" />, label: "Triste", value: "sad" },
  { icon: <Angry className="text-red-400" />, label: "Irritado", value: "angry" },
];

export default function DashboardCheckin() {
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/moodcheckins")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(() => setEntries([]));
  }, []);

  async function handleSubmit() {
    if (!selectedMood) return;
    setLoading(true);
    setError("");

    const newEntry = {
      mood: selectedMood,
      note: note.trim(),
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/moodcheckins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) throw new Error("Erro ao salvar check-in");

      const savedEntry = await res.json();
      setEntries((prev) => [savedEntry, ...prev]);
      setSelectedMood("");
      setNote("");
    } catch (err) {
      setError("Não foi possível salvar o check-in. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const moodCounts = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});
  const total = entries.length || 1;
  const moodPercentages = {
    happy: ((moodCounts.happy || 0) / total) * 100,
    neutral: ((moodCounts.neutral || 0) / total) * 100,
    sad: ((moodCounts.sad || 0) / total) * 100,
    angry: ((moodCounts.angry || 0) / total) * 100,
  };

  const lastEntries = [...entries].slice(0, 7).reverse();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#06141e] to-[#0f2533] text-white">
      <Sidebar />
      <main className="flex-1 px-4 md:px-10 py-8 max-w-[1440px] mx-auto overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Check-in Emocional</h1>
          <Link to="/dashboard/health">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
              Voltar
            </button>
          </Link>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Como você está se sentindo hoje?</h2>
          <div className="flex gap-4 mb-4">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  selectedMood === m.value ? "border-green-400" : "border-transparent"
                } hover:bg-[#1f2937]`}
                disabled={loading}
              >
                {m.icon}
                <span className="text-sm">{m.label}</span>
              </button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva algo se quiser..."
            className="w-full p-2 bg-[#1f2937] rounded mb-3"
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedMood}
            className={`px-4 py-2 rounded transition ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Salvando..." : "Salvar Check-in"}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Gráfico de Humor (Últimos 7 registros)</h2>
          <Line
            data={{
              labels: lastEntries.map((e) =>
                new Date(e.date).toLocaleDateString("pt-BR")
              ),
              datasets: [
                {
                  label: "Humor",
                  data: lastEntries.map((e) =>
                    ["happy", "neutral", "sad", "angry"].indexOf(e.mood)
                  ),
                  borderColor: lastEntries.length
                    ? lastEntries.map((e) => {
                        if (e.mood === "happy") return "#22c55e";
                        if (e.mood === "neutral") return "#eab308";
                        if (e.mood === "sad") return "#3b82f6";
                        if (e.mood === "angry") return "#ef4444";
                        return "#fff";
                      })
                    : "#fff",
                  backgroundColor: lastEntries.length
                    ? lastEntries.map((e) => {
                        if (e.mood === "happy") return "rgba(34, 197, 94, 0.3)";
                        if (e.mood === "neutral") return "rgba(234, 179, 8, 0.3)";
                        if (e.mood === "sad") return "rgba(59, 130, 246, 0.3)";
                        if (e.mood === "angry") return "rgba(239, 68, 68, 0.3)";
                        return "rgba(255, 255, 255, 0.3)";
                      })
                    : "rgba(255, 255, 255, 0.3)",
                  fill: true,
                  tension: 0.3,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  ticks: {
                    callback: (v) =>
                      ["Feliz", "Ok", "Triste", "Irritado"][v] || "",
                  },
                  beginAtZero: true,
                  stepSize: 1,
                  max: 3,
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const mood =
                        ["Feliz", "Ok", "Triste", "Irritado"][ctx.parsed.y];
                      return mood || "";
                    },
                  },
                },
              },
            }}
          />
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">
            Resumo dos Últimos Check-ins
          </h2>
          <ul>
            {entries.map((e, i) => (
              <li
                key={i}
                className="mb-2 bg-[#1f2937] p-3 rounded flex justify-between"
              >
                <span>{new Date(e.date).toLocaleDateString("pt-BR")}</span>
                <span className="capitalize">{e.mood}</span>
                <span className="text-gray-400 truncate max-w-xs">
                  {e.note || "-"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Tendência Emocional</h2>
          <p className="mb-3">
            Você esteve feliz em{" "}
            <span className="font-bold text-green-400">
              {moodPercentages.happy.toFixed(0)}%
            </span>{" "}
            dos registros.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Seja gentil consigo mesmo.",
              "Pratique respiração profunda.",
              "Tire um tempo offline.",
              "Hidrate-se bem hoje.",
            ].map((tip, i) => (
              <div
                key={i}
                className="bg-[#2a3748] p-3 rounded text-sm text-center"
              >
                {tip}
              </div>
            ))}
          </div>
        </section>
      </main>
      <DashboardRightPanel />
    </div>
  );
}

