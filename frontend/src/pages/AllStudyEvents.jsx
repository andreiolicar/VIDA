import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import { Calendar } from 'lucide-react';

export default function AllStudyEvents() {
  const userId = localStorage.getItem('user');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`/events/${userId}`).then((r) => setEvents(r.data));
  }, [userId]);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Todos os Eventos</h1>
          <Link
            to="/dashboard/study"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            ← voltar
          </Link>
        </header>

        {events.length === 0 ? (
          <p className="text-gray-400">Nenhum evento encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="rounded-lg border border-gray-700 bg-gray-800 p-6 hover:border-gray-600"
              >
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(ev.datetime).toLocaleString('pt-BR')}
                </div>
                <h2 className="text-lg font-semibold text-white">{ev.title}</h2>
                <p className="text-gray-400">{ev.description}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}