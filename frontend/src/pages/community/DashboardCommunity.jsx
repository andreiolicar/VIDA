import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import FriendsSection from '@/pages/community/FriendsSection';
import MessagesSection from '@/pages/community/MessagesSection';
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
    { key: 'grupos', icon: Users2, label: 'Grupos' },
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
      default:
        return (
          <section className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-xl text-gray-400">Seção em desenvolvimento</p>
              <p className="text-gray-500 mt-2">
                A seção "{menuItems.find(item => item.key === activeTab)?.label}" será implementada em breve.
              </p>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col px-4 sm:px-8 md:px-12 py-6 sm:py-8 overflow-hidden">
        <h1 className="text-3xl font-extrabold mb-4">Comunidade VIDA</h1>

        {/* Navegação principal */}
        <nav className="flex w-full mb-6 border-b border-gray-700 pb-4 justify-between">
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
              <span className="hidden sm:inline truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* Conteúdo principal com scroll */}
        <div className="flex-1 overflow-hidden">
          {renderActiveSection()}
        </div>
      </div>

      <DashboardRightPanel />
    </div>
  );
}