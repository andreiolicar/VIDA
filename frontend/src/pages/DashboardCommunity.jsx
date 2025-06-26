import React, { useState, useEffect, useRef } from 'react';
import api from '@/services/axios';
import { useSocket } from '@/hooks/useSocket';
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

export default function DashboardCommunity() {
  // Estado da aba ativa no menu principal
  const [activeTab, setActiveTab] = useState('amigos');

  // Estados relacionados à funcionalidade de amigos
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [error, setError] = useState(null);

  // Estados para chat privado
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Token e socket
  const token = localStorage.getItem('token');
  const socket = useSocket(token);
  const messagesEndRef = useRef(null);

  // Decodifica o userId do JWT para diferenciar mensagens
  const userId = JSON.parse(atob(token?.split('.')[1] || ''))?.id;

  // Scroll automático ao fim da lista de mensagens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Buscar amigos e solicitações quando o componente for montado
  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, []);

  // Buscar mensagens quando selecionar amigo
  useEffect(() => {
    if (selectedFriend) fetchMessages(selectedFriend.id);
  }, [selectedFriend]);

  // Escuta por mensagens recebidas via socket
  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (msg) => {
      console.log('[SOCKET] Mensagem recebida:', msg);
      if (
        selectedFriend &&
        (msg.fromUserId === selectedFriend.id || msg.toUserId === selectedFriend.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('private message', handlePrivateMessage);
    return () => socket.off('private message', handlePrivateMessage);
  }, [socket, selectedFriend]);

  // Buscar usuários pelo termo de pesquisa
  const handleSearch = async () => {
    if (!search.trim()) return setSearchResults([]);
    setLoadingSearch(true);
    setError(null);
    try {
      const res = await api.get(`/friends/search?q=${encodeURIComponent(search)}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('[SEARCH] Erro:', err);
      setError(err.response?.data?.message || 'Erro ao buscar usuários.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Buscar solicitações pendentes
  const fetchFriendRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await api.get('/friends/requests');
      setFriendRequests(res.data);
    } catch (err) {
      console.error('[REQUESTS] Erro ao carregar solicitações:', err);
      setError('Erro ao carregar solicitações.');
    } finally {
      setLoadingRequests(false);
    }
  };

  // Buscar lista de amigos
  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const res = await api.get('/friends');
      setFriends(res.data);
    } catch (err) {
      console.error('[FRIENDS] Erro ao carregar amigos:', err);
      setError('Erro ao carregar amigos.');
    } finally {
      setLoadingFriends(false);
    }
  };

  // Buscar histórico de mensagens com um amigo
  const fetchMessages = async (friendId) => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/messages/conversation/${friendId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('[FETCH MESSAGES] Erro:', err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Enviar nova mensagem via API + atualizar localmente para resposta imediata
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const payload = { receiverUserId: selectedFriend.id, content: newMessage };
      console.log('[SEND MESSAGE] Enviando mensagem:', payload);
      await api.post('/messages', payload);

      const localMsg = {
        id: Date.now(),
        content: newMessage,
        fromUserId: userId,
        toUserId: selectedFriend.id,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, localMsg]);
      setNewMessage('');
    } catch (err) {
      console.error('[SEND MESSAGE] Erro:', err);
      alert('Erro ao enviar mensagem.');
    }
  };

  // Aceitar solicitação de amizade
  const acceptRequest = async (requestId) => {
    try {
      await api.put(`/friends/requests/${requestId}/accept`);
      alert('Solicitação aceita!');
      fetchFriendRequests();
      fetchFriends();
    } catch (err) {
      console.error('[ACCEPT REQUEST] Erro:', err);
      setError(err.response?.data?.error || 'Erro ao aceitar solicitação.');
    }
  };

  // Recusar solicitação
  const rejectRequest = async (requestId) => {
    try {
      await api.put(`/friends/requests/${requestId}/reject`);
      alert('Solicitação recusada!');
      fetchFriendRequests();
    } catch (err) {
      console.error('[REJECT REQUEST] Erro:', err);
      setError(err.response?.data?.error || 'Erro ao recusar solicitação.');
    }
  };

  // Enviar nova solicitação de amizade
  const sendFriendRequest = async (receiverUserId) => {
    try {
      await api.post('/friends/requests', { receiverUserId });
      alert('Solicitação enviada com sucesso!');
      setSearch('');
      setSearchResults([]);
    } catch (err) {
      console.error('[SEND REQUEST] Erro:', err);
      setError(err.response?.data?.error || 'Erro ao enviar solicitação.');
    }
  };

  // Menu principal de navegação
  const menuItems = [
    { key: 'amigos', icon: Users, label: 'Amigos' },
    { key: 'mensagens', icon: MessageSquare, label: 'Mensagens' },
    { key: 'grupos', icon: Users2, label: 'Grupos' },
    { key: 'conteudo', icon: FileText, label: 'Conteúdos' },
    { key: 'notificacoes', icon: Bell, label: 'Notificações' },
    { key: 'eventos', icon: Calendar, label: 'Eventos' },
    { key: 'reputacao', icon: Star, label: 'Reputação' },
  ];

  // ==========================
  // PARTE 2 — UI (DENTRO DO RETURN)
  // ==========================

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col px-4 sm:px-8 md:px-12 py-6 sm:py-8 overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-4">Comunidade VIDA</h1>

        {/* Navegação principal */}
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

        <div>
          {/* Seção de Amigos */}
          {activeTab === 'amigos' && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Amigos</h2>

              {error && (
                <div className="bg-red-700 text-red-200 p-3 rounded mb-6" role="alert">
                  {error}
                </div>
              )}

              {/* Campo de busca de usuários */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <input
                  type="text"
                  className="flex-grow px-5 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Buscar por nome ou email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={loadingSearch}
                />
                <button
                  onClick={handleSearch}
                  disabled={loadingSearch}
                  className="bg-blue-600 px-6 py-3 rounded-xl font-semibold transition shadow-blue-900/40 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        >
                          Enviar Solicitação
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Solicitações pendentes */}
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
                          >
                            Aceitar
                          </button>
                          <button
                            onClick={() => rejectRequest(req.id)}
                            className="bg-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-red-900/50"
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

          {/* Seção de Mensagens Privadas */}
          {activeTab === 'mensagens' && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Mensagens Privadas</h2>
              <div className="flex gap-8">
                {/* Lista de amigos para conversar */}
                <div className="w-1/4 min-w-[180px]">
                  <h3 className="font-semibold mb-3">Seus amigos</h3>
                  <ul>
                    {friends.map((friend) => (
                      <li
                        key={friend.id}
                        className={`cursor-pointer p-2 rounded-lg mb-2 transition ${selectedFriend?.id === friend.id ? 'bg-blue-700 text-white' : 'hover:bg-blue-900'}`}
                        onClick={() => setSelectedFriend(friend)}
                      >
                        {friend.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Área de conversa */}
                <div className="flex-1 flex flex-col bg-[#1f2937] rounded-2xl p-6 min-h-[400px]">
                  {selectedFriend ? (
                    <>
                      <div className="border-b border-gray-700 pb-2 mb-4">
                        <h4 className="font-semibold text-lg">{selectedFriend.name}</h4>
                      </div>

                      <div className="flex-1 overflow-y-auto mb-4" style={{ maxHeight: 350 }}>
                        {loadingMessages ? (
                          <p className="text-gray-400 italic">Carregando...</p>
                        ) : messages.length === 0 ? (
                          <p className="text-gray-400 italic">Nenhuma mensagem ainda.</p>
                        ) : (
                          <ul className="space-y-2">
                            {messages.map((msg, idx) => {
                              const isOwn = msg.fromUserId === userId;
                              return (
                                <li
                                  key={msg.id || idx}
                                  className={`p-3 rounded-xl max-w-[70%] whitespace-pre-line text-sm ${isOwn
                                    ? 'bg-blue-600 text-right self-end text-white'
                                    : 'bg-gray-700 text-left self-start text-white'
                                    }`}
                                  style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start' }}
                                >
                                  {msg.content}
                                  <span className="block text-xs text-gray-300 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </li>
                              );
                            })}
                            <div ref={messagesEndRef} />
                          </ul>
                        )}
                      </div>

                      {/* Campo de envio de mensagem */}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none"
                          placeholder="Digite sua mensagem..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          disabled={loadingMessages}
                        />
                        <button
                          onClick={sendMessage}
                          className="bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                          disabled={loadingMessages || !newMessage.trim()}
                        >
                          Enviar
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 italic flex-1 flex items-center justify-center">
                      Selecione um amigo para começar a conversar.
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <DashboardRightPanel />
    </div>
  );

}