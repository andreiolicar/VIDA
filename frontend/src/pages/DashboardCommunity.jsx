import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import {
  Users,
  MessageSquare,
  Users2,
  Share2,
  Bell,
  Calendar,
  Star,
  FileText,
} from 'lucide-react';
import api from '@/services/axios';

export default function DashboardCommunity() {
  const [activeTab, setActiveTab] = useState('amigos');

  // Estados para funcionalidade Amigos
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  // Estados para loading e erros
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [error, setError] = useState(null);

  // Buscar usuários pelo backend conforme termo de busca
  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);
    setError(null);
    try {
      const res = await api.get(`/friends/search?q=${encodeURIComponent(search)}`);
      setSearchResults(res.data); // Array de usuários: {id, name, email}
    } catch (err) {
      // Log detalhado para diagnóstico (retirar depois)
      if (err.response) {
        // O servidor respondeu com um status fora do intervalo 2xx
        console.error('Erro na resposta do servidor:', err.response.data);
        console.error('Status:', err.response.status);
        console.error('Headers:', err.response.headers);
        setError(`Erro ${err.response.status}: ${err.response.data?.message || 'Erro ao buscar usuários.'}`);
      } else if (err.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Nenhuma resposta do servidor:', err.request);
        setError('Nenhuma resposta do servidor. Verifique sua conexão.');
      } else {
        // Erro ao configurar a requisição
        console.error('Erro na requisição:', err.message);
        setError(`Erro na requisição: ${err.message}`);
      }
    }
    finally {
      setLoadingSearch(false);
    }
  };

  // Buscar solicitações pendentes recebidas
  const fetchFriendRequests = async () => {
    setLoadingRequests(true);
    setError(null);
    try {
      const res = await api.get('/friends/requests');
      setFriendRequests(res.data); // Array de solicitações pendentes
    } catch (err) {
      setError('Erro ao carregar solicitações.');
    } finally {
      setLoadingRequests(false);
    }
  };

  // Buscar lista de amigos confirmados
  const fetchFriends = async () => {
    setLoadingFriends(true);
    setError(null);
    try {
      const res = await api.get('/friends');
      setFriends(res.data); // Array de amigos
    } catch (err) {
      setError('Erro ao carregar amigos.');
    } finally {
      setLoadingFriends(false);
    }
  };

  // Carregar solicitações e amigos ao montar componente
  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, []);

  // Enviar solicitação de amizade para usuário pelo id
  const sendFriendRequest = async (receiverUserId) => {
    setError(null);
    try {
      await api.post('/friends/requests', { receiverUserId });
      alert('Solicitação enviada com sucesso!');
      setSearch('');
      setSearchResults([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar solicitação.');
    }
  };

  // Aceitar solicitação pelo id da requisição
  const acceptRequest = async (requestId) => {
    setError(null);
    try {
      await api.put(`/friends/requests/${requestId}/accept`);
      alert('Solicitação aceita!');
      fetchFriendRequests();
      fetchFriends();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao aceitar solicitação.');
    }
  };

  // Recusar solicitação pelo id da requisição
  const rejectRequest = async (requestId) => {
    setError(null);
    try {
      await api.put(`/friends/requests/${requestId}/reject`);
      alert('Solicitação recusada!');
      fetchFriendRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao recusar solicitação.');
    }
  };

  // Menu principal da comunidade com ícones e labels
  const menuItems = [
    { key: 'amigos', icon: Users, label: 'Amigos' },
    { key: 'mensagens', icon: MessageSquare, label: 'Mensagens' },
    { key: 'grupos', icon: Users2, label: 'Grupos' },
    { key: 'conteudo', icon: FileText, label: 'Conteúdos' },
    { key: 'notificacoes', icon: Bell, label: 'Notificações' },
    { key: 'eventos', icon: Calendar, label: 'Eventos' },
    { key: 'reputacao', icon: Star, label: 'Reputação' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col px-4 sm:px-8 md:px-12 py-6 sm:py-8 overflow-y-auto">
        {/* Título */}
        <h1 className="text-3xl font-extrabold mb-4">Comunidade VIDA</h1>

        {/* Navbar responsiva */}
        <nav className="flex w-full mb-10 border-b border-gray-700 pb-4 justify-between">
          {menuItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition text-center min-w-[110px] max-w-[160px] ${activeTab === key
                ? 'bg-blue-700 text-white shadow-blue-900/50'
                : 'text-gray-400 hover:text-white hover:bg-blue-900'
                }`}
              aria-current={activeTab === key ? 'page' : undefined}
              type="button"
            >
              <Icon size={16} />
              <span className="hidden sm:inline truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* Conteúdo dinâmico */}
        <div>
          {activeTab === 'amigos' && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Amigos</h2>

              {/* Mensagem de erro geral */}
              {error && (
                <div className="bg-red-700 text-red-200 p-3 rounded mb-6" role="alert">
                  {error}
                </div>
              )}

              {/* Busca de usuários */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <input
                  type="text"
                  className="flex-grow px-5 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Buscar por nome ou email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={loadingSearch}
                  aria-label="Buscar usuários por nome ou email"
                />
                <button
                  onClick={handleSearch}
                  disabled={loadingSearch}
                  className="bg-blue-600 px-6 py-3 rounded-xl font-semibold transition shadow-blue-900/40 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Buscar usuários"
                >
                  {loadingSearch ? 'Buscando...' : 'Buscar'}
                </button>
              </div>

              {/* Resultados da busca */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4">Resultados da busca</h3>
                {loadingSearch ? (
                  <p className="text-gray-400 italic">Carregando...</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-gray-400 italic">Nenhum usuário encontrado.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="bg-[#1f2937] rounded-2xl p-6 shadow-blue-700/50 transition cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="text-lg font-semibold mb-1 truncate">{user.name}</h4>
                          <p className="text-sm text-gray-400 mb-4 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => sendFriendRequest(user.id)}
                          className="self-start bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-green-900/60"
                          aria-label={`Enviar solicitação para ${user.name}`}
                        >
                          Enviar Solicitação
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Solicitações recebidas */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4">Solicitações Recebidas</h3>
                {loadingRequests ? (
                  <p className="text-gray-400 italic">Carregando...</p>
                ) : friendRequests.length === 0 ? (
                  <p className="text-gray-400 italic">Nenhuma solicitação pendente.</p>
                ) : (
                  <div className="space-y-6">
                    {friendRequests.map((req) => (
                      <div key={req.id} className="bg-[#1f2937] rounded-2xl p-5 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold truncate">{req.requester?.name || 'Usuário desconhecido'}</p>
                          <p className="text-gray-400 text-sm truncate">{req.requester?.email || ''}</p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => acceptRequest(req.id)}
                            className="bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-blue-900/50"
                            aria-label={`Aceitar solicitação de ${req.requester?.name}`}
                          >
                            Aceitar
                          </button>
                          <button
                            onClick={() => rejectRequest(req.id)}
                            className="bg-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-red-900/50"
                            aria-label={`Recusar solicitação de ${req.requester?.name}`}
                          >
                            Recusar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lista de amigos */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Seus Amigos</h3>
                {loadingFriends ? (
                  <p className="text-gray-400 italic">Carregando...</p>
                ) : friends.length === 0 ? (
                  <p className="text-gray-400 italic">Você ainda não tem amigos.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="bg-[#1f2937] rounded-3xl p-6 shadow-blue-700/80 flex flex-col items-center text-center cursor-pointer transition"
                        aria-label={`Perfil do amigo ${friend.name}`}
                      >
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 select-none">
                          {friend.name.charAt(0)}
                        </div>
                        <p className="font-semibold text-lg truncate">{friend.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab !== 'amigos' && (
            <section className="text-gray-400 italic text-lg">
              Funcionalidade <span className="font-semibold">{activeTab}</span> em desenvolvimento...
            </section>
          )}
        </div>
      </div>

      <DashboardRightPanel />
    </div>
  );
}