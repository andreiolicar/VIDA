
import { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';

export default function CalendarTasks() {
  const userId = localStorage.getItem('user');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Busca todas as tarefas do usuário
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/tasks/user/${userId}`);
      setTasks(res.data || []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filtra tarefas pelo dia selecionado
  const filteredTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    return (
      due.getFullYear() === selectedDate.getFullYear() &&
      due.getMonth() === selectedDate.getMonth() &&
      due.getDate() === selectedDate.getDate()
    );
  });

  // Renderiza calendário simples (pode trocar por react-calendar para mais recursos)
  function renderCalendar() {
    const now = new Date();
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
      <div className="bg-[#111827] rounded-xl p-4 shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setSelectedDate(new Date(year, month - 1, 1))}
          >
            &lt;
          </button>
          <span className="font-semibold">
            {selectedDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setSelectedDate(new Date(year, month + 1, 1))}
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: new Date(year, month, 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday =
              day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            const isSelected =
              day === selectedDate.getDate() &&
              month === selectedDate.getMonth() &&
              year === selectedDate.getFullYear();
            return (
              <button
                key={day}
                className={`rounded-full w-8 h-8 flex items-center justify-center transition 
                  ${isSelected ? 'bg-blue-500 text-white' : isToday ? 'border border-blue-400' : 'hover:bg-blue-900'}`}
                onClick={() => setSelectedDate(new Date(year, month, day))}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Calendário de Tarefas</h1>

          {renderCalendar()}

          <div className="bg-[#1f2937] rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">
              Tarefas para {selectedDate.toLocaleDateString('pt-BR')}
            </h2>
            {loading ? (
              <p className="text-gray-400">Carregando...</p>
            ) : filteredTasks.length === 0 ? (
              <p className="text-gray-400">Nenhuma tarefa para este dia.</p>
            ) : (
              <ul className="space-y-3">
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between bg-[#111827] rounded-lg px-4 py-2"
                  >
                    <span>
                      <b>{task.title}</b> -{' '}
                      <span className="text-sm text-gray-400">{task.priority}</span>
                    </span>
                    <a
                      href={`/dashboard/tasks/${task.id}`}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Ver detalhes
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
