import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";

export default function DashboardHealthAlert() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("alerts")) || [];
    setAlerts(saved);
  }, []);

  function resolveAlert(id) {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a
      )
    );
  }

  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#06141e] to-[#0f2533] text-white">
      <Sidebar />
      <main className="flex-1 px-4 md:px-10 py-8 max-w-[1440px] mx-auto overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Alertas de Saúde</h1>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Alertas Ativos</h2>
          {alerts.filter((a) => !a.resolved).length === 0 && (
            <p className="text-gray-400">Nenhum alerta ativo.</p>
          )}
          {alerts
            .filter((a) => !a.resolved)
            .map((alert) => (
              <div
                key={alert.id}
                className="bg-red-700 rounded p-3 mb-2 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm">{alert.description}</p>
                  <p className="text-xs text-gray-200">
                    Prioridade: {alert.priority} |{" "}
                    {new Date(alert.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition flex items-center gap-1"
                >
                  <CheckCircle size={16} />
                  Resolver
                </button>
              </div>
            ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Histórico de Alertas</h2>
          {alerts.filter((a) => a.resolved).length === 0 && (
            <p className="text-gray-400">Nenhum alerta resolvido.</p>
          )}
          {alerts
            .filter((a) => a.resolved)
            .map((alert) => (
              <div
                key={alert.id}
                className="bg-[#2a3748] rounded p-3 mb-2 flex justify-between"
              >
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm">{alert.description}</p>
                  <p className="text-xs text-gray-400">
                    Resolvido em:{" "}
                    {new Date(alert.resolvedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
        </section>
      </main>
      <DashboardRightPanel />
    </div>
  );
}

