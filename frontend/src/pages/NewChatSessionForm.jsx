import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';

export default function NewChatSessionForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !area.trim() || !description.trim() || !topics.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    const topicsArray = topics.split(',').map(t => t.trim()).filter(Boolean);
    if (topicsArray.length === 0) {
      setError('Adicione ao menos um tópico.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        '/chat-sessions',
        { title, area, description, topics: topicsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/dashboard/chatbot/${res.data.route?.id || res.data.id}`);
    } catch (err) {
      console.error('Erro ao criar sessão:', err);
      setError('Erro ao criar sessão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1f2937] rounded-xl p-6 sm:p-10 shadow-xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2">
              {/* Ícone opcional */}
              Nova Sessão de Chat
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div>
                <label className="block text-sm mb-1">Título</label>
                <input
                  type="text"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Planejamento de Estudos"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Área</label>
                <input
                  type="text"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex: Educação, Saúde, Finanças..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Descrição</label>
                <textarea
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all resize-none"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o objetivo da sessão"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Tópicos (separados por vírgula)</label>
                <input
                  type="text"
                  className="w-full bg-[#111827] text-white rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="Ex: React, Node.js, IA"
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Sessão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <DashboardRightPanel />
    </div>
  );
}