import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatWithIA = async (message) => {
  const res = await api.post('/ia/chat', { message });
  return res.data.answer;
};

export const summarizeChat = async (chatText) => {
  const res = await api.post('/chat-sessions/ia/summarize', { text: chatText });
  return res.data.summary;
};