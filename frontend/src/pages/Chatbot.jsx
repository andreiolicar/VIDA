import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { chatWithIA } from '@/services/iaApi';
import ReactMarkdown from 'react-markdown';

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
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col px-12 py-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Assistente IA</h1>
            <p className="text-white/80 max-w-xl">
              Pergunte qualquer coisa! A IA V.I.D.A está pronta para ajudar.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white/10 rounded-xl p-6 overflow-y-auto max-h-[60vh]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] ${
                  msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.from === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="mb-3 flex justify-start">
              <div className="px-4 py-2 rounded-lg max-w-[70%] bg-gray-200 text-gray-900 animate-pulse">
                Pensando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensagem */}
        <form onSubmit={sendMessage} className="flex mt-6 gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-gray-300 outline-none"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            disabled={loading}
          >
            Enviar
          </button>
        </form>
      </div>

      <DashboardRightPanel />
    </div>
  );
}
