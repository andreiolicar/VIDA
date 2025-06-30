import React, { useRef, useEffect } from 'react';
import { useGroups } from '@/hooks/community/useGroups';
import { useAuth } from '@/context/useAuth';
import GroupModal from '@/components/community/GroupModal';

export default function GroupsSection() {
    const { token, user } = useAuth();
    const messagesEndRef = useRef(null);

    const {
        // Data
        groups,
        selectedGroup,
        setSelectedGroup,
        members,
        messages,
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
        userQuery,
        setUserQuery,
        selectedUserId,

        // Handlers
        handleCreateGroup,
        handleEditGroup,
        handleCloseGroupModal,
        handleSubmitGroup,
        handleSendMessage,
        handleKeyDown,
        handleAddMember,
        handleChangeMemberRole,
        handleSelectUser,
        handleDeleteGroup,
        handleRemoveMemberConfirm,
    } = useGroups(token);

    // Auto-scroll to last message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <section className="flex flex-col h-full">
            {/* Header */}
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Grupos</h2>
                <button
                    onClick={handleCreateGroup}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
                >
                    Criar Grupo
                </button>
            </header>

            {/* Error notifications */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-sm underline hover:no-underline ml-4">
                        Fechar
                    </button>
                </div>
            )}

            {/* Loading groups */}
            {loadingGroups && (
                <div className="mb-4 p-3 bg-blue-900/50 border border-blue-500 rounded text-blue-200">
                    Carregando grupos...
                </div>
            )}

            {/* Main layout */}
            <div className="flex flex-1 gap-6 min-h-0">
                {/* Groups list */}
                <aside className="w-1/4 overflow-y-auto bg-[#1f2937] rounded p-4">
                    <h3 className="font-semibold mb-3">Meus Grupos</h3>
                    {groups.length === 0 && !loadingGroups && (
                        <p className="text-gray-400 italic">Nenhum grupo encontrado.</p>
                    )}
                    <ul className="space-y-2">
                        {groups.map((group) => (
                            <li
                                key={group.id}
                                className={`cursor-pointer p-3 rounded transition ${selectedGroup?.id === group.id
                                    ? 'bg-blue-700 text-white'
                                    : 'hover:bg-blue-600 text-gray-300'
                                    }`}
                            >
                                <div onClick={() => setSelectedGroup(group)}>
                                    <h4 className="font-medium">{group.name}</h4>
                                    {group.description && (
                                        <p className="text-sm text-gray-400 mt-1 truncate">
                                            {group.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditGroup(group);
                                        }}
                                        className="text-xs bg-yellow-600 px-2 py-1 rounded hover:bg-yellow-700 transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteGroup(group.id);
                                        }}
                                        className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition"
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main content */}
                {selectedGroup ? (
                    <main className="flex flex-1 gap-6 min-h-0">
                        {/* Group chat */}
                        <div className="flex-1 flex flex-col bg-[#1a2332] rounded p-4 min-h-0">
                            <h3 className="text-xl font-semibold mb-4">{selectedGroup.name}</h3>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                                {loadingMessages && (
                                    <p className="text-gray-400 italic">Carregando mensagens...</p>
                                )}

                                {!loadingMessages && messages.length === 0 && (
                                    <p className="text-gray-400 italic">
                                        Nenhuma mensagem ainda. Comece a conversa!
                                    </p>
                                )}

                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`max-w-[80%] p-3 rounded-lg shadow-sm break-words whitespace-pre-wrap ${msg.senderUserId === user.id
                                                ? 'bg-blue-600 text-white self-end rounded-br-md ml-auto'
                                                : 'bg-gray-700 text-white self-start rounded-bl-md'
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <span className="text-xs text-gray-300 mt-1 block text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message error */}
                            {errorMessage && (
                                <div className="text-red-500 mb-2 flex justify-between items-center">
                                    <span>{errorMessage}</span>
                                    <button onClick={clearErrorMessage} className="underline text-sm">
                                        Fechar
                                    </button>
                                </div>
                            )}

                            {/* Message input */}
                            <div className="flex gap-2">
                                <textarea
                                    rows={2}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>

                        {/* Members list */}
                        <div className="w-1/3 bg-[#1f2937] rounded p-4 flex flex-col max-h-full">
                            <h4 className="text-lg font-semibold mb-4">Membros ({members.length})</h4>

                            {/* Members list */}
                            <div className="flex flex-col gap-2 overflow-y-auto flex-1 mb-4">
                                {members.length === 0 && (
                                    <p className="text-gray-400 italic">Nenhum membro encontrado.</p>
                                )}

                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between bg-gray-700 rounded p-2"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">
                                                {member.User?.name || 'Usuário'}
                                            </p>
                                            <p className="text-sm text-gray-400 truncate">
                                                {member.User?.email || ''}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 ml-2">
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleChangeMemberRole(member.userId, e.target.value)}
                                                className="bg-gray-600 rounded px-2 py-1 text-sm"
                                            >
                                                <option value="owner">Owner</option>
                                                <option value="admin">Admin</option>
                                                <option value="member">Membro</option>
                                            </select>

                                            <button
                                                onClick={() => handleRemoveMemberConfirm(member.userId)}
                                                className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition text-sm"
                                                title="Remover membro"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add new member */}
                            <div className="border-t border-gray-600 pt-4">
                                <h5 className="font-semibold mb-2">Convidar novo membro</h5>

                                {/* User search */}
                                <div className="mb-2">
                                    <input
                                        type="search"
                                        value={userQuery}
                                        onChange={(e) => setUserQuery(e.target.value)}
                                        placeholder="Buscar usuário por nome ou email"
                                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    {loadingUsers && (
                                        <p className="text-gray-400 mt-2 text-sm">Carregando usuários...</p>
                                    )}

                                    {!loadingUsers && filteredUsers.length > 0 && (
                                        <ul className="max-h-32 overflow-y-auto mt-2 bg-gray-800 rounded border border-gray-600">
                                            {filteredUsers.map((user) => (
                                                <li
                                                    key={user.id}
                                                    onClick={() => handleSelectUser(user)}
                                                    className={`cursor-pointer px-3 py-2 hover:bg-blue-600 text-sm ${selectedUserId === user.id ? 'bg-blue-700 font-semibold' : ''
                                                        }`}
                                                >
                                                    <p className="truncate">
                                                        {user.name} <span className="text-gray-400">({user.email})</span>
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <button
                                    onClick={handleAddMember}
                                    disabled={!selectedUserId}
                                    className="w-full bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Convidar
                                </button>
                            </div>
                        </div>
                    </main>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-gray-400 italic">
                        Selecione um grupo para visualizar os detalhes
                    </div>
                )}
            </div>

            {/* Create/edit group modal */}
            <GroupModal
                isOpen={isGroupModalOpen}
                onClose={handleCloseGroupModal}
                onSubmit={handleSubmitGroup}
                editingGroup={editingGroup}
                error={error}
            />
        </section>
    );
}