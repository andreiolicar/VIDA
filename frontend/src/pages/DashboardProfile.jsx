import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from '../services/axios';

export default function DashboardProfile() {
  const userId = localStorage.getItem('user');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/get/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.data;

        if (!data.user) throw new Error(data.message || 'Erro ao buscar dados.');

        setForm({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
        });

        setLoading(false);
      } catch (error) {
        console.error('[PERFIL] Erro ao carregar perfil:', error);
        setMessage('Erro ao carregar perfil');
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/update/${userId}`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.data;
      console.log(data);
      if (!res.ok) throw new Error(data.message);
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      setMessage(error.message || 'Erro ao atualizar');
    }
  };

  if (loading) return <p className="text-white">Carregando...</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col px-12 py-8">
        <div className="flex items-start justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition text-sm mt-1"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <div className="ml-auto"></div>
        </div>

        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold mb-4">Editar Perfil</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              maxLength={20}
              value={form.name || ''}
              onChange={handleChange}
              placeholder="Nome"
              className="w-full p-3 rounded bg-white/10 border border-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded bg-white/10 border border-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="phone"
              value={form.phone || ''}
              onChange={handleChange}
              placeholder="Telefone"
              className="w-full p-3 rounded bg-white/10 border border-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 px-4 rounded"
            >
              Salvar alterações
            </button>

            {message && <p className="text-sm text-center mt-2">{message}</p>}
          </form>
        </div>
      </div>
      <DashboardRightPanel />
    </div>
  );
}
