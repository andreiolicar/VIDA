import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const chatWithIA = async (message) => {
  const res = await api.post('/ia/chat', { message });
  return res.data.answer;
};

// Função fake temporária para testes do resumo da conversa
export const summarizeChat = async (chatText) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Resumo simulado da conversa.');
    }, 1500);
  });
};