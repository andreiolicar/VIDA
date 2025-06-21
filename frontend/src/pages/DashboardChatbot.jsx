import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/services/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { Plus, Trash2, MessageCircle, Clock, Users } from 'lucide-react';

export default function DashboardChatbot() {
    const userId = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Inicializa o estado do modal verificando se já foi exibido antes
    const [showModal, setShowModal] = useState(() => {
        return localStorage.getItem('dashboardChatbotModalShown') !== 'true';
    });
    const [visible, setVisible] = useState(false);

    const [chatSessions, setChatSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [stats, setStats] = useState({
        totalChats: 0,
        totalMessages: 0,
        lastChatTitle: '',
        lastChatDate: null,
    });

    // Controla a animação do modal
    useEffect(() => {
        if (showModal) {
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [showModal]);

    // Busca as sessões de chat do backend
    const fetchChatSessions = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/chat-sessions', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChatSessions(res.data);
            setError('');

            // Calcula estatísticas rápidas
            const totalMessages = res.data.reduce(
                (acc, chat) => acc + (chat.messageCount || 0),
                0
            );

            const lastChat = res.data.reduce((prev, current) => {
                const prevDate = prev?.updatedAt ? new Date(prev.updatedAt) : new Date(0);
                const currDate = current?.updatedAt ? new Date(current.updatedAt) : new Date(0);
                return currDate > prevDate ? current : prev;
            }, null);

            setStats({
                totalChats: res.data.length,
                totalMessages,
                lastChatTitle: lastChat?.title || '',
                lastChatDate: lastChat?.updatedAt ? new Date(lastChat.updatedAt) : null,
            });
        } catch (err) {
            console.error('Erro ao buscar sessões:', err.response || err);
            setError('Erro ao carregar sessões. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Busca as sessões ao carregar o componente
    useEffect(() => {
        if (userId && token) {
            fetchChatSessions();
        }
    }, [userId, token]);

    // Fecha o modal e registra no localStorage para não mostrar novamente
    const handleCloseModal = () => {
        setShowModal(false);
        localStorage.setItem('dashboardChatbotModalShown', 'true');
    };

    // Deleta uma sessão de chat
    const handleDelete = async (id) => {
        if (!window.confirm('Deseja realmente deletar esta sessão?')) return;
        try {
            await axios.delete(`/chat-sessions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChatSessions((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
            console.error('Erro ao deletar sessão:', error);
            alert('Erro ao deletar sessão');
        }
    };

    // Navega para o chat selecionado
    const goToChatbot = (id) => {
        navigate(`/dashboard/chatbot/${id}`);
    };

    // Navega para criação de nova sessão
    const goToNewSession = () => {
        navigate('/dashboard/chatbot/new');
    };

    // Seleciona as 3 últimas sessões ordenadas por data de atualização
    const lastThreeSessions = [...chatSessions]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3);

    return (
        <>
            {(showModal || visible) && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4
            transition-opacity duration-300
            ${showModal ? 'opacity-100' : 'opacity-0'}`}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className={`bg-[#1f2937] rounded-2xl p-8 max-w-xl w-full shadow-xl text-white relative flex flex-col
              transform transition-transform duration-300
              ${showModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-center">Bem-vindo às Sessões de Chat</h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed text-base md:text-lg">
                            <p>
                                Aqui você pode criar, gerenciar e conversar com suas sessões personalizadas da IA <strong>V.I.D.A</strong>.
                            </p>
                            <p>
                                <strong>Funcionalidades principais:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Criar novas sessões</strong> para diferentes temas ou objetivos.</li>
                                <li><strong>Visualizar suas últimas sessões</strong> para retomar conversas rapidamente.</li>
                                <li><strong>Excluir sessões</strong> que não são mais necessárias.</li>
                                <li><strong>Abrir uma sessão</strong> para conversar e interagir com a IA.</li>
                            </ul>
                            <p>
                                Aproveite para organizar suas ideias, tirar dúvidas e planejar com a ajuda da IA V.I.D.A!
                            </p>
                        </div>
                        <button
                            onClick={handleCloseModal}
                            className="mt-8 self-center bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Fechar modal explicativo"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
                <Sidebar />

                <div className="flex flex-1 flex-col px-12 py-8 overflow-y-auto">
                    {/* Cabeçalho */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">
                            Sessões de Chat {chatSessions.length ? `(${chatSessions.length})` : ''}
                        </h1>
                        <button
                            onClick={goToNewSession}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            aria-label="Criar nova sessão"
                        >
                            <Plus size={18} /> Nova Sessão
                        </button>
                    </div>

                    {/* Estatísticas rápidas */}
                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col items-center">
                            <Users className="w-10 h-10 text-purple-400 mb-3" />
                            <h3 className="text-lg font-semibold mb-1">Total de Chats</h3>
                            <p className="text-gray-300 text-2xl">{stats.totalChats}</p>
                        </div>
                        <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col items-center">
                            <MessageCircle className="w-10 h-10 text-green-400 mb-3" />
                            <h3 className="text-lg font-semibold mb-1">Mensagens Enviadas</h3>
                            <p className="text-gray-300 text-2xl">{stats.totalMessages}</p>
                        </div>
                        <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col items-center">
                            <Clock className="w-10 h-10 text-yellow-400 mb-3" />
                            <h3 className="text-lg font-semibold mb-1">Última Sessão</h3>
                            <p className="text-gray-500 text-xs mt-4">
                                Última atualização:{' '}
                                {stats.lastChatDate
                                    ? stats.lastChatDate.toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : 'N/A'}
                            </p>
                        </div>
                    </section>

                    {/* Últimas sessões */}
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold mb-4">Últimas Sessões</h2>
                        {lastThreeSessions.length === 0 ? (
                            <p className="text-gray-400">Nenhuma sessão recente.</p>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {lastThreeSessions.map((session) => (
                                    <li
                                        key={session.id}
                                        className="flex flex-col justify-between bg-[#1f2937] p-4 rounded-lg cursor-pointer hover:bg-blue-800 transition shadow"
                                        onClick={() => goToChatbot(session.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && goToChatbot(session.id)}
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">{session.title || 'Sem título'}</h3>
                                            <p className="text-green-400 text-xs font-semibold mb-1">
                                                Mensagens: {session.messageCount || 0}
                                            </p>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-4">
                                            Última atualização:{' '}
                                            {session.updatedAt
                                                ? new Date(session.updatedAt).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                                : 'N/A'}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Todas as sessões */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Todas as Sessões</h2>
                        {loading ? (
                            <p>Carregando sessões...</p>
                        ) : error ? (
                            <p className="text-red-400">{error}</p>
                        ) : chatSessions.length === 0 ? (
                            <p className="text-gray-400">Nenhuma sessão encontrada. Crie uma nova!</p>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {chatSessions.map((session) => (
                                    <li
                                        key={session.id}
                                        className="flex justify-between items-center bg-[#1f2937] p-4 rounded-lg cursor-pointer hover:bg-blue-800 transition"
                                    >
                                        <div
                                            className="flex-1"
                                            onClick={() => goToChatbot(session.id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && goToChatbot(session.id)}
                                        >
                                            <h2 className="text-lg font-semibold">{session.title || 'Sem título'}</h2>
                                            <p className="text-green-400 text-xs font-semibold mb-1">
                                                Mensagens: {session.messageCount || 0}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(session.id)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label={`Deletar sessão ${session.title}`}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

                <DashboardRightPanel />
            </div>
        </>
    );
}