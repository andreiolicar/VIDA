import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/styles/calendar-custom.css';

export default function CalendarStyled({ events = [], onDayClick }) {
  const today = new Date();

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.datetime);
        return (
          eventDate.getFullYear() === date.getFullYear() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getDate() === date.getDate()
        );
      });
      if (dayEvents.length > 0) {
        return 'event-day';
      }
    }
    return null;
  };

  return (
    <div className="bg-[#1f2937]/80 rounded-xl p-4 shadow-md w-full">
      <Calendar
        value={today} // fixa o dia ativo no dia atual
        locale="pt-BR"
        className="modern-calendar"
        prevLabel="❮"
        nextLabel="❯"
        prev2Label={null}
        next2Label={null}
        tileClassName={tileClassName}
        onClickDay={(value) => {
          if (onDayClick) onDayClick(value);
          // NÃO atualiza o valor do calendário
        }}
      />
    </div>
  );
}
