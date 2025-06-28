import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import FriendsSection from '@/pages/community/FriendsSection';
import MessagesSection from '@/pages/community/MessagesSection';
import GroupsSection from '@/pages/community/GroupsSection';
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

export default function CommunityDashboard() {
  const [activeTab, setActiveTab] = useState('amigos');

  const menuItems = [
    { key: 'amigos', icon: Users, label: 'Amigos' },
    { key: 'mensagens', icon: MessageSquare, label: 'Mensagens' },
    { key: 'grupos', icon: Users2, label: 'Grupos' }, // Item grupos
    { key: 'conteudo', icon: FileText, label: 'Conteúdos' },
    { key: 'notificacoes', icon: Bell, label: 'Notificações' },
    { key: 'eventos', icon: Calendar, label: 'Eventos' },
    { key: 'reputacao', icon: Star, label: 'Reputação' },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'amigos':
        return <FriendsSection />;
      case 'mensagens':
        return <MessagesSection />;
      case 'grupos':
        return <GroupsSection />; // Renderiza a seção de grupos
      default:
        const activeItem = menuItems.find((item) => item.key === activeTab);
        return (
          <section className="h-full flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl">
                  {activeItem && <activeItem.icon className="w-12 h-12 text-gray-400" />}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">🚧</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-200 mb-3">
                {activeItem?.label}
              </h3>
              <p className="text-gray-400 mb-4">
                Esta seção está sendo desenvolvida com muito carinho para você!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/20 border border-blue-700/30 rounded-full text-blue-400 text-sm">
                <Calendar className="w-4 h-4" />
                Em breve disponível
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      {/* Sidebar: fixo em desktop, colapsável em mobile */}
      <Sidebar className="hidden md:flex md:flex-shrink-0" />

      {/* Container principal: flex-col em mobile, flex-row em desktop */}
      <div className="flex flex-1 flex-col px-4 py-6 sm:px-6 md:px-12 md:py-8 overflow-hidden">
        <h1 className="text-3xl font-extrabold mb-4 truncate">Comunidade VIDA</h1>

        {/* Navegação principal */}
        <nav
          className="flex w-full mb-6 border-b border-gray-700 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent"
          aria-label="Menu da comunidade"
        >
          {menuItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-shrink-0 items-center justify-center mr-5 gap-2 px-3 py-1.5 rounded-lg font-semibold transition min-w-[90px] max-w-[160px] ${activeTab === key
                ? 'bg-blue-700 text-white shadow-blue-900/50'
                : 'text-gray-400 hover:text-white hover:bg-blue-900'
                }`}
              aria-current={activeTab === key ? 'page' : undefined}
              type="button"
              title={label}
            >
              <Icon size={16} />
              {/* Esconde texto em telas muito pequenas */}
              <span className="hidden sm:inline truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* Conteúdo principal com scroll */}
        <div className="flex-1 overflow-hidden min-h-0">
          {renderActiveSection()}
        </div>
      </div>

      {/* Painel direito: esconde em telas pequenas, mostra em md+ */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <DashboardRightPanel />
      </div>
    </div>
  );
}