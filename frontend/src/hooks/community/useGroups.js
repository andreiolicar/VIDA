import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/services/axios';
import { useSocket } from '@/hooks/useSocket';

export function useGroups(token) {
    const socket = useSocket(token);

    // Estados principais
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    // Cache de membros e mensagens
    const [membersCache, setMembersCache] = useState({});
    const [messagesCache, setMessagesCache] = useState({});

    // Estados de loading
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Estados de erro
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Estados da UI
    const [isGroupModalOpen, setGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userQuery, setUserQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    // ✅ MOVER PARA AQUI - Logo após os estados
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

    // Fetch groups
    const fetchGroups = useCallback(async () => {
        setLoadingGroups(true);
        setError(null);
        try {
            const { data } = await api.get('/groups');
            setGroups(data);
        } catch {
            setError('Erro ao carregar grupos');
        } finally {
            setLoadingGroups(false);
        }
    }, []);

    const fetchMembers = useCallback(async (groupId) => {
        if (!groupId) return;

        try {
            const { data } = await api.get(`/groups/${groupId}/members`);
            setMembers(data);
            // Atualiza o cache diretamente
            setMembersCache(prev => ({ ...prev, [groupId]: data }));
        } catch {
            setError('Erro ao carregar membros');
        }
    }, []);

    const fetchMessages = useCallback(async (groupId) => {
        if (!groupId) return;
        setLoadingMessages(true);
        try {
            const { data } = await api.get(`/groups/${groupId}/messages`);

            // Normalizar dados das mensagens (igual ao useMessages)
            const formattedMessages = data.map(msg => ({
                ...msg,
                senderUserId: msg.senderUserId || msg.fromUserId || msg.userId,
                timestamp: msg.timestamp || msg.createdAt,
            }));

            setMessages(formattedMessages);
            setMessagesCache(prev => ({ ...prev, [groupId]: formattedMessages }));
        } catch {
            setErrorMessage('Erro ao carregar mensagens');
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    // Fetch all users
    const fetchUsers = useCallback(async (query = "") => {
        setLoadingUsers(true);
        try {
            const { data } = await api.get(`/groups/search/users?q=${encodeURIComponent(query)}`);
            setFilteredUsers(data);
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    // Create group
    const createGroup = useCallback(async (data) => {
        try {
            const { data: newGroup } = await api.post('/groups', data);
            setGroups(prev => [...prev, newGroup]);
            setError(null);
            return newGroup;
        } catch (err) {
            setError('Erro ao criar grupo');
            throw err;
        }
    }, []);

    // Update group
    const updateGroup = useCallback(async (groupId, data) => {
        try {
            const { data: updatedGroup } = await api.put(`/groups/${groupId}`, data);
            setGroups(prev => prev.map(group => (group.id === groupId ? { ...group, ...updatedGroup } : group)));
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(prev => ({ ...prev, ...updatedGroup }));
            }
            setError(null);
            return updatedGroup;
        } catch (err) {
            setError('Erro ao atualizar grupo');
            throw err;
        }
    }, [selectedGroup]);

    // Delete group
    const deleteGroup = useCallback(async (groupId) => {
        try {
            await api.delete(`/groups/${groupId}`);
            setGroups(prev => prev.filter(group => group.id !== groupId));
            if (selectedGroup?.id === groupId) {
                setSelectedGroup(null);
                setMembers([]);
                setMessages([]);
            }
            setError(null);
        } catch (err) {
            setError('Erro ao deletar grupo');
            throw err;
        }
    }, [selectedGroup]);

    // Add member (invalidate cache)
    const addMember = useCallback(async (groupId, userId) => {
        try {
            await api.post(`/groups/${groupId}/members`, { userId });
            setMembersCache(prev => ({ ...prev, [groupId]: undefined }));
            await fetchMembers(groupId);
            setError(null);
        } catch (err) {
            setError('Erro ao adicionar membro');
            throw err;
        }
    }, [fetchMembers]);

    // Remove member (invalidate cache)
    const removeMember = useCallback(async (groupId, userId) => {
        try {
            await api.delete(`/groups/${groupId}/members/${userId}`);
            setMembersCache(prev => ({ ...prev, [groupId]: undefined }));
            await fetchMembers(groupId);
            setError(null);
        } catch (err) {
            setError('Erro ao remover membro');
            throw err;
        }
    }, [fetchMembers]);

    // Change member role (invalidate cache)
    const changeMemberRole = useCallback(async (groupId, userId, role) => {
        try {
            await api.put(`/groups/${groupId}/members/${userId}/role`, { role });
            setMembersCache(prev => ({ ...prev, [groupId]: undefined }));
            await fetchMembers(groupId);
            setError(null);
        } catch (err) {
            setError('Erro ao alterar papel do membro');
            throw err;
        }
    }, [fetchMembers]);

    // Função sendMessage para adicionar mensagem localmente
    const sendMessage = useCallback(async (groupId, content) => {
        if (!currentUserId) return;

        try {
            const tempMessage = {
                id: `temp-${Date.now()}`,
                groupId,
                senderUserId: currentUserId,
                content,
                timestamp: new Date().toISOString(),
                read: false,
                sending: true
            };

            setMessages(prev => [...prev, tempMessage]);

            const response = await api.post(`/groups/${groupId}/messages`, { content });

            const normalizedResponse = {
                ...response.data,
                senderUserId: response.data.senderUserId || response.data.fromUserId || currentUserId,
                timestamp: response.data.createdAt || response.data.timestamp, // corrigido: fallback 
            };

            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id ? normalizedResponse : msg
            ));

            setErrorMessage(null);
        } catch (err) {
            setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
            setErrorMessage('Erro ao enviar mensagem');
            throw err;
        }
    }, [currentUserId]);

    // UI Handlers
    const handleCreateGroup = useCallback(() => {
        setEditingGroup(null);
        setGroupModalOpen(true);
    }, []);

    const handleEditGroup = useCallback((group) => {
        setEditingGroup(group);
        setGroupModalOpen(true);
    }, []);

    const handleCloseGroupModal = useCallback(() => {
        setGroupModalOpen(false);
        setEditingGroup(null);
        setError(null);
    }, []);

    const handleSubmitGroup = useCallback(async (groupData, groupId) => {
        if (groupId) {
            await updateGroup(groupId, groupData);
        } else {
            await createGroup(groupData);
        }
    }, [updateGroup, createGroup]);

    const handleSendMessage = useCallback(() => {
        if (newMessage.trim() && selectedGroup) {
            sendMessage(selectedGroup.id, newMessage.trim());
            setNewMessage('');
        }
    }, [newMessage, selectedGroup, sendMessage]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleAddMember = useCallback(async () => {
        if (!selectedUserId || !selectedGroup) return;
        try {
            await addMember(selectedGroup.id, selectedUserId);
            setSelectedUserId(null);
            setUserQuery('');
        } catch (err) {
            console.error('Erro ao adicionar membro:', err);
        }
    }, [selectedUserId, selectedGroup, addMember]);

    const handleRemoveMember = useCallback(async (userId) => {
        if (!selectedGroup) return;
        try {
            await removeMember(selectedGroup.id, userId);
        } catch (err) {
            console.error('Erro ao remover membro:', err);
        }
    }, [selectedGroup, removeMember]);

    const handleChangeMemberRole = useCallback(async (userId, role) => {
        if (!selectedGroup) return;
        try {
            await changeMemberRole(selectedGroup.id, userId, role);
        } catch (err) {
            console.error('Erro ao alterar papel:', err);
        }
    }, [selectedGroup, changeMemberRole]);

    const handleSelectUser = useCallback((user) => {
        setSelectedUserId(user.id);
        setUserQuery(`${user.name} (${user.email})`);
    }, []);

    const handleDeleteGroup = useCallback((groupId) => {
        if (confirm('Tem certeza que deseja deletar este grupo?')) {
            deleteGroup(groupId);
        }
    }, [deleteGroup]);

    const handleRemoveMemberConfirm = useCallback((userId) => {
        if (confirm('Tem certeza que deseja remover este membro?')) {
            handleRemoveMember(userId);
        }
    }, [handleRemoveMember]);

    // Clear error functions
    const clearError = useCallback(() => setError(null), []);
    const clearErrorMessage = useCallback(() => setErrorMessage(null), []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Socket listeners
    useEffect(() => {
        if (!socket || !selectedGroup) return;

        const handleGroupMessage = (msg) => {
            if (msg.groupId === selectedGroup.id) {
                // Normalizar mensagem do socket
                const normalizedMsg = {
                    ...msg,
                    senderUserId: msg.senderUserId || msg.fromUserId || msg.userId,
                    timestamp: msg.createdAt || msg.timestamp, // createdAt primeiro
                };

                setMessages(prev => [...prev, normalizedMsg]);
                setMessagesCache(prev => ({
                    ...prev,
                    [msg.groupId]: [...(prev[msg.groupId] || []), normalizedMsg]
                }));
            }
        };

        const handleMemberJoined = (data) => {
            if (data.groupId === selectedGroup.id) {
                setMembersCache(prev => ({ ...prev, [data.groupId]: undefined }));
                fetchMembers(selectedGroup.id);
            }
        };

        const handleMemberLeft = (data) => {
            if (data.groupId === selectedGroup.id) {
                setMembersCache(prev => ({ ...prev, [data.groupId]: undefined }));
                fetchMembers(selectedGroup.id);
            }
        };

        const handleGroupUpdated = (data) => {
            if (data.groupId === selectedGroup.id) {
                setSelectedGroup(prev => ({ ...prev, ...data }));
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

    // Busca usuários
    useEffect(() => {
        if (userQuery.trim() !== '') {
            fetchUsers(userQuery);
        } else {
            setFilteredUsers([]);
        }
    }, [userQuery, fetchUsers]);

    // Carrega membros e mensagens ao selecionar grupo
    useEffect(() => {
        if (selectedGroup) {
            fetchMembers(selectedGroup.id);
            fetchMessages(selectedGroup.id);
        }
    }, [selectedGroup]);

    return {
        // Data
        groups,
        selectedGroup,
        setSelectedGroup,
        members,
        messages,
        users,
        filteredUsers,
        // Loading states
        loadingGroups,
        loadingMessages,
        loadingUsers,
        // Error states
        error,
        errorMessage,
        clearError,
        clearErrorMessage,
        // UI states
        isGroupModalOpen,
        editingGroup,
        newMessage,
        setNewMessage,
        selectedUserId,
        userQuery,
        setUserQuery,
        currentUserId,
        // CRUD operations
        createGroup,
        updateGroup,
        deleteGroup,
        addMember,
        removeMember,
        changeMemberRole,
        sendMessage,
        // UI handlers
        handleCreateGroup,
        handleEditGroup,
        handleCloseGroupModal,
        handleSubmitGroup,
        handleSendMessage,
        handleKeyDown,
        handleAddMember,
        handleRemoveMember,
        handleChangeMemberRole,
        handleSelectUser,
        handleDeleteGroup,
        handleRemoveMemberConfirm,
    };
}