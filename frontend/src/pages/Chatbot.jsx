import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Olá! Sou sua IA V.I.D.A. Como posso ajudar você hoje?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Função para enviar mensagem
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Adiciona mensagem do usuário
    setMessages((msgs) => [...msgs, { from: 'user', text: input }]);
    setInput('');

    // Simula resposta da IA (substitua por chamada de API real)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          from: 'bot',
          text: `Você disse: "${input}". (Aqui viria a resposta da IA!)`,
        },
      ]);
    }, 800);

    // Para integrar com IA real, faça:
    // const res = await axios.post('/sua-rota-de-ia', { question: input });
    // setMessages(msgs => [...msgs, { from: "bot", text: res.data.answer }]);
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

        {/* Chat */}
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
                {msg.text}
              </div>
            </div>
          ))}
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
          >
            Enviar
          </button>
        </form>
      </div>

      <DashboardRightPanel />
    </div>
  );
}
