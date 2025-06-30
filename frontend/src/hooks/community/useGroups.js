import { useState, useEffect, useCallback } from 'react';
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

    // Fetch functions
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

        // Usar cache se disponível
        if (membersCache[groupId]) {
            setMembers(membersCache[groupId]);
            return;
        }

        try {
            const { data } = await api.get(`/groups/${groupId}/members`);
            setMembers(data);
            setMembersCache(prev => ({ ...prev, [groupId]: data }));
        } catch {
            setError('Erro ao carregar membros');
        }
    }, [membersCache]);

    const fetchMessages = useCallback(async (groupId) => {
        if (!groupId) return;

        // Usar cache se disponível
        if (messagesCache[groupId]) {
            setMessages(messagesCache[groupId]);
            return;
        }

        setLoadingMessages(true);
        setErrorMessage(null);
        try {
            const { data } = await api.get(`/groups/${groupId}/messages`);
            setMessages(data);
            setMessagesCache(prev => ({ ...prev, [groupId]: data }));
        } catch {
            setErrorMessage('Erro ao carregar mensagens');
        } finally {
            setLoadingMessages(false);
        }
    }, [messagesCache]);

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    // CRUD operations
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

    const updateGroup = useCallback(async (groupId, data) => {
        try {
            const { data: updatedGroup } = await api.put(`/groups/${groupId}`, data);
            setGroups(prev => prev.map(group =>
                group.id === groupId ? { ...group, ...updatedGroup } : group
            ));

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

    // Member operations
    const addMember = useCallback(async (groupId, userId) => {
        try {
            await api.post(`/groups/${groupId}/members`, { userId });
            // Invalida cache ao adicionar novo membro
            setMembersCache(prev => ({ ...prev, [groupId]: undefined }));
            await fetchMembers(groupId);
            setError(null);
        } catch (err) {
            setError('Erro ao adicionar membro');
            throw err;
        }
    }, [fetchMembers]);

    const removeMember = useCallback(async (groupId, userId) => {
        try {
            await api.delete(`/groups/${groupId}/members/${userId}`);
            // Invalida cache ao remover membro
            setMembersCache(prev => ({ ...prev, [groupId]: undefined }));
            await fetchMembers(groupId);
            setError(null);
        } catch (err) {
            setError('Erro ao remover membro');
            throw err;
        }
    }, [fetchMembers]);

    const changeMemberRole = useCallback(async (groupId, userId, role) => {
        try {
            await api.put(`/groups/${groupId}/members/${userId}/role`, { role });
            // Invalida cache ao alterar papel
            setMembersCache(prev => ({ ...prev, [groupId]: undefined }));
            await fetchMembers(groupId);
            setError(null);
        } catch (err) {
            setError('Erro ao alterar papel do membro');
            throw err;
        }
    }, [fetchMembers]);

    const sendMessage = useCallback(async (groupId, content) => {
        try {
            await api.post(`/groups/${groupId}/messages`, { content });
            setErrorMessage(null);
        } catch (err) {
            setErrorMessage('Erro ao enviar mensagem');
            throw err;
        }
    }, []);

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

    // Socket listeners
    useEffect(() => {
        if (!socket || !selectedGroup) return;

        const handleGroupMessage = (msg) => {
            if (msg.groupId === selectedGroup.id) {
                setMessages(prev => [...prev, msg]);
                // Atualiza cache de mensagens
                setMessagesCache(prev => ({
                    ...prev,
                    [msg.groupId]: [...(prev[msg.groupId] || []), msg]
                }));
            }
        };

        const handleMemberJoined = (data) => {
            if (data.groupId === selectedGroup.id) {
                // Invalida cache de membros
                setMembersCache(prev => ({ ...prev, [data.groupId]: undefined }));
                fetchMembers(selectedGroup.id);
            }
        };

        const handleMemberLeft = (data) => {
            if (data.groupId === selectedGroup.id) {
                // Invalida cache de membros
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

    // Initialize
    useEffect(() => {
        fetchGroups();
        fetchUsers();
    }, [fetchGroups, fetchUsers]);

    // Fetch data when group is selected
    useEffect(() => {
        if (selectedGroup) {
            fetchMembers(selectedGroup.id);
            fetchMessages(selectedGroup.id);
        }
    }, [selectedGroup, fetchMembers, fetchMessages]);

    // Clear error functions
    const clearError = useCallback(() => setError(null), []);
    const clearErrorMessage = useCallback(() => setErrorMessage(null), []);

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