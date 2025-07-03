import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";
import { Edit, Trash } from "lucide-react";

const PRIORITIES = ["baixa", "media", "alta"];

export default function DashboardHealthScore() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [formType, setFormType] = useState("consulta");
  const [formTitle, setFormTitle] = useState("");
  const [formDateTime, setFormDateTime] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formPriority, setFormPriority] = useState("media");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Carrega agendamentos da API
  useEffect(() => {
    fetch("/api/appointments", {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(setAppointments)
      .catch((err) => console.error(err));
  }, []);

  const resetForm = () => {
    setFormType("consulta");
    setFormTitle("");
    setFormDateTime("");
    setFormDescription("");
    setFormLocation("");
    setFormPriority("media");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDateTime.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    setSaving(true);

    const data = {
      type: formType,
      title: formTitle.trim(),
      dateTime: formDateTime,
      description: formDescription.trim(),
      location: formLocation.trim(),
      priority: formPriority,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/appointments/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (!res.ok) throw new Error("Erro ao salvar agendamento.");

      const saved = await res.json();

      if (editingId) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === saved.id ? saved : a))
        );
      } else {
        setAppointments((prev) => [...prev, saved]);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar agendamento.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormDateTime(item.dateTime.slice(0, 16));
    setFormDescription(item.description);
    setFormLocation(item.location);
    setFormPriority(item.priority);
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) return;
    try {
      const res = await fetch(`/api/appointments/${appointmentToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir.");

      setAppointments((prev) =>
        prev.filter((a) => a.id !== appointmentToDelete.id)
      );
      setAppointmentToDelete(null);
      setShowConfirmModal(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir agendamento.");
    }
  };

  const filteredAppointments = appointments.filter((a) =>
    filterType ? a.type === filterType : true
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Consultas e Exames</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
            >
              {showForm ? "Cancelar" : "Novo Agendamento"}
            </button>
            <Link to="/dashboard/health">
              <button className="bg-gray-700 px-4 py-2 rounded">Voltar</button>
            </Link>
          </div>
        </div>

        {/* filtros */}
        <div className="flex gap-4 mb-6">
          {["", "consulta", "exame"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded ${
                filterType === t
                  ? "bg-indigo-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {t ? t.charAt(0).toUpperCase() + t.slice(1) : "Todos"}
            </button>
          ))}
        </div>

        {/* Formulário */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#1f2937] p-6 rounded-lg shadow max-w-2xl mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Editar" : "Novo"} Agendamento
            </h2>
            <div className="mb-4">
              <label className="block mb-1">Tipo</label>
              <div className="flex gap-4">
                {["consulta", "exame"].map((t) => (
                  <label key={t} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={t}
                      checked={formType === t}
                      onChange={() => setFormType(t)}
                    />
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Nome*</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="w-full rounded px-3 py-2 bg-[#111827]"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Data e Horário*</label>
              <input
                type="datetime-local"
                value={formDateTime}
                onChange={(e) => setFormDateTime(e.target.value)}
                required
                className="w-full rounded px-3 py-2 bg-[#111827]"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Descrição</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
                className="w-full rounded px-3 py-2 bg-[#111827]"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Local</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full rounded px-3 py-2 bg-[#111827]"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Prioridade</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value)}
                className="w-full rounded px-3 py-2 bg-[#111827]"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 w-full py-2 rounded hover:bg-indigo-700"
            >
              {saving ? "Salvando..." : editingId ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </form>
        )}

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.length === 0 ? (
            <p className="text-gray-400">Nenhum agendamento cadastrado.</p>
          ) : (
            filteredAppointments.map((a) => (
              <div
                key={a.id}
                className="bg-[#1f2937] p-4 rounded flex justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                  <p className="text-gray-400 capitalize">{a.type}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(a.dateTime).toLocaleString()}
                  </p>
                  {a.location && (
                    <p className="text-gray-400 text-sm">Local: {a.location}</p>
                  )}
                  <p className="text-gray-400 text-sm capitalize">
                    Prioridade: {a.priority}
                  </p>
                  {a.description && (
                    <p className="text-gray-500 mt-1">{a.description}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => startEdit(a)}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setAppointmentToDelete(a);
                      setShowConfirmModal(true);
                    }}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DashboardRightPanel tasks={appointments} />

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f2937] p-6 rounded max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirmar Exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir "{appointmentToDelete?.title}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


