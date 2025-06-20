import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';
import { chatWithIA, summarizeChat } from '@/services/iaApi';
import { Send, Loader2, FileText } from 'lucide-react';
import '@/components/scrollbar.css';

export default function Chatbot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await axios.get(`/chat-sessions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChat(res.data);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Erro ao carregar sessão:', err);
        setError('Erro ao carregar sessão.');
      }
    }
    if (id) fetchChat();
  }, [id, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input.trim() }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setTyping(true);

    try {
      await axios.patch(`/chat-sessions/${id}`, { messages: newMessages });

      const iaResponse = await chatWithIA(input.trim());

      const updatedMessages = [...newMessages, { from: 'bot', text: iaResponse }];
      setMessages(updatedMessages);

      await axios.patch(`/chat-sessions/${id}`, { messages: updatedMessages });
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const generateSummary = async () => {
    setError('');
    setSummary('');
    setShowSummary(true);
    try {
      const chatText = messages.map(m => `${m.from === 'user' ? 'Usuário' : 'IA'}: ${m.text}`).join('\n');
      const res = await summarizeChat(chatText);
      setSummary(res);
    } catch (err) {
      console.error('Erro ao gerar resumo:', err);
      setError('Erro ao gerar resumo.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex flex-1 flex-col p-6 md:p-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/chatbot')}
              className="flex items-center justify-center p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              aria-label="Voltar para o Dashboard de IA"
              title="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-semibold">{chat?.title || 'Carregando...'}</h1>
              <p className="text-gray-400 max-w-3xl">{chat?.description}</p>
            </div>
          </div>
          <button
            onClick={generateSummary}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            aria-label="Gerar resumo da conversa"
            title="Gerar resumo da conversa"
          >
            <FileText className="w-5 h-5" />
            Resumo
          </button>
        </header>

        {/* Container principal do chat - flex coluna */}
        <section className="flex flex-col flex-1 bg-[#1e293b] rounded-xl shadow-lg overflow-hidden justify-between">

          {/* Área das mensagens: ocupa todo espaço disponível, com scroll */}
          <div
            className="flex-1 overflow-y-auto px-6 pt-6 scrollbar-dark scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent"
            style={{ maxHeight: '72vh' }}
          >
            {messages.length === 0 && (
              <p className="text-gray-400 text-center mt-10">Nenhuma mensagem ainda.</p>
            )}
            {messages.map((msg, idx) => {
              const isUser = msg.from === 'user';
              return (
                <div
                  key={idx}
                  className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-md ${isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-700 text-gray-200 rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {typing && (
            <div className="flex justify-start px-6 mb-2">
              <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl rounded-bl-none animate-pulse select-none">
                IA está digitando...
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-4 px-6 py-6"
          >
            <input
              type="text"
              className="flex-1 rounded-2xl px-4 py-3 bg-[#111827] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base"
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              aria-label="Campo para digitar mensagem"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl px-6 py-3 transition flex items-center justify-center"
              aria-label="Enviar mensagem"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6 text-white" /> : <Send className="w-6 h-6" />}
            </button>
          </form>
        </section>
      </main>

      <DashboardRightPanel />

      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f2937] rounded-xl max-w-2xl w-full p-6 shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">Resumo da Conversa</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {summary ? (
              <p className="whitespace-pre-wrap text-gray-300">{summary}</p>
            ) : (
              <p className="text-gray-400">Gerando resumo...</p>
            )}
            <button
              onClick={() => {
                setShowSummary(false);
                setSummary('');
                setError('');
              }}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}