import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function handleSelectDate(date) {
    setSelectedDate(date);
  }

  const monthNames = [
    "Janeiro", "Fevereiro", "Março",
    "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro",
    "Outubro", "Novembro", "Dezembro",
  ];

  const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="bg-[#1f2937] rounded-xl p-4 text-white flex flex-col select-none"
      style={{ maxHeight: '400px', overflowY: 'auto' }}>

      <div className="flex items-center justify-between mb-2">
        <button
          className="p-1 hover:bg-white/10 rounded transition"
          onClick={handlePrevMonth}
          aria-label="Mês anterior"
          type="button"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{monthNames[currentMonth]} {currentYear}</h2>
        <button
          className="p-1 hover:bg-white/10 rounded transition"
          onClick={handleNextMonth}
          aria-label="Próximo mês"
          type="button"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2 font-medium">
        {weekDayLabels.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} />;

          const isToday = isSameDate(date, new Date());
          const isSelected = isSameDate(date, selectedDate);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleSelectDate(date)}
              className={`
                aspect-square flex items-center justify-center rounded-md text-sm
                transition-colors
                ${isSelected ? "bg-blue-600 text-white font-semibold" : "hover:bg-white/20"}
                ${isToday && !isSelected ? "border border-blue-500" : ""}
                focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
              aria-label={`Dia ${date.getDate()}, ${isToday ? "hoje" : ""} ${isSelected ? "selecionado" : ""}`}
              type="button"
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function DashboardRightPanel() {
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
  const dayOfYear = getDayOfYear(today);
  const insight = insights[dayOfYear % insights.length];

  return (
    <aside className="hidden xl:flex flex-col w-[320px] text-white px-6 py-8 space-y-6 rounded-xl">
      <UserProfile />

      <Calendar />

      <div className="p-6 bg-[#1f2937] rounded-xl shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Insight do dia</h3>
        <p className="text-gray-300 italic text-sm md:text-base">{insight}</p>
      </div>
    </aside>
  );
}
