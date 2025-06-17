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

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !area.trim() || !description.trim() || !topics.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    const topicsArray = topics.split(',').map((t) => t.trim()).filter(Boolean);
    if (topicsArray.length === 0) {
      alert('Adicione ao menos um tópico.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        '/chat-sessions',
        { title, area, description, topics: topicsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/dashboard/chatbot/${res.data.route?.id || res.data.id}`);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      alert('Erro ao criar sessão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      {/* Área principal alinhada à esquerda, com padding e overflow */}
      <main className="flex flex-1 flex-col px-12 py-8 overflow-y-auto max-w-full">
        <h1 className="text-3xl font-semibold mb-8">Nova Sessão de Chat</h1>

        {/* Formulário com largura máxima e alinhamento à esquerda */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-[#1f2937] p-8 rounded-xl shadow-lg max-w-4xl w-full"
        >
          <div>
            <label htmlFor="title" className="block mb-2 font-medium text-white">
              Título
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-md p-3 bg-[#111827] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Planejamento de Estudos"
              required
            />
          </div>

          <div>
            <label htmlFor="area" className="block mb-2 font-medium text-white">
              Área
            </label>
            <input
              id="area"
              type="text"
              className="w-full rounded-md p-3 bg-[#111827] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ex: Educação, Saúde, Finanças..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-medium text-white">
              Descrição
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full rounded-md p-3 bg-[#111827] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o objetivo da sessão"
              required
            />
          </div>

          <div>
            <label htmlFor="topics" className="block mb-2 font-medium text-white">
              Tópicos (separados por vírgula)
            </label>
            <input
              id="topics"
              type="text"
              className="w-full rounded-md p-3 bg-[#111827] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Ex: React, Node.js, IA"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Sessão'}
          </button>
        </form>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
