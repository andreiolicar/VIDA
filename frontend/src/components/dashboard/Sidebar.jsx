import {
    Home, CheckCircle, DollarSign, Book, HeartPulse, Bot,
    Settings, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { label: 'Início', icon: Home, path: '/dashboard' },
        { label: 'Tarefas', icon: CheckCircle, path: '/dashboard/tasks' },
        { label: 'Estudos', icon: Book, path: '/dashboard/study' },
        { label: 'IA', icon: Bot, path: '/dashboard/chatbot' },
    ];

    return (
        <aside className="w-64 bg-[#1e293b] text-white py-8 flex flex-col justify-between min-h-screen">
            <div className="space-y-8">
                <h1 className="text-2xl font-bold px-7">V.I.D.A</h1>

                <nav className="flex flex-col gap-2 px-4 text-sm text-white/80">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-left ${location.pathname === item.path
                                    ? 'bg-white/10 text-white'
                                    : 'hover:bg-white/5'
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
    );
}
