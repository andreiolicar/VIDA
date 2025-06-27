// src/pages/DashboardWellnessHabit.jsx
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";

export default function DashboardWellnessHabit() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wellnessHabits")) || [];
    setHabits(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("wellnessHabits", JSON.stringify(habits));
  }, [habits]);

  function handleAddHabit() {
    if (!name || !target || !unit) return;
    const newHabit = {
      id: Date.now(),
      name,
      description,
      target: parseFloat(target),
      unit,
      currentValue: 0,
      history: [],
    };
    setHabits([newHabit, ...habits]);
    setName("");
    setDescription("");
    setTarget("");
    setUnit("");
  }

  function markAsDone(id) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              currentValue: h.target,
              history: [
                ...h.history,
                { date: new Date().toISOString(), value: h.target },
              ],
            }
          : h
      )
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#06141e] to-[#0f2533] text-white">
      <Sidebar />
      <main className="flex-1 px-4 md:px-10 py-8 max-w-[1440px] mx-auto overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Hábitos de Bem-estar</h1>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Adicionar Novo Hábito</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <input
              className="p-2 bg-[#1f2937] rounded"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="p-2 bg-[#1f2937] rounded"
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="p-2 bg-[#1f2937] rounded"
              placeholder="Meta (ex: 2)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <input
              className="p-2 bg-[#1f2937] rounded"
              placeholder="Unidade (ex: L, km)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddHabit}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Adicionar Hábito
          </button>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Seus Hábitos</h2>
          {habits.length === 0 && (
            <p className="text-gray-400">Nenhum hábito cadastrado.</p>
          )}
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-[#2a3748] rounded p-4 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <h4 className="font-semibold">{habit.name}</h4>
                {habit.description && (
                  <p className="text-gray-400 text-sm">{habit.description}</p>
                )}
                <p className="text-gray-300 text-sm">
                  Meta: {habit.target} {habit.unit} | Atual: {habit.currentValue}{" "}
                  {habit.unit}
                </p>
              </div>
              <button
                onClick={() => markAsDone(habit.id)}
                className="mt-2 sm:mt-0 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Marcar como feito
              </button>
            </div>
          ))}
        </section>
      </main>
      <DashboardRightPanel />
    </div>
  );
}
