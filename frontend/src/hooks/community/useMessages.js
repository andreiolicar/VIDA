import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import api from '@/services/axios';
import { useSocket } from '@/hooks/useSocket';

export function useMessages() {
  // Estados para chat privado
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friends, setFriends] = useState([]);

  // Estados de loading
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Estados de erro
  const [error, setError] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Socket e usuário atual
  const token = localStorage.getItem('token');
  const socket = useSocket(token);

  const currentUserId = useMemo(() => {
    try {
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }, [token]);

  // Funções de utilidade
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const showError = useCallback((message) => {
    setError(message);
    setTimeout(clearError, 5000);
  }, [clearError]);

  // Buscar lista de amigos
  const fetchFriends = useCallback(async () => {
    setLoadingFriends(true);
    try {
      const response = await api.get('/friends');
      setFriends(response.data || []);
    } catch (err) {
      console.error('[FRIENDS] Erro ao carregar amigos:', err);
      showError('Erro ao carregar amigos.');
    } finally {
      setLoadingFriends(false);
    }
  }, [showError]);

  // Buscar histórico de mensagens com um amigo
  const fetchMessages = useCallback(async (friendId) => {
    if (!friendId || !currentUserId) return;

    setLoadingMessages(true);
    try {
      const response = await api.get(`/messages/conversation/${friendId}`);
      const messagesData = response.data || [];

      const formattedMessages = messagesData.map(msg => ({
        ...msg,
        fromUserId: msg.senderUserId || msg.fromUserId,
        toUserId: msg.receiverUserId || msg.toUserId,
        timestamp: msg.timestamp || msg.createdAt,
      }));

      setMessages(formattedMessages);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('[FETCH MESSAGES] Erro:', err);
      showError('Erro ao carregar mensagens.');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [currentUserId, scrollToBottom, showError]);

  // Enviar nova mensagem
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedFriend || !currentUserId || sendingMessage) {
      return;
    }

    const messageContent = newMessage.trim();
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      fromUserId: currentUserId,
      toUserId: selectedFriend.id,
      timestamp: new Date().toISOString(),
      read: false,
      sending: true,
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setSendingMessage(true);

    try {
      const payload = {
        receiverUserId: selectedFriend.id,
        content: messageContent
      };

      const response = await api.post('/messages', payload);

      setMessages(prev => prev.map(msg =>
        msg.id === tempMessage.id
          ? { ...response.data, fromUserId: response.data.senderUserId }
          : msg
      ));

      scrollToBottom();
    } catch (err) {
      console.error('[SEND MESSAGE] Erro:', err);
      showError('Erro ao enviar mensagem.');

      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(messageContent);
    } finally {
      setSendingMessage(false);
    }
  }, [newMessage, selectedFriend, currentUserId, sendingMessage, scrollToBottom, showError]);

  // Handler para Enter no envio de mensagem
  const handleMessageKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Effect para scroll automático
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Effect para carregar amigos
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // Effect para carregar mensagens quando selecionar amigo
  useEffect(() => {
    if (selectedFriend?.id) {
      fetchMessages(selectedFriend.id);
    } else {
      setMessages([]);
    }
  }, [selectedFriend?.id, fetchMessages]);

  // Effect para escutar mensagens via socket
  useEffect(() => {
    if (!socket || !currentUserId) return;

    const handlePrivateMessage = (msg) => {
      console.log('[SOCKET] Mensagem recebida:', msg);

      const isForCurrentConversation = selectedFriend && (
        (msg.fromUserId === selectedFriend.id && msg.toUserId === currentUserId) ||
        (msg.fromUserId === currentUserId && msg.toUserId === selectedFriend.id)
      );

      if (isForCurrentConversation) {
        setMessages(prev => {
          const messageExists = prev.some(existingMsg => existingMsg.id === msg.id);
          if (messageExists) return prev;

          return [...prev, {
            ...msg,
            fromUserId: msg.fromUserId || msg.senderUserId,
            toUserId: msg.toUserId || msg.receiverUserId,
          }];
        });
      }
    };

    socket.on('private message', handlePrivateMessage);

    return () => {
      socket.off('private message', handlePrivateMessage);
    };
  }, [socket, selectedFriend, currentUserId]);

  return {
    // Estados
    selectedFriend,
    setSelectedFriend,
    messages,
    newMessage,
    setNewMessage,
    friends,
    loadingMessages,
    loadingFriends,
    sendingMessage,
    error,
    currentUserId,
    
    // Refs
    messagesEndRef,
    messagesContainerRef,
    
    // Funções
    fetchFriends,
    fetchMessages,
    sendMessage,
    handleMessageKeyDown,
    clearError,
  };
}