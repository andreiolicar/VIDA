import React from 'react';
import { useFriends } from '@/hooks/community/useFriends';

export default function FriendsSection() {
  const {
    search,
    setSearch,
    searchResults,
    friendRequests,
    friends,
    loadingSearch,
    loadingRequests,
    loadingFriends,
    error,
    handleSearch,
    handleSearchKeyDown,
    acceptRequest,
    rejectRequest,
    sendFriendRequest,
    clearError,
  } = useFriends();

  return (
    <section className="h-full overflow-y-auto pr-2 px-2 sm:px-4 md:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">Amigos</h2>

      {/* Exibir erro se houver */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 max-w-xl mx-auto sm:mx-0">
          <p>{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-sm underline hover:no-underline"
            aria-label="Fechar mensagem de erro"
          >
            Fechar
          </button>
        </div>
      )}

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
                  onClick={() => sendFriendRequest(user.id)}
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
        {loadingRequests ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-400">Carregando...</span>
          </div>
        ) : friendRequests.length === 0 ? (
          <p className="text-gray-400 italic text-center">Nenhuma solicitação pendente.</p>
        ) : (
          <div className="space-y-6 max-w-xl mx-auto sm:mx-0">
            {friendRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#1f2937] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <p className="text-lg font-semibold truncate">{req.requester?.name || 'Usuário desconhecido'}</p>
                  <p className="text-gray-400 text-sm truncate">{req.requester?.email || ''}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-blue-900/50"
                    aria-label={`Aceitar solicitação de ${req.requester?.name || 'usuário'}`}
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => rejectRequest(req.id)}
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
        {loadingFriends ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-400">Carregando...</span>
          </div>
        ) : friends.length === 0 ? (
          <p className="text-gray-400 italic text-center">Você ainda não tem amigos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-[#1f2937] rounded-3xl p-6 shadow-blue-700/80 hover:shadow-blue-700/100 flex flex-col items-center text-center cursor-pointer transition transform"
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
    </section>
  );
}