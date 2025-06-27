import { useState, useCallback, useEffect } from 'react';
import api from '@/services/axios';

export function useFriends() {
  // Estados relacionados à funcionalidade de amigos
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  // Estados de loading
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Estados de erro
  const [error, setError] = useState(null);

  // Estados para notificações
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    actions: [],
    autoClose: false,
    autoCloseDelay: 3000
  });

  // Funções de utilidade
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const showError = useCallback((message) => {
    setError(message);
    setTimeout(clearError, 5000);
  }, [clearError]);

  // Função para mostrar notificações
  const showNotification = useCallback((config) => {
    setNotification({
      isOpen: true,
      type: 'info',
      title: '',
      message: '',
      actions: [],
      autoClose: false,
      autoCloseDelay: 3000,
      ...config
    });
  }, []);

  // Função para fechar notificação
  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Buscar usuários pelo termo de pesquisa
  const handleSearch = useCallback(async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    clearError();

    try {
      const response = await api.get(`/friends/search?q=${encodeURIComponent(search.trim())}`);
      setSearchResults(response.data || []);
    } catch (err) {
      console.error('[SEARCH] Erro:', err);
      showError(err.response?.data?.message || 'Erro ao buscar usuários.');
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [search, clearError, showError]);

  // Buscar solicitações pendentes
  const fetchFriendRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const response = await api.get('/friends/requests');
      setFriendRequests(response.data || []);
    } catch (err) {
      console.error('[REQUESTS] Erro ao carregar solicitações:', err);
      showError('Erro ao carregar solicitações.');
    } finally {
      setLoadingRequests(false);
    }
  }, [showError]);

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

  // Aceitar solicitação de amizade
  const acceptRequest = useCallback(async (requestId) => {
    try {
      await api.put(`/friends/requests/${requestId}/accept`);
      await Promise.all([fetchFriendRequests(), fetchFriends()]);
    } catch (err) {
      console.error('[ACCEPT REQUEST] Erro:', err);
      showError(err.response?.data?.error || 'Erro ao aceitar solicitação.');
    }
  }, [fetchFriendRequests, fetchFriends, showError]);

  // Recusar solicitação
  const rejectRequest = useCallback(async (requestId) => {
    try {
      await api.put(`/friends/requests/${requestId}/reject`);
      await fetchFriendRequests();
    } catch (err) {
      console.error('[REJECT REQUEST] Erro:', err);
      showError(err.response?.data?.error || 'Erro ao recusar solicitação.');
    }
  }, [fetchFriendRequests, showError]);

  // Enviar nova solicitação de amizade
  const sendFriendRequest = useCallback(async (receiverUserId) => {
    try {
      await api.post('/friends/requests', { receiverUserId });
      setSearch('');
      setSearchResults([]);
    } catch (err) {
      console.error('[SEND REQUEST] Erro:', err);
      showError(err.response?.data?.error || 'Erro ao enviar solicitação.');
    }
  }, [showError]);

  // Função customizada para enviar solicitação de amizade com notificação
  const handleSendFriendRequest = useCallback(async (userId, userName) => {
    try {
      await sendFriendRequest(userId);
      showNotification({
        type: 'friend-request',
        title: 'Solicitação Enviada!',
        message: `Sua solicitação de amizade foi enviada para ${userName}. Aguarde a resposta!`,
        autoClose: true,
        autoCloseDelay: 3000
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Erro ao Enviar',
        message: 'Não foi possível enviar a solicitação de amizade. Tente novamente.',
        actions: [
          {
            label: 'Tentar Novamente',
            onClick: () => handleSendFriendRequest(userId, userName),
            variant: 'primary'
          },
          { label: 'Cancelar', onClick: closeNotification }
        ]
      });
    }
  }, [sendFriendRequest, showNotification, closeNotification]);

  // Função customizada para aceitar solicitação com notificação
  const handleAcceptRequest = useCallback(async (requestId, requesterName) => {
    showNotification({
      type: 'friend-request',
      title: 'Aceitar Solicitação',
      message: `Deseja aceitar a solicitação de amizade de ${requesterName}?`,
      actions: [
        {
          label: 'Aceitar',
          onClick: async () => {
            try {
              await acceptRequest(requestId);
              showNotification({
                type: 'friend-accepted',
                title: 'Amizade Aceita!',
                message: `Agora você e ${requesterName} são amigos!`,
                autoClose: true,
                autoCloseDelay: 3000
              });
            } catch (error) {
              showNotification({
                type: 'error',
                title: 'Erro',
                message: 'Não foi possível aceitar a solicitação. Tente novamente.',
                actions: [{ label: 'OK', onClick: closeNotification, variant: 'primary' }]
              });
            }
          },
          variant: 'success'
        },
        { label: 'Cancelar', onClick: closeNotification }
      ]
    });
  }, [acceptRequest, showNotification, closeNotification]);

  // Função customizada para rejeitar solicitação com notificação
  const handleRejectRequest = useCallback(async (requestId, requesterName) => {
    showNotification({
      type: 'warning',
      title: 'Rejeitar Solicitação',
      message: `Tem certeza que deseja rejeitar a solicitação de ${requesterName}?`,
      actions: [
        {
          label: 'Rejeitar',
          onClick: async () => {
            try {
              await rejectRequest(requestId);
              showNotification({
                type: 'friend-rejected',
                title: 'Solicitação Rejeitada',
                message: `A solicitação de ${requesterName} foi rejeitada.`,
                autoClose: true,
                autoCloseDelay: 2000
              });
            } catch (error) {
              showNotification({
                type: 'error',
                title: 'Erro',
                message: 'Não foi possível rejeitar a solicitação. Tente novamente.',
                actions: [{ label: 'OK', onClick: closeNotification, variant: 'primary' }]
              });
            }
          },
          variant: 'danger'
        },
        { label: 'Cancelar', onClick: closeNotification }
      ]
    });
  }, [rejectRequest, showNotification, closeNotification]);

  // Handler para Enter na busca
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Efeito para mostrar erros como notificações
  useEffect(() => {
    if (error) {
      showNotification({
        type: 'error',
        title: 'Erro',
        message: error,
        actions: [
          {
            label: 'OK',
            onClick: () => {
              clearError();
              closeNotification();
            },
            variant: 'primary'
          }
        ]
      });
    }
  }, [error, clearError, showNotification, closeNotification]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, [fetchFriendRequests, fetchFriends]);

  return {
    // Estados principais
    search,
    setSearch,
    searchResults,
    friendRequests,
    friends,

    // Estados de loading
    loadingSearch,
    loadingRequests,
    loadingFriends,

    // Estados de erro e notificação
    error,
    notification,

    // Funções básicas
    handleSearch,
    handleSearchKeyDown,
    fetchFriendRequests,
    fetchFriends,
    acceptRequest,
    rejectRequest,
    sendFriendRequest,
    clearError,

    // Funções com lógica de notificação
    handleSendFriendRequest,
    handleAcceptRequest,
    handleRejectRequest,

    // Funções de notificação
    showNotification,
    closeNotification,
  };
}