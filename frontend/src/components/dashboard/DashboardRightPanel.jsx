import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CalendarStyled from './CalendarStyles';
import UserProfile from './UserProfile';
import RadioFilterGroup from './RadioFilterGroup';
import axios from '@/services/axios';

export default function DashboardRightPanel() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user');
  const [showCalendars, setShowCalendars] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEvents, setDayEvents] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(`/events/${userId}`)
        setEvents(res.data);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      }
    }
    fetchEvents();
  }, []);

  // Função para alterar o filtro de categoria
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedDate(null);
    setDayEvents([]);
    setShowCard(false);
  };

  // Filtra eventos conforme categoria selecionada
  const filteredEvents = events.filter((event) => {
    if (selectedCategory === 'all') return true;
    // Normaliza strings para comparação segura (remove espaços e case insensitive)
    if (!event.category) return false;
    return event.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
  });

  // Função para lidar com clique no dia do calendário
  const handleDayClick = (date) => {
    setSelectedDate(date);
    const filtered = filteredEvents.filter((event) => {
      const eventDate = new Date(event.datetime);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
    setDayEvents(filtered);
    setShowCard(true);
  };

  // Fecha o card com animação
  const closeCard = () => {
    setShowCard(false);
    setTimeout(() => {
      setSelectedDate(null);
      setDayEvents([]);
    }, 300);
  };

  // DEBUG: Exibe categorias e filtro no console
  // Remova após confirmar funcionamento
  console.log('Categoria selecionada:', selectedCategory);
  console.log(
    'Categorias dos eventos:',
    events.map((e) => e.category),
  );
  console.log('Eventos filtrados:', filteredEvents);

  return (
    <aside className="hidden xl:flex flex-col w-[320px] text-white px-6 py-8 space-y-6 relative">
      <UserProfile />

      <CalendarStyled events={filteredEvents} onDayClick={handleDayClick} />

      {selectedDate && dayEvents.length > 0 && (
        <div
          className={`absolute top-[400px] left-6 w-[270px] bg-[#1f2937] rounded-xl p-4 shadow-lg z-20
            transition-opacity duration-300 ease-in-out
            ${showCard ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-center flex-1">
              Eventos em {selectedDate.toLocaleDateString('pt-BR')}
            </h3>
            <button
              onClick={closeCard}
              className="ml-4 text-gray-400 hover:text-gray-200 transition"
              aria-label="Fechar"
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {dayEvents.map((event) => (
              <li
                key={event.id}
                className="cursor-pointer p-2 rounded hover:bg-blue-600 transition"
                onClick={() => navigate(`/dashboard/events/${event.id}`)}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-300">
                  {new Date(event.datetime).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-[#1f2937] rounded-xl p-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => setShowCalendars(!showCalendars)}
        >
          <span className="text-sm font-medium">Filtros</span>
          {showCalendars ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {showCalendars && (
          <RadioFilterGroup
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </div>

      {/* Legenda */}
      <div className="bg-[#1f2937] rounded-xl p-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => setShowCategories(!showCategories)}
        >
          <span className="text-sm font-medium">Legenda</span>
          {showCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {showCategories && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              Estudos
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Finanças
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Saúde
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              Tarefas
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
