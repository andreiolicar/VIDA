import { useState, useEffect, useCallback } from 'react';
import api from '@/services/axios';
import { useSocket } from '@/hooks/useSocket'; // Hook para conexão socket cliente

export function useGroups(token) {
    const socket = useSocket(token);

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Buscar grupos do usuário
    const fetchGroups = useCallback(async () => {
        setLoadingGroups(true);
        try {
            const res = await api.get('/groups');
            setGroups(res.data);
        } catch (err) {
            setError('Erro ao carregar grupos');
        } finally {
            setLoadingGroups(false);
        }
    }, []);

    // Buscar membros do grupo selecionado
    const fetchMembers = useCallback(async (groupId) => {
        try {
            const res = await api.get(`/groups/${groupId}/members`);
            setMembers(res.data);
        } catch {
            setError('Erro ao carregar membros');
        }
    }, []);

    // Buscar mensagens do grupo selecionado
    const fetchMessages = useCallback(async (groupId) => {
        setLoadingMessages(true);
        try {
            const res = await api.get(`/groups/${groupId}/messages`);
            setMessages(res.data);
        } catch {
            setErrorMessage('Erro ao carregar mensagens');
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    // Criar novo grupo
    const createGroup = useCallback(async (data) => {
        try {
            const res = await api.post('/groups', data);
            setGroups((prev) => [...prev, res.data]);
            setError(null);
        } catch {
            setError('Erro ao criar grupo');
        }
    }, []);

    // Adicionar membro
    const addMember = useCallback(async (groupId, userId) => {
        try {
            await api.post(`/groups/${groupId}/members`, { userId });
            await fetchMembers(groupId);
        } catch {
            setError('Erro ao adicionar membro');
        }
    }, [fetchMembers]);

    // Remover membro
    const removeMember = useCallback(async (groupId, userId) => {
        try {
            await api.delete(`/groups/${groupId}/members/${userId}`);
            await fetchMembers(groupId);
        } catch {
            setError('Erro ao remover membro');
        }
    }, [fetchMembers]);

    // Alterar papel do membro
    const changeMemberRole = useCallback(async (groupId, userId, role) => {
        try {
            await api.put(`/groups/${groupId}/members/${userId}/role`, { role });
            await fetchMembers(groupId);
        } catch {
            setError('Erro ao alterar papel do membro');
        }
    }, [fetchMembers]);

    // Enviar mensagem no grupo
    const sendMessage = useCallback(async (groupId, content) => {
        try {
            await api.post(`/groups/${groupId}/messages`, { content });
            // A mensagem será recebida via socket e adicionada automaticamente
        } catch {
            setErrorMessage('Erro ao enviar mensagem');
        }
    }, []);

    // Escutar eventos socket para atualizar mensagens e membros em tempo real
    useEffect(() => {
        if (!socket || !selectedGroup) return;

        const handleGroupMessage = (msg) => {
            if (msg.groupId === selectedGroup.id) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        const handleMemberJoined = (data) => {
            if (data.groupId === selectedGroup.id) {
                fetchMembers(selectedGroup.id);
            }
        };

        const handleMemberLeft = (data) => {
            if (data.groupId === selectedGroup.id) {
                fetchMembers(selectedGroup.id);
            }
        };

        const handleGroupUpdated = (data) => {
            if (data.groupId === selectedGroup.id) {
                setSelectedGroup((prev) => ({ ...prev, ...data }));
            }
        };

        socket.on('group message', handleGroupMessage);
        socket.on('group member joined', handleMemberJoined);
        socket.on('group member left', handleMemberLeft);
        socket.on('group updated', handleGroupUpdated);

        return () => {
            socket.off('group message', handleGroupMessage);
            socket.off('group member joined', handleMemberJoined);
            socket.off('group member left', handleMemberLeft);
            socket.off('group updated', handleGroupUpdated);
        };
    }, [socket, selectedGroup, fetchMembers]);

    const clearError = () => setError(null);

    return {
        groups,
        selectedGroup,
        setSelectedGroup,
        members,
        messages,
        loadingGroups,
        loadingMessages,
        error,
        errorMessage,
        fetchGroups,
        fetchMembers,
        createGroup,
        addMember,
        removeMember,
        changeMemberRole,
        sendMessage,
        clearError,
    };
}