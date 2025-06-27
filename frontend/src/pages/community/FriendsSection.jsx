import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { useFriends } from '@/hooks/community/useFriends';
import NotificationModal from '@/components/community/NotificationModal';
import LoadingNotification from '@/components/community/LoadingNotification';

export default function FriendsSection() {
  const {
    // Estados principais
    search,
    setSearch,
    searchResults,
    friendRequests,
    friends,

    // Estados de loading
    loadingSearch,
    loadingRequests,
    loadingFriends,

    // Estados de notificação
    notification,

    // Handlers
    handleSearch,
    handleSearchKeyDown,
    handleSendFriendRequest,
    handleAcceptRequest,
    handleRejectRequest,
    closeNotification,
  } = useFriends();

  return (
    <section className="h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Amigos</h2>

      {/* Busca de usuários */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-xl mx-auto sm:mx-0">
        <input
          type="text"
          className="flex-grow px-5 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          placeholder="Buscar por nome ou email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          disabled={loadingSearch}
          aria-label="Campo de busca por nome ou email"
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
      {searchResults.length > 0 && (
        <div className="mb-12 max-w-7xl mx-auto sm:mx-0">
          <h3 className="text-xl font-semibold mb-4">Resultados da busca</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  onClick={() => handleSendFriendRequest(user.id, user.name)}
                  className="self-start bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-green-900/60"
                  aria-label={`Enviar solicitação para ${user.name}`}
                >
                  Enviar Solicitação
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solicitações pendentes */}
      <div className="mb-12 max-w-7xl mx-auto sm:mx-0">
        <h3 className="text-xl font-semibold mb-4">Solicitações Recebidas</h3>
        {friendRequests.length === 0 ? (
          <div className="bg-[#1f2937]/50 border border-gray-700/50 rounded-2xl p-8 text-center">
            <UserPlus className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 italic">Nenhuma solicitação pendente.</p>
            <p className="text-gray-500 text-sm mt-2">
              Quando alguém enviar uma solicitação, ela aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-xl mx-auto sm:mx-0">
            {friendRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#1f2937] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-700/30 shadow-lg"
              >
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <p className="text-lg font-semibold truncate">{req.requester?.name || 'Usuário desconhecido'}</p>
                  <p className="text-gray-400 text-sm truncate">{req.requester?.email || ''}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAcceptRequest(req.id, req.requester?.name)}
                    className="bg-green-600 px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-green-900/50"
                    aria-label={`Aceitar solicitação de ${req.requester?.name || 'usuário'}`}
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => handleRejectRequest(req.id, req.requester?.name)}
                    className="bg-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-red-900/50"
                    aria-label={`Recusar solicitação de ${req.requester?.name || 'usuário'}`}
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
      <div className="max-w-7xl mx-auto sm:mx-0">
        <h3 className="text-xl font-semibold mb-4">Seus Amigos</h3>
        {friends.length === 0 ? (
          <div className="bg-[#1f2937]/50 border border-gray-700/50 rounded-2xl p-8 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 italic">Você ainda não tem amigos.</p>
            <p className="text-gray-500 text-sm mt-2">
              Use a busca acima para encontrar pessoas e enviar solicitações de amizade.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-[#1f2937] rounded-3xl p-6 shadow-blue-700/80 hover:shadow-blue-700/100 flex flex-col items-center text-center cursor-pointer transition transform hover:scale-105"
                tabIndex={0}
                role="button"
                aria-label={`Amigo ${friend.name}`}
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

      {/* Notificações */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        actions={notification.actions}
        autoClose={notification.autoClose}
        autoCloseDelay={notification.autoCloseDelay}
      />

      {/* Loading overlay para operações */}
      <LoadingNotification
        isOpen={loadingRequests || loadingFriends}
        message={loadingRequests ? "Carregando solicitações..." : "Carregando amigos..."}
      />
    </section>
  );
}