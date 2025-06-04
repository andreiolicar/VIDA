import {
  Home,
  CheckCircle,
  HeartPlus,
  DollarSign,
  Book,
  HeartPulse,
  Bot,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

import brancoVidaLogo from '../../assets/branco-site-vida.png';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Início', icon: Home, path: '/dashboard' },
    { label: 'Estudos', icon: Book, path: '/dashboard/study' },
    { label: 'Finanças', icon: DollarSign, path: '/dashboard/finance' },
    { label: 'Saúde', icon: HeartPlus, path: '/dashboard/health' },
    { label: 'Tarefas', icon: CheckCircle, path: '/dashboard/tasks' },
    { label: 'Assistente IA', icon: Bot, path: '/dashboard/chatbot' },
  ];

  // Fecha o menu ao navegar
  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão hambúrguer para mobile */}
      <button
        className="md:hidden fixed top-4 right-4 z-40 bg-[#1e293b] rounded-full p-2 shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                    fixed top-0 left-0 z-40
                    w-64 bg-[#1e293b] text-white py-8 flex flex-col justify-between min-h-screen
                    transition-transform duration-300
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:static md:translate-x-0 md:flex
                `}
        style={{ minHeight: '100vh' }}
      >
        <div className="space-y-8">
          <img src={brancoVidaLogo} className="px-7 h-8" alt="logo" />

          <nav className="flex flex-col gap-2 px-4 text-sm text-white/80">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-left ${
                  location.pathname === item.path ? 'bg-white/10 text-white' : 'hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-3 px-4 text-sm">
          <button
            onClick={() => handleNavigate('/dashboard/settings')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition px-3 py-2"
          >
            <Settings size={18} />
            Configurações
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 transition px-3 py-2"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
