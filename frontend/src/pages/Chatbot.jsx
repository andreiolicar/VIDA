import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { chatWithIA } from '@/services/iaApi';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Olá! Sou sua IA V.I.D.A. Como posso ajudar você hoje?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((msgs) => [...msgs, { from: 'user', text: input }]);
    setLoading(true);
    const userInput = input;
    setInput('');

    try {
      const resposta = await chatWithIA(userInput);
      setMessages((msgs) => [...msgs, { from: 'bot', text: resposta }]);
    } catch (error) {
      console.error('Erro ao conversar com a IA:', error);
      setMessages((msgs) => [
        ...msgs,
        {
          from: 'bot',
          text: 'Desculpe, não consegui responder no momento. Tente novamente mais tarde.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      {/* Sidebar - oculto em telas pequenas */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <main className="flex flex-col flex-1 px-6 py-6 md:px-12 md:py-8">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl font-semibold">Assistente IA V.I.D.A</h1>
          <p className="text-gray-400 max-w-xl mt-1 md:mt-2 text-sm md:text-base">
            Pergunte qualquer coisa! A IA V.I.D.A está pronta para ajudar você a organizar sua vida.
          </p>
        </header>

        {/* Chat container */}
        <section className="flex flex-col flex-1 bg-[#1e293b] rounded-2xl shadow-lg p-4 md:p-6 overflow-hidden">
          {/* Mensagens */}
          <div
            className="flex-1 overflow-y-auto pr-2 md:pr-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent"
            style={{ maxHeight: '65vh' }}
          >
            {messages.map((msg, idx) => {
              const isUser = msg.from === 'user';
              return (
                <div
                  key={idx}
                  className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                  aria-live="polite"
                >
                  <div
                    className={`
                      relative max-w-[75%] px-4 md:px-5 py-2 md:py-3 rounded-2xl
                      ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}
                      shadow-md
                      animate-fadeIn
                      text-sm md:text-base
                    `}
                  >
                    {msg.from === 'bot' ? (
                      <div className="prose prose-invert max-w-none break-words">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <span>{msg.text}</span>
                    )}
                    <span
                      className={`absolute bottom-0 w-3 md:w-4 h-3 md:h-4 bg-transparent ${isUser ? '-right-2 rounded-bl-2xl' : '-left-2 rounded-br-2xl'
                        }`}
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                        backgroundColor: isUser ? '#2563eb' : '#374151',
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-2 bg-gray-700 text-gray-200 px-4 md:px-5 py-2 md:py-3 rounded-2xl rounded-bl-none shadow-md animate-pulse max-w-[75%] text-sm md:text-base">
                  <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  <span>Pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="mt-3 md:mt-4 flex gap-2 md:gap-4">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-[#111827] rounded-2xl px-4 md:px-5 py-2 md:py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm md:text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              aria-label="Campo para digitar mensagem"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl px-4 md:px-6 py-2 md:py-3 flex items-center justify-center transition"
              aria-label="Enviar mensagem"
            >
              <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </form>
        </section>
      </main>

      <div className="hidden xl:flex xl:flex-shrink-0">
        <DashboardRightPanel />
      </div>
    </div>
  );
}