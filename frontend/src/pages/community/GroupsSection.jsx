import React, { useRef, useEffect, useState } from 'react';
import { useGroups } from '@/hooks/community/useGroups';
import { useAuth } from '@/context/useAuth';
import {
    Users,
    MessageSquare,
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Search,
    CheckCheck,
    AlertCircle,
    X,
    Smile,
    Send
} from 'lucide-react';
import GroupModal from '@/components/community/GroupModal';
import MembersModal from '@/components/community/MembersModal';
import '@/components/scrollbar.css';

export default function GroupsSection() {
    const { token } = useAuth();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const {
        groups,
        selectedGroup,
        setSelectedGroup,
        members,
        messages,
        filteredUsers,
        loadingGroups,
        loadingMessages,
        loadingUsers,
        error,
        errorMessage,
        clearError,
        clearErrorMessage,
        isGroupModalOpen,
        editingGroup,
        newMessage,
        setNewMessage,
        userQuery,
        setUserQuery,
        selectedUserId,
        currentUserId,
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

    // Auto-scroll para última mensagem
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Fechar emoji picker ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    // Função para obter o nome do remetente
    const getSenderName = (senderUserId) => {
        if (senderUserId === currentUserId) {
            return 'Você';
        }

        const member = members.find(m => m.userId === senderUserId);
        return member?.user?.name || member?.User?.name || 'Usuário Desconhecido';
    };

    // Função para obter as iniciais do nome
    const getInitials = (name) => {
        if (!name || name === 'Você') return 'V';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Função para gerar cor baseada no nome (tons de azul)
    const getAvatarColor = (senderUserId) => {
        if (senderUserId === currentUserId) {
            return 'bg-blue-600';
        }

        const colors = [
            'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-indigo-500',
            'bg-indigo-600', 'bg-sky-500', 'bg-sky-600', 'bg-cyan-500'
        ];

        const index = senderUserId % colors.length;
        return colors[index];
    };

    // Emojis básicos
    const emojis = ['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯'];

    const handleEmojiClick = (emoji) => {
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    return (
        <section className="flex flex-col h-full">
            {/* Header */}
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Grupos</h2>
                <button
                    onClick={handleCreateGroup}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition font-semibold text-white"
                >
                    Criar Grupo
                </button>
            </header>

            {/* Notificações de erro */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-sm underline hover:no-underline ml-4">
                        Fechar
                    </button>
                </div>
            )}

            {/* Layout principal */}
            <div className="flex flex-1 gap-6 min-h-0">
                {/* Lista de grupos - Estilo igual ao FriendsSection */}
                <aside className="w-1/4 flex flex-col">
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Seus Grupos</h3>

                    {loadingGroups && (
                        <p className="text-gray-400 italic px-3">Carregando grupos...</p>
                    )}

                    <ul className="space-y-1 flex-1 overflow-y-auto scrollbar-dark scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
                        {groups.length === 0 && !loadingGroups && (
                            <p className="text-gray-400 italic px-3 py-2">Nenhum grupo encontrado.</p>
                        )}

                        {groups.map((group) => (
                            <li
                                key={group.id}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition ${selectedGroup?.id === group.id
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                                    }`}
                                onClick={() => setSelectedGroup(group)}
                            >
                                <div className={`rounded-full w-10 h-10 flex items-center justify-center mr-3 ${selectedGroup?.id === group.id
                                    ? 'bg-blue-500'
                                    : 'bg-blue-600'
                                    }`}>
                                    <MessageSquare size={20} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">
                                        {group.name}
                                    </h4>
                                    {group.description && (
                                        <p className={`text-sm mt-1 truncate ${selectedGroup?.id === group.id
                                            ? 'text-blue-100'
                                            : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {group.description}
                                        </p>
                                    )}
                                </div>

                                {/* Botões de ação no hover */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditGroup(group);
                                            }}
                                            className="p-1 rounded hover:bg-black/10 transition-colors"
                                        >
                                            <Edit2 size={12} className="text-current" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteGroup(group.id);
                                            }}
                                            className="p-1 rounded hover:bg-red-500/20 transition-colors"
                                        >
                                            <Trash2 size={12} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Container de chat - Estilo igual ao FriendsSection */}
                <main className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {selectedGroup ? (
                        <>
                            {/* Header do chat */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setSelectedGroup(null)}
                                        className="mr-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition md:hidden"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                        <MessageSquare size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {selectedGroup.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {members.length} {members.length === 1 ? 'membro' : 'membros'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                        <Search size={20} className="text-gray-600 dark:text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => setShowMembersModal(true)}
                                        className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                    >
                                        <Users size={16} />
                                        Membros
                                    </button>
                                </div>
                            </div>

                            {/* Container de mensagens */}
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 overflow-y-auto p-4 scrollbar-dark scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent"
                                style={{
                                    height: 'calc(100vh - 280px)',
                                    maxHeight: 'calc(100vh - 280px)',
                                    minHeight: '300px'
                                }}
                            >
                                {loadingMessages ? (
                                    <p className="text-gray-400 italic text-center py-4">Carregando mensagens...</p>
                                ) : messages.length === 0 ? (
                                    <p className="text-gray-400 italic text-center py-4">
                                        Nenhuma mensagem ainda. Comece a conversa!
                                    </p>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isOwn = msg.senderUserId === currentUserId;
                                        const isConsecutive = idx > 0 && messages[idx - 1].senderUserId === msg.senderUserId;
                                        const senderName = getSenderName(msg.senderUserId);
                                        const showAvatar = !isConsecutive || idx === messages.length - 1;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'
                                                    }`}
                                            >
                                                {/* Avatar para mensagens de outros usuários */}
                                                {!isOwn && (
                                                    <div className="flex flex-col items-center mr-2">
                                                        {showAvatar ? (
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(msg.senderUserId)}`}>
                                                                {getInitials(senderName)}
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8"></div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={`max-w-[70%] ${isOwn ? 'ml-auto' : ''}`}>
                                                    {/* Nome do remetente */}
                                                    {!isOwn && !isConsecutive && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">
                                                            {senderName}
                                                        </p>
                                                    )}

                                                    <div
                                                        className={`p-3 rounded-lg shadow-sm break-words whitespace-pre-wrap ${isOwn
                                                            ? 'bg-blue-600 text-white rounded-br-md'
                                                            : 'bg-gray-700 text-white rounded-bl-md'
                                                            }`}
                                                    >
                                                        <p>{msg.content}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-xs text-gray-300">
                                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </span>
                                                            {isOwn && (
                                                                <div className="flex items-center space-x-1">
                                                                    {msg.sending ? (
                                                                        <div className="flex space-x-1">
                                                                            <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
                                                                            <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                                                            <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                                        </div>
                                                                    ) : (
                                                                        <CheckCheck size={14} className="text-blue-200" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Espaço para avatar nas mensagens próprias */}
                                                {isOwn && (
                                                    <div className="w-8 ml-2"></div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input de mensagem - Scroll removido */}
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                                {errorMessage && (
                                    <div className="text-red-500 mb-2 flex justify-between items-center">
                                        <span>{errorMessage}</span>
                                        <button onClick={clearErrorMessage} className="underline text-sm">
                                            Fechar
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 relative">
                                    <textarea
                                        rows={1}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Digite sua mensagem..."
                                        className="flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                                        style={{
                                            height: '44px',
                                            minHeight: '44px',
                                            maxHeight: '44px',
                                            lineHeight: '1.2'
                                        }}
                                    />

                                    {/* Botão de emoji */}
                                    <div className="relative emoji-picker-container">
                                        <button
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex-shrink-0"
                                        >
                                            <Smile size={20} className="text-gray-600 dark:text-gray-300" />
                                        </button>

                                        {/* Picker de emoji */}
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-xl z-10 min-w-[280px]">
                                                <div className="grid grid-cols-8 gap-1">
                                                    {emojis.map((emoji, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleEmojiClick(emoji)}
                                                            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl"
                                                            title={`Adicionar ${emoji}`}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botão de enviar */}
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-600 rounded-full transition-colors disabled:cursor-not-allowed flex-shrink-0"
                                    >
                                        <Send size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Estado inicial
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                            <MessageSquare size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-xl text-center text-gray-500 dark:text-gray-400">
                                Selecione um grupo para começar a conversar
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Modais */}
            <GroupModal
                isOpen={isGroupModalOpen}
                onClose={handleCloseGroupModal}
                onSubmit={handleSubmitGroup}
                editingGroup={editingGroup}
                error={error}
            />

            <MembersModal
                isOpen={showMembersModal}
                onClose={() => setShowMembersModal(false)}
                members={members}
                selectedGroup={selectedGroup}
                userQuery={userQuery}
                setUserQuery={setUserQuery}
                filteredUsers={filteredUsers}
                loadingUsers={loadingUsers}
                selectedUserId={selectedUserId}
                handleSelectUser={handleSelectUser}
                handleAddMember={handleAddMember}
                handleChangeMemberRole={handleChangeMemberRole}
                handleRemoveMemberConfirm={handleRemoveMemberConfirm}
            />
        </section>
    );
}
