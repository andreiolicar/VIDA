import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowLeft, Search, Users, CheckCheck, AlertCircle, X, Smile, Send } from 'lucide-react';
import { useMessages } from '@/hooks/community/useMessages';
import '@/components/scrollbar.css';

export default function MessagesSection() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    selectedFriend,
    setSelectedFriend,
    messages,
    newMessage,
    setNewMessage,
    friends,
    loadingMessages,
    loadingFriends,
    sendingMessage,
    error,
    currentUserId,
    messagesEndRef,
    messagesContainerRef,
    sendMessage,
    handleMessageKeyDown,
    clearError,
  } = useMessages();

  // Fechar emoji picker ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Emojis básicos
  const emojis = ['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯'];

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Função para obter as iniciais do nome
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Função para gerar cor baseada no ID (tons de azul)
  const getAvatarColor = (userId) => {
    if (userId === currentUserId) {
      return 'bg-blue-600';
    }

    const colors = [
      'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-indigo-500',
      'bg-indigo-600', 'bg-sky-500', 'bg-sky-600', 'bg-cyan-500'
    ];

    const index = userId % colors.length;
    return colors[index];
  };

  return (
    <section className="flex flex-col h-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mensagens Privadas</h2>
      </header>

      {/* Notificações de erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-sm underline hover:no-underline ml-4">
            Fechar
          </button>
        </div>
      )}

      {/* Layout principal */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Lista de amigos - Estilo igual ao de grupos */}
        <aside className="w-1/4 flex flex-col">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Seus Amigos</h3>

          {loadingFriends && (
            <p className="text-gray-400 italic px-3">Carregando amigos...</p>
          )}

          <ul className="space-y-1 flex-1 overflow-y-auto scrollbar-dark scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
            {friends.length === 0 && !loadingFriends && (
              <p className="text-gray-400 italic px-3 py-2">Nenhum amigo encontrado.</p>
            )}

            {friends.map((friend) => (
              <li
                key={friend.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition ${selectedFriend?.id === friend.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                onClick={() => setSelectedFriend(friend)}
              >
                <div className={`rounded-full w-10 h-10 flex items-center justify-center mr-3 ${selectedFriend?.id === friend.id
                    ? 'bg-blue-500'
                    : 'bg-blue-600'
                  }`}>
                  <MessageSquare size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">
                    {friend.name}
                  </h4>
                  <p className={`text-sm mt-1 truncate ${selectedFriend?.id === friend.id
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {friend.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Container de chat - Estilo igual ao de grupos */}
        <main className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {selectedFriend ? (
            <>
              {/* Header do chat */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center">
                  <button
                    onClick={() => setSelectedFriend(null)}
                    className="mr-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition md:hidden"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedFriend.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedFriend.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <Search size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Container de mensagens */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 scrollbar-dark scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent"
                style={{
                  height: 'calc(100vh - 280px)',
                  maxHeight: 'calc(100vh - 280px)',
                  minHeight: '300px'
                }}
              >
                {loadingMessages ? (
                  <p className="text-gray-400 italic text-center py-4">Carregando mensagens...</p>
                ) : messages.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-4">
                    Nenhuma mensagem ainda. Comece a conversa!
                  </p>
                ) : (
                  messages.map((msg, idx) => {
                    const isOwn = msg.fromUserId === currentUserId;
                    const isConsecutive = idx > 0 && messages[idx - 1].fromUserId === msg.fromUserId;
                    const showAvatar = !isConsecutive || idx === messages.length - 1;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'
                          }`}
                      >
                        {/* Avatar para mensagens de outros usuários */}
                        {!isOwn && (
                          <div className="flex flex-col items-center mr-2">
                            {showAvatar ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(msg.fromUserId)}`}>
                                {getInitials(selectedFriend.name)}
                              </div>
                            ) : (
                              <div className="w-8 h-8"></div>
                            )}
                          </div>
                        )}

                        <div className={`max-w-[70%] ${isOwn ? 'ml-auto' : ''}`}>
                          {/* Nome do remetente */}
                          {!isOwn && !isConsecutive && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">
                              {selectedFriend.name}
                            </p>
                          )}

                          <div
                            className={`p-3 rounded-lg shadow-sm break-words whitespace-pre-wrap ${isOwn
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-gray-700 text-white rounded-bl-md'
                              }`}
                          >
                            <p>{msg.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-300">
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {isOwn && (
                                <div className="flex items-center space-x-1">
                                  {msg.sending ? (
                                    <div className="flex space-x-1">
                                      <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
                                      <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                      <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                  ) : (
                                    <CheckCheck size={14} className="text-blue-200" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Espaço para avatar nas mensagens próprias */}
                        {isOwn && (
                          <div className="w-8 ml-2"></div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de mensagem */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2 relative">
                  <textarea
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleMessageKeyDown}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                    style={{
                      height: '44px',
                      minHeight: '44px',
                      maxHeight: '44px',
                      lineHeight: '1.2'
                    }}
                  />

                  {/* Botão de emoji funcional */}
                  <div className="relative emoji-picker-container">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex-shrink-0"
                    >
                      <Smile size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* Picker de emoji */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-xl z-10 min-w-[280px]">
                        <div className="grid grid-cols-8 gap-1">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiClick(emoji)}
                              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl"
                              title={`Adicionar ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botão de enviar */}
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-600 rounded-full transition-colors disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Estado inicial
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <MessageSquare size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-xl text-center text-gray-500 dark:text-gray-400">
                Selecione um amigo para começar a conversar
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}