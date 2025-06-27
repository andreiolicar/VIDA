import Sidebar from "@/components/dashboard/Sidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardRightPanel";

export default function DashboardWellnessHabit() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#06141e] to-[#0f2533] text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col px-4 md:px-10 py-8 max-w-[1440px] mx-auto overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Hábitos de Bem-estar</h1>
        <p className="text-gray-300">Aqui ficará a gestão e progresso dos hábitos saudáveis.</p>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
