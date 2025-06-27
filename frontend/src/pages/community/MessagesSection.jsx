import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useMessages } from '@/hooks/community/useMessages';
import '@/components/scrollbar.css';

export default function MessagesSection() {
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

  return (
    <section className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Mensagens Privadas</h2>

      {/* Exibir erro se houver */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200">
          <p>{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Fechar
          </button>
        </div>
      )}

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
                    className={`cursor-pointer px-3 py-3 rounded-lg transition-all duration-200 ${
                      selectedFriend?.id === friend.id
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

        {/* Área de chat */}
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

              {/* Lista de mensagens */}
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
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
                            isConsecutive ? 'mt-1' : 'mt-4'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                              isOwn
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
  );
}