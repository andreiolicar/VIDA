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

  // Funções de utilidade
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const showError = useCallback((message) => {
    setError(message);
    setTimeout(clearError, 5000);
  }, [clearError]);

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
      alert('Solicitação aceita!');
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
      alert('Solicitação recusada!');
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
      alert('Solicitação enviada com sucesso!');
      setSearch('');
      setSearchResults([]);
    } catch (err) {
      console.error('[SEND REQUEST] Erro:', err);
      showError(err.response?.data?.error || 'Erro ao enviar solicitação.');
    }
  }, [showError]);

  // Handler para Enter na busca
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, [fetchFriendRequests, fetchFriends]);

  return {
    // Estados
    search,
    setSearch,
    searchResults,
    friendRequests, 
    friends,
    loadingSearch,
    loadingRequests,
    loadingFriends,
    error,
    
    // Funções
    handleSearch,
    handleSearchKeyDown,
    fetchFriendRequests,
    fetchFriends,
    acceptRequest,
    rejectRequest,
    sendFriendRequest,
    clearError,
  };
}