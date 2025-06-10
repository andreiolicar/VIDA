import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import UserProfile from './UserProfile';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

function isSameDate(d1, d2) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro",
];

const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function Calendar({ tasks = [] }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksOfSelectedDate, setTasksOfSelectedDate] = useState([]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(new Date(currentYear, currentMonth, day));

  const taskDatesSet = new Set(
    tasks
      .filter(task => task.dueDate)
      .map(task => {
        const d = new Date(task.dueDate);
        return isNaN(d) ? null : d.toISOString().split('T')[0];
      })
      .filter(Boolean)
  );

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
    setTasksOfSelectedDate([]);
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
    setTasksOfSelectedDate([]);
  }

  function handleSelectDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    const tasksForDay = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return !isNaN(taskDate) && taskDate.toISOString().startsWith(dateStr);
    });
    if (tasksForDay.length > 0) {
      setSelectedDate(date);
      setTasksOfSelectedDate(tasksForDay);
    } else {
      setSelectedDate(null);
      setTasksOfSelectedDate([]);
    }
  }

  return (
    <div
      className="bg-[#1f2937] rounded-xl p-4 text-white flex flex-col select-none custom-scrollbar"
      style={{ maxHeight: '400px', overflowY: 'auto' }}
    >
      <div className="flex items-center justify-between mb-2">
        <button className="p-1 hover:bg-white/10 rounded transition" onClick={handlePrevMonth} aria-label="Mês anterior" type="button">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{monthNames[currentMonth]} {currentYear}</h2>
        <button className="p-1 hover:bg-white/10 rounded transition" onClick={handleNextMonth} aria-label="Próximo mês" type="button">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2 font-medium">
        {weekDayLabels.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} />;
          const isToday = isSameDate(date, new Date());
          const isSelected = selectedDate && isSameDate(date, selectedDate);
          const dateStr = date.toISOString().split('T')[0];
          const hasTask = taskDatesSet.has(dateStr);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleSelectDate(date)}
              type="button"
              aria-label={`Dia ${date.getDate()}, ${isToday ? "hoje" : ""} ${isSelected ? "selecionado" : ""}`}
              className={`
                aspect-square flex items-center justify-center rounded-md text-sm transition-colors
                ${isSelected ? "bg-yellow-400 text-white font-semibold border border-yellow-400 rounded-lg" : "hover:bg-white/20"}
                ${isToday && !isSelected ? "border border-blue-500" : ""}
                focus:outline-none focus:ring-2 focus:ring-blue-400
                relative
                ${hasTask && !isSelected ? "border border-yellow-400 rounded-lg" : ""}
              `}
              style={{ borderWidth: hasTask || isSelected ? '1px' : undefined }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {tasksOfSelectedDate.length > 0 && (
        <div className="mt-4 max-h-28 overflow-auto rounded-lg p-3">
          <ul className="space-y-2">
            {tasksOfSelectedDate.map(task => (
              <li key={task.id} className="flex items-center space-x-2">
                <span
                  className="bg-yellow-400"
                  style={{
                    width: '8px',
                    height: '8px',
                    display: 'inline-block',
                    transform: 'rotate(45deg)',
                    borderRadius: '1px',
                  }}
                />
                <span className="text-white font-semibold flex items-center gap-1">
                  {task.title}
                  {task.status === 'feito' && (
                    <Check size={16} className="text-green-400" aria-label="Tarefa concluída" title="Tarefa concluída" />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937; /* cor do fundo do card/calendário */
          border-radius: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #374151; /* cor do "polegar" da barra */
          border-radius: 8px;
          border: 2px solid #1f2937; /* cria um espaçamento ao redor do polegar */
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #374151 #1f2937;
        }
      `}</style>
    </div>
  );
}

export default function DashboardRightPanel({ tasks }) {
  const insights = [
    "O amanhã pertence àqueles que se preparam hoje. – Malcolm X",
    "Não espere por oportunidades, crie-as.",
    "A disciplina é a ponte entre objetivos e realizações.",
    "Persistência é o caminho do êxito.",
    "Cada pequeno esforço soma para grandes resultados.",
    "Aprender é um tesouro que seguirá seu dono em todos os lugares.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  ];

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const insight = insights[dayOfYear % insights.length];

  return (
    <aside className="hidden xl:flex flex-col w-[320px] text-white px-6 py-8 space-y-6 rounded-xl">
      <UserProfile />

      <Calendar tasks={tasks} />

      <div className="p-6 bg-[#1f2937] rounded-xl shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Insight do dia</h3>
        <p className="text-gray-300 italic text-sm md:text-base">{insight}</p>
      </div>
    </aside>
  );
}
