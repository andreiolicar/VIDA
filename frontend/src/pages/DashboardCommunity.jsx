import { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('amigos');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([{ id: 1, name: 'Maria Silva' }]);
  const [friends, setFriends] = useState([{ id: 2, name: 'João Pereira' }]);

  const handleSearch = () => {
    setSearchResults([
      { id: 3, name: 'Carlos Eduardo', email: 'carlos@email.com' },
      { id: 4, name: 'Fernanda Lima', email: 'fernanda@email.com' },
    ]);
  };

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

      <div className="flex-1 flex flex-col px-12 py-8 overflow-y-auto">
        {/* Título */}
        <h1 className="text-3xl font-extrabold mb-4">Comunidade VIDA</h1>

        {/* Navbar responsiva */}
        <nav className="flex w-full mb-10 border-b border-gray-700 pb-4 justify-between">
          {menuItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition text-center min-w-[110px] max-w-[160px] ${
                activeTab === key
                  ? 'bg-blue-700 text-white shadow-blue-900/50'
                  : 'text-gray-400 hover:text-white hover:bg-blue-900'
              }`}
              aria-current={activeTab === key ? 'page' : undefined}
              type="button"
            >
              <Icon size={16} />
              {/* Texto oculto em telas pequenas */}
              <span className="hidden sm:inline truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* Conteúdo dinâmico */}
        <div>
          {activeTab === 'amigos' && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Amigos</h2>

              {/* Busca */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <input
                  type="text"
                  className="flex-grow px-5 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="Buscar por nome ou email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-blue-900/40"
                >
                  Buscar
                </button>
              </div>

              {/* Resultados da busca */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4">Resultados da busca</h3>
                {searchResults.length === 0 ? (
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
                        <button className="self-start bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-green-900/60">
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
                {friendRequests.length === 0 ? (
                  <p className="text-gray-400 italic">Nenhuma solicitação pendente.</p>
                ) : (
                  <div className="space-y-6">
                    {friendRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-[#1f2937] rounded-2xl p-5 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-lg font-semibold truncate">{req.name}</p>
                          <p className="text-gray-400 text-sm">Quer ser seu amigo</p>
                        </div>
                        <div className="flex gap-4">
                          <button className="bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-blue-900/50">
                            Aceitar
                          </button>
                          <button className="bg-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition shadow-red-900/50">
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
                {friends.length === 0 ? (
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