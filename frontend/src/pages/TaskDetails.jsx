import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buscar dados da tarefa pelo id
  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar tarefa:', err);
      setError('Erro ao carregar a tarefa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  if (loading) return <p className="p-8 text-white">Carregando...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;
  if (!task) return <p className="p-8 text-gray-400">Tarefa não encontrada.</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">{task.title}</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
          >
            Voltar
          </button>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Descrição</h2>
          <p className="whitespace-pre-wrap text-gray-300">{task.description || 'Sem descrição'}</p>
        </section>

        <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">Prioridade</h3>
            <p className="text-gray-300 capitalize">{task.priority || 'Não definida'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Status</h3>
            <p className="text-gray-300 capitalize">{task.status?.replace('_', ' ') || 'Não definido'}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Data de criação</h3>
            <p className="text-gray-300">{new Date(task.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1">Última atualização</h3>
            <p className="text-gray-300">{new Date(task.updatedAt).toLocaleString()}</p>
          </div>
        </section>

        {/* Aqui você pode adicionar botões para editar, excluir, etc */}
      </main>

      <DashboardRightPanel />
    </div>
  );
}
