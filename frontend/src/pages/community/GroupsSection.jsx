import React, { useState, useEffect } from 'react';
import { useGroups } from '@/hooks/community/useGroups';
import GroupModal from '@/components/community/GroupModal';
import GroupMembersList from '@/components/community/GroupMembersList';
import GroupChat from '@/components/community/GroupChat';
import LoadingNotification from '@/components/community/LoadingNotification';
import NotificationModal from '@/components/community/NotificationModal';

export default function GroupsSection() {
    const {
        groups,
        loadingGroups,
        error,
        fetchGroups,
        createGroup,
        updateGroup,
        deleteGroup,
        selectedGroup,
        setSelectedGroup,
        members,
        fetchMembers,
        addMember,
        removeMember,
        changeMemberRole,
        messages,
        sendMessage,
        loadingMessages,
        errorMessage,
        clearError,
    } = useGroups();

    const [isGroupModalOpen, setGroupModalOpen] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchMembers(selectedGroup.id);
        }
    }, [selectedGroup]);

    return (
        <section className="flex flex-col h-full">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Grupos</h2>
                <button
                    onClick={() => setGroupModalOpen(true)}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Criar Grupo
                </button>
            </header>

            {loadingGroups && <LoadingNotification message="Carregando grupos..." />}

            {error && (
                <NotificationModal message={error} onClose={() => clearError()} />
            )}

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Lista de grupos */}
                <aside className="w-1/4 overflow-y-auto bg-[#1f2937] rounded p-4">
                    {groups.length === 0 && !loadingGroups && (
                        <p className="text-gray-400 italic">Nenhum grupo encontrado.</p>
                    )}
                    <ul className="space-y-2">
                        {groups.map((group) => (
                            <li
                                key={group.id}
                                onClick={() => setSelectedGroup(group)}
                                className={`cursor-pointer p-3 rounded ${selectedGroup?.id === group.id
                                        ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-600 text-gray-300'
                                    }`}
                            >
                                {group.name}
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Detalhes do grupo selecionado */}
                {selectedGroup ? (
                    <main className="flex flex-col flex-1 min-h-0 bg-[#1e293b] rounded p-4">
                        <h3 className="text-xl font-semibold mb-4">{selectedGroup.name}</h3>

                        <div className="flex flex-1 gap-6 min-h-0">
                            {/* Lista de membros */}
                            <GroupMembersList
                                members={members}
                                addMember={addMember}
                                removeMember={removeMember}
                                changeMemberRole={changeMemberRole}
                                groupId={selectedGroup.id}
                            />

                            {/* Chat do grupo */}
                            <GroupChat
                                messages={messages}
                                sendMessage={sendMessage}
                                loadingMessages={loadingMessages}
                                groupId={selectedGroup.id}
                            />
                        </div>
                    </main>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-gray-400 italic">
                        Selecione um grupo para visualizar os detalhes
                    </div>
                )}
            </div>

            {/* Modal para criar/editar grupo */}
            {isGroupModalOpen && (
                <GroupModal
                    onClose={() => setGroupModalOpen(false)}
                    onSubmit={createGroup}
                />
            )}
        </section>
    );
}