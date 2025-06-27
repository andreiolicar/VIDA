import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import '@/components/scrollbar.css';

export default function DashboardCommunity() {
  // ===== ESTADOS =====
  // Estado da aba ativa no menu principal
  const [activeTab, setActiveTab] = useState('amigos');

  // Estados relacionados à funcionalidade de amigos
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  // Estados de loading
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Estados de erro
  const [error, setError] = useState(null);

  // Estados para chat privado
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // ===== REFS =====
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ===== CONSTANTES =====
  const token = localStorage.getItem('token');
  const socket = useSocket(token);

  // Decodifica o userId do JWT
  const currentUserId = useMemo(() => {
    try {
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }, [token]);

  // Menu principal de navegação
  const menuItems = useMemo(() => [
    { key: 'amigos', icon: Users, label: 'Amigos' },
    { key: 'mensagens', icon: MessageSquare, label: 'Mensagens' },
    { key: 'grupos', icon: Users2, label: 'Grupos' },
    { key: 'conteudo', icon: FileText, label: 'Conteúdos' },
    { key: 'notificacoes', icon: Bell, label: 'Notificações' },
    { key: 'eventos', icon: Calendar, label: 'Eventos' },
    { key: 'reputacao', icon: Star, label: 'Reputação' },
  ], []);

  // ===== FUNÇÕES DE UTILIDADE =====
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const showError = useCallback((message) => {
    setError(message);
    setTimeout(clearError, 5000); // Remove erro após 5 segundos
  }, [clearError]);

  // ===== FUNÇÕES DE API =====
  // Buscar usuários pelo termo de pesquisa
  const handleSearch = useCallback(async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    clearError();

    try {
      const response = await api.get(`/friends/search?q=${encodeURIComponent(search.trim())}`);
      setSearchResults(response.data || []);
    } catch (err) {
      console.error('[SEARCH] Erro:', err);
      showError(err.response?.data?.message || 'Erro ao buscar usuários.');
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [search, clearError, showError]);

  // Buscar solicitações pendentes
  const fetchFriendRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const response = await api.get('/friends/requests');
      setFriendRequests(response.data || []);
    } catch (err) {
      console.error('[REQUESTS] Erro ao carregar solicitações:', err);
      showError('Erro ao carregar solicitações.');
    } finally {
      setLoadingRequests(false);
    }
  }, [showError]);

  // Buscar lista de amigos
  const fetchFriends = useCallback(async () => {
    setLoadingFriends(true);
    try {
      const response = await api.get('/friends');
      setFriends(response.data || []);
    } catch (err) {
      console.error('[FRIENDS] Erro ao carregar amigos:', err);
      showError('Erro ao carregar amigos.');
    } finally {
      setLoadingFriends(false);
    }
  }, [showError]);

  // Buscar histórico de mensagens com um amigo - CORRIGIDO
  const fetchMessages = useCallback(async (friendId) => {
    if (!friendId || !currentUserId) return;

    setLoadingMessages(true);
    try {
      const response = await api.get(`/messages/conversation/${friendId}`);
      const messagesData = response.data || [];

      // Garantir que as mensagens tenham a estrutura correta
      const formattedMessages = messagesData.map(msg => ({
        ...msg,
        fromUserId: msg.senderUserId || msg.fromUserId,
        toUserId: msg.receiverUserId || msg.toUserId,
        timestamp: msg.timestamp || msg.createdAt,
      }));

      setMessages(formattedMessages);

      // Scroll para o final após carregar mensagens
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('[FETCH MESSAGES] Erro:', err);
      showError('Erro ao carregar mensagens.');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [currentUserId, scrollToBottom, showError]);

  // Enviar nova mensagem
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedFriend || !currentUserId || sendingMessage) {
      return;
    }

    const messageContent = newMessage.trim();
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      fromUserId: currentUserId,
      toUserId: selectedFriend.id,
      timestamp: new Date().toISOString(),
      read: false,
      sending: true, // Flag para indicar que está enviando
    };

    // Adicionar mensagem temporariamente para feedback imediato
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setSendingMessage(true);

    try {
      const payload = {
        receiverUserId: selectedFriend.id,
        content: messageContent
      };

      const response = await api.post('/messages', payload);

      // Substituir mensagem temporária pela real
      setMessages(prev => prev.map(msg =>
        msg.id === tempMessage.id
          ? { ...response.data, fromUserId: response.data.senderUserId }
          : msg
      ));

      scrollToBottom();
    } catch (err) {
      console.error('[SEND MESSAGE] Erro:', err);
      showError('Erro ao enviar mensagem.');

      // Remover mensagem temporária em caso de erro
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(messageContent); // Restaurar o texto
    } finally {
      setSendingMessage(false);
    }
  }, [newMessage, selectedFriend, currentUserId, sendingMessage, scrollToBottom, showError]);

  // Aceitar solicitação de amizade
  const acceptRequest = useCallback(async (requestId) => {
    try {
      await api.put(`/friends/requests/${requestId}/accept`);
      alert('Solicitação aceita!');
      await Promise.all([fetchFriendRequests(), fetchFriends()]);
    } catch (err) {
      console.error('[ACCEPT REQUEST] Erro:', err);
      showError(err.response?.data?.error || 'Erro ao aceitar solicitação.');
    }
  }, [fetchFriendRequests, fetchFriends, showError]);

  // Recusar solicitação
  const rejectRequest = useCallback(async (requestId) => {
    try {
      await api.put(`/friends/requests/${requestId}/reject`);
      alert('Solicitação recusada!');
      await fetchFriendRequests();
    } catch (err) {
      console.error('[REJECT REQUEST] Erro:', err);
      showError(err.response?.data?.error || 'Erro ao recusar solicitação.');
    }
  }, [fetchFriendRequests, showError]);

  // Enviar nova solicitação de amizade
  const sendFriendRequest = useCallback(async (receiverUserId) => {
    try {
      await api.post('/friends/requests', { receiverUserId });
      alert('Solicitação enviada com sucesso!');
      setSearch('');
      setSearchResults([]);
    } catch (err) {
      console.error('[SEND REQUEST] Erro:', err);
      showError(err.response?.data?.error || 'Erro ao enviar solicitação.');
    }
  }, [showError]);

  // ===== EFFECTS =====
  // Scroll automático ao fim da lista de mensagens
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Buscar amigos e solicitações quando o componente for montado
  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, [fetchFriendRequests, fetchFriends]);

  // Buscar mensagens quando selecionar amigo
  useEffect(() => {
    if (selectedFriend?.id) {
      fetchMessages(selectedFriend.id);
    } else {
      setMessages([]);
    }
  }, [selectedFriend?.id, fetchMessages]);

  // Escuta por mensagens recebidas via socket - CORRIGIDO
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handlePrivateMessage = (msg) => {
      console.log('[SOCKET] Mensagem recebida:', msg);

      // Verificar se a mensagem é para a conversa atual
      const isForCurrentConversation = selectedFriend && (
        (msg.fromUserId === selectedFriend.id && msg.toUserId === currentUserId) ||
        (msg.fromUserId === currentUserId && msg.toUserId === selectedFriend.id)
      );

      if (isForCurrentConversation) {
        setMessages(prev => {
          // Evitar duplicação de mensagens
          const messageExists = prev.some(existingMsg => existingMsg.id === msg.id);
          if (messageExists) return prev;

          return [...prev, {
            ...msg,
            fromUserId: msg.fromUserId || msg.senderUserId,
            toUserId: msg.toUserId || msg.receiverUserId,
          }];
        });
      }
    };

    socket.on('private message', handlePrivateMessage);

    return () => {
      socket.off('private message', handlePrivateMessage);
    };
  }, [socket, selectedFriend, currentUserId]);

  // Handler para Enter na busca
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Handler para Enter no envio de mensagem
  const handleMessageKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col px-4 sm:px-8 md:px-12 py-6 sm:py-8 overflow-hidden">
        <h1 className="text-3xl font-extrabold mb-4">Comunidade VIDA</h1>

        {/* Exibir erro se houver */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200">
            <p>{error}</p>
          </div>
        )}

        {/* Navegação principal */}
        <nav className="flex w-full mb-6 border-b border-gray-700 pb-4 justify-between">
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

        {/* Conteúdo principal com scroll */}
        <div className="flex-1 overflow-hidden">
          {/* Seção de Amigos */}
          {activeTab === 'amigos' && (
            <section className="h-full overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold mb-6">Amigos</h2>

              {/* Busca de usuários */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <input
                  type="text"
                  className="flex-grow px-5 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Buscar por nome ou email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
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
              {searchResults.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-4">Resultados da busca</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="bg-[#1f2937] rounded-2xl p-6 shadow-blue-700/50 transition hover:shadow-blue-700/70 flex flex-col justify-between"
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
                </div>
              )}

              {/* Solicitações pendentes */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4">Solicitações Recebidas</h3>
                {loadingRequests ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-400">Carregando...</span>
                  </div>
                ) : friendRequests.length === 0 ? (
                  <p className="text-gray-400 italic">Nenhuma solicitação pendente.</p>
                ) : (
                  <div className="space-y-6">
                    {friendRequests.map((req) => (
                      <div key={req.id} className="bg-[#1f2937] rounded-2xl p-5 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-semibold truncate">{req.requester?.name || 'Usuário desconhecido'}</p>
                          <p className="text-gray-400 text-sm truncate">{req.requester?.email || ''}</p>
                        </div>
                        <div className="flex gap-4 ml-4">
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
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-400">Carregando...</span>
                  </div>
                ) : friends.length === 0 ? (
                  <p className="text-gray-400 italic">Você ainda não tem amigos.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="bg-[#1f2937] rounded-3xl p-6 shadow-blue-700/80 hover:shadow-blue-700/100 flex flex-col items-center text-center cursor-pointer transition transform"
                      >
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 select-none">
                          {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-lg truncate max-w-full">{friend.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Seção de Mensagens Privadas - CORRIGIDA */}
          {activeTab === 'mensagens' && (
            <section className="h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-6">Mensagens Privadas</h2>

              <div className="flex-1 flex gap-6 md:gap-8 min-h-0">
                {/* Lista de amigos - Sidebar */}
                <aside className="w-1/4 min-w-[180px] max-w-[250px] flex flex-col">
                  <h3 className="font-semibold mb-3 text-gray-300">Seus amigos</h3>
                  <div className="flex-1 overflow-y-auto pr-2">
                    {loadingFriends ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : friends.length === 0 ? (
                      <p className="text-gray-400 text-sm italic">Nenhum amigo encontrado.</p>
                    ) : (
                      <ul className="space-y-2">
                        {friends.map((friend) => (
                          <li
                            key={friend.id}
                            className={`cursor-pointer px-3 py-3 rounded-lg transition-all duration-200 ${selectedFriend?.id === friend.id
                                ? 'bg-blue-700 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-blue-900/50 hover:text-white'
                              }`}
                            onClick={() => setSelectedFriend(friend)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                {friend.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="truncate font-medium">{friend.name}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </aside>

                {/* Área de chat - CORRIGIDA com scroll */}
                <main className="flex-1 flex flex-col bg-[#1e293b] rounded-2xl shadow-xl min-h-0">
                  {selectedFriend ? (
                    <>
                      {/* Cabeçalho do chat */}
                      <header className="border-b border-gray-700 p-6 bg-[#1a2332] rounded-t-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold">
                            {selectedFriend.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-white">{selectedFriend.name}</h4>
                            <p className="text-sm text-gray-400">Online</p>
                          </div>
                        </div>
                      </header>

                      {/* Lista de mensagens - CORRIGIDA com scroll */}
                      <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 scrollbar-dark scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent"
                        style={{ maxHeight: 'calc(100vh - 400px)' }}
                      >
                        {loadingMessages ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-400">Carregando mensagens...</span>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="flex items-center justify-center py-8">
                            <p className="text-gray-400 italic">Nenhuma mensagem ainda. Comece a conversa!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((msg, idx) => {
                              const isOwn = msg.fromUserId === currentUserId;
                              const isConsecutive = idx > 0 && messages[idx - 1].fromUserId === msg.fromUserId;

                              return (
                                <div
                                  key={msg.id || idx}
                                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'
                                    }`}
                                >
                                  <div
                                    className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${isOwn
                                        ? 'bg-blue-600 text-white rounded-br-md'
                                        : 'bg-gray-700 text-white rounded-bl-md'
                                      } ${msg.sending ? 'opacity-70' : ''}`}
                                  >
                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                    <div className={`flex items-center justify-between mt-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                      <span className="text-xs text-gray-300">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </span>
                                      {msg.sending && (
                                        <span className="text-xs text-gray-300 ml-2">Enviando...</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div ref={messagesEndRef} />
                          </div>
                        )}
                      </div>

                      {/* Campo de entrada de mensagem */}
                      <footer className="border-t border-gray-700 p-6 bg-[#1a2332] rounded-b-2xl">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Digite sua mensagem..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleMessageKeyDown}
                            disabled={loadingMessages || sendingMessage}
                          />
                          <button
                            onClick={sendMessage}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loadingMessages || sendingMessage || !newMessage.trim()}
                          >
                            {sendingMessage ? 'Enviando...' : 'Enviar'}
                          </button>
                        </div>
                      </footer>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare size={64} className="text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 italic text-lg">
                          Selecione um amigo para começar a conversar
                        </p>
                      </div>
                    </div>
                  )}
                </main>
              </div>
            </section>
          )}

          {/* Outras seções placeholder */}
          {!['amigos', 'mensagens'].includes(activeTab) && (
            <section className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🚧</div>
                <p className="text-xl text-gray-400">Seção em desenvolvimento</p>
                <p className="text-gray-500 mt-2">
                  A seção "{menuItems.find(item => item.key === activeTab)?.label}" será implementada em breve.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <DashboardRightPanel />
    </div>
  );
}