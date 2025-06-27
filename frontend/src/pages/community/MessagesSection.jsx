import React from 'react';
import { MessageSquare, ArrowLeft } from 'lucide-react';
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
    <section className="h-full flex flex-col overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2 sm:px-0">Mensagens Privadas</h2>

      {error && (
        <div className="mb-4 mx-2 sm:mx-0 p-3 sm:p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200">
          <p className="text-sm sm:text-base">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Fechar
          </button>
        </div>
      )}

      <div
        className="flex-1 flex min-h-0 overflow-hidden"
        style={{ height: 'calc(100vh - 200px)', maxHeight: 'calc(100vh - 200px)' }}
      >
        <aside className={`
          ${selectedFriend ? 'hidden md:flex' : 'flex'} 
          w-full md:w-1/4 md:min-w-[180px] md:max-w-[250px] 
          flex flex-col px-2 sm:px-0 h-full
        `}>
          <h3 className="font-semibold mb-3 text-gray-300 text-sm sm:text-base">Seus amigos</h3>
          <div className="flex-1 overflow-y-auto pr-0 md:pr-2">
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
                    className={`cursor-pointer px-2 sm:px-3 py-2 sm:py-3 rounded-lg transition-all duration-200 ${selectedFriend?.id === friend.id
                      ? 'bg-blue-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-blue-900/50 hover:text-white'
                      }`}
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate font-medium text-sm sm:text-base">{friend.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main
          className={`
            ${selectedFriend ? 'flex' : 'hidden md:flex'} 
            flex-1 flex-col bg-[#1e293b] rounded-none sm:rounded-2xl shadow-xl overflow-hidden mx-4 h-full
          `}
        >
          {selectedFriend ? (
            <>
              {/* Header fixo */}
              <header className="border-b border-gray-700 p-3 sm:p-6 bg-[#1a2332] rounded-none sm:rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSelectedFriend(null)}
                    className="md:hidden p-1 hover:bg-gray-700 rounded-lg transition-colors mr-1"
                  >
                    <ArrowLeft size={20} className="text-gray-400" />
                  </button>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold flex-shrink-0">
                    {selectedFriend.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-base sm:text-lg text-white truncate">{selectedFriend.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-400">Online</p>
                  </div>
                </div>
              </header>

              {/* Container de mensagens com altura fixa calculada */}
              <div
                className="flex-1 flex flex-col min-h-0 overflow-hidden"
                style={{
                  height: 'calc(100% - 140px)', // Subtrai altura do header e footer
                  maxHeight: 'calc(100% - 140px)'
                }}
              >
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-3 sm:p-6 scrollbar-dark scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent"
                  style={{
                    height: '100%',
                    maxHeight: '100%'
                  }}
                >
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-400 text-sm sm:text-base">Carregando mensagens...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-400 italic text-sm sm:text-base text-center px-4">Nenhuma mensagem ainda. Comece a conversa!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-4">
                      {messages.map((msg, idx) => {
                        const isOwn = msg.fromUserId === currentUserId;
                        const isConsecutive = idx > 0 && messages[idx - 1].fromUserId === msg.fromUserId;
                        return (
                          <div
                            key={msg.id || idx}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-2 sm:mt-4'}`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${isOwn ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-700 text-white rounded-bl-md'} ${msg.sending ? 'opacity-70' : ''}`}
                            >
                              <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{msg.content}</p>
                              <div className={`flex items-center justify-between mt-1 sm:mt-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                <span className="text-xs text-gray-300">
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              </div>

              {/* Footer fixo */}
              <footer className="border-t border-gray-700 p-3 sm:p-6 bg-[#1a2332] rounded-none sm:rounded-b-2xl flex-shrink-0">
                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="text"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleMessageKeyDown}
                    disabled={loadingMessages || sendingMessage}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                    disabled={loadingMessages || sendingMessage || !newMessage.trim()}
                  >
                    {sendingMessage ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 h-full">
              <div className="text-center">
                <MessageSquare size={48} className="text-gray-500 mx-auto mb-4 sm:w-16 sm:h-16" />
                <p className="text-gray-400 italic text-base sm:text-lg px-4">
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