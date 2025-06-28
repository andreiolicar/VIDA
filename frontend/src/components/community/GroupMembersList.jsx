import React, { useState } from 'react';
import { useGroups } from '@/hooks/community/useGroups';
import UserSearch from '@/components/community/UserSearch';

export default function GroupMembersList({ groupId }) {
    const {
        members,
        fetchMembers,
        addMember,
        removeMember,
        changeMemberRole,
        error,
        clearError,
    } = useGroups();

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAddMember = async () => {
        if (!selectedUserId) return;
        setLoading(true);
        try {
            await addMember(groupId, selectedUserId);
            setSelectedUserId(null);
            await fetchMembers(groupId);
            clearError();
        } catch {
            // erro tratado no hook
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-1/3 bg-[#1f2937] rounded p-4 flex flex-col max-h-full">
            <h4 className="text-lg font-semibold mb-4">Membros</h4>

            {error && (
                <div className="mb-2 text-red-500 flex justify-between items-center">
                    <span>{error}</span>
                    <button
                        onClick={clearError}
                        className="text-sm underline hover:no-underline ml-4"
                        aria-label="Fechar mensagem de erro"
                    >
                        Fechar
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                {members.length === 0 && (
                    <p className="text-gray-400 italic">Nenhum membro encontrado.</p>
                )}

                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center justify-between bg-gray-700 rounded p-2"
                    >
                        <div>
                            <p className="font-semibold">{member.User?.name || 'Usuário'}</p>
                            <p className="text-sm text-gray-400">{member.User?.email || ''}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                aria-label={`Papel do membro ${member.User?.name || ''}`}
                                value={member.role}
                                onChange={async (e) => {
                                    await changeMemberRole(groupId, member.userId, e.target.value);
                                    await fetchMembers(groupId);
                                }}
                                className="bg-gray-600 rounded px-2 py-1 text-sm"
                            >
                                <option value="owner">Owner</option>
                                <option value="admin">Admin</option>
                                <option value="member">Membro</option>
                            </select>

                            <button
                                onClick={async () => {
                                    await removeMember(groupId, member.userId);
                                    await fetchMembers(groupId);
                                }}
                                className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition text-sm"
                                title="Remover membro"
                                aria-label={`Remover membro ${member.User?.name || ''}`}
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 border-t border-gray-600 pt-4">
                <h5 className="font-semibold mb-2">Convidar novo membro</h5>

                <UserSearch
                    selectedUserId={selectedUserId}
                    setSelectedUserId={setSelectedUserId}
                    placeholder="Buscar usuário por nome ou email"
                />

                <button
                    onClick={handleAddMember}
                    disabled={!selectedUserId || loading}
                    className="mt-2 w-full bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Convidando...' : 'Convidar'}
                </button>
            </div>
        </div>
    );
}
