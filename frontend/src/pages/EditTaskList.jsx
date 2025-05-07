import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';

export default function EditTaskList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [title, setTitle] = useState('');
  const [type, setType] = useState('mercado');
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const LIST_TYPES = [
    { value: 'mercado', label: 'Mercado' },
    { value: 'projeto', label: 'Projeto' },
    { value: 'doméstica', label: 'Doméstica' },
  ];

  useEffect(() => {
    async function fetchList() {
      try {
        setLoading(true);
        const res = await axios.get(`/task-lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data;
        setTitle(list.title || '');
        setType(list.type || 'mercado');
        setDescription(list.description || '');
        setFavorite(!!list.favorite);
        setError('');
      } catch (err) {
        setError('Erro ao carregar a lista.');
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Título é obrigatório.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await axios.patch(
        `/task-lists/${id}`,
        {
          title: title.trim(),
          type,
          description: description.trim() || null,
          favorite,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/dashboard/task-list/${id}`);
    } catch (err) {
      setError('Erro ao salvar a lista.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-white">Carregando...</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Editar Lista</h1>
          <Link
            to={`/dashboard/task-list/${id}`}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
          >
            Voltar
          </Link>
        </div>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="block mb-1 font-medium">Título </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Tipo </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
              required
            >
              {LIST_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded px-3 py-2 bg-[#111827] text-white outline-none focus:ring-2 ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="favorite"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="favorite" className="select-none">
              Marcar como favorita
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </main>

      <DashboardRightPanel />
    </div>
  );
}
