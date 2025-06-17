import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import axios from '@/services/axios';
import { chatWithIA } from '@/services/iaApi';
import { Send, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function Chatbot() {
  const { id } = useParams(); // id da sessão de chat
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
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

    try {
      await axios.patch(`/chat-sessions/${id}`, { messages: newMessages });

      const iaResponse = await chatWithIA(input.trim());

      const updatedMessages = [...newMessages, { from: 'bot', text: iaResponse }];
      setMessages(updatedMessages);

      await axios.patch(`/chat-sessions/${id}`, { messages: updatedMessages });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função fake para simular resposta IA (substituir pela real)
  async function fakeIAResponse(userText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Resposta da IA para: "${userText}"`);
      }, 1500);
    });
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <main className="flex flex-1 flex-col p-6 md:p-10">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">{chat?.title || 'Carregando...'}</h1>
          <p className="text-gray-400 max-w-3xl">{chat?.description}</p>
        </header>

        <section className="flex flex-col flex-1 bg-[#1e293b] rounded-xl p-6 shadow-lg overflow-hidden">
          <div
            className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent"
            style={{ maxHeight: '65vh' }}
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="mt-4 flex gap-4"
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
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl px-6 py-3 transition"
              aria-label="Enviar mensagem"
            >
              {loading ? (
                <svg
                  className="animate-spin h-6 w-6 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                'Enviar'
              )}
            </button>
          </form>
        </section>
      </main>

      <DashboardRightPanel />
    </div>
  );
}