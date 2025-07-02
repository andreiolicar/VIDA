import React from 'react';
import { X } from 'lucide-react';

export default function MembersModal({
    isOpen,
    onClose,
    members,
    selectedGroup,
    userQuery,
    setUserQuery,
    filteredUsers,
    loadingUsers,
    selectedUserId,
    handleSelectUser,
    handleAddMember,
    handleChangeMemberRole,
    handleRemoveMemberConfirm
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        Membros do Grupo - {selectedGroup?.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Lista de Membros */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                        Membros ({members.length})
                    </h3>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {members.length === 0 ? (
                            <p className="text-gray-400 italic">Nenhum membro encontrado.</p>
                        ) : (
                            members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between bg-gray-700 rounded p-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate text-white">
                                            {member.user?.name || 'Usuário'}
                                        </p>
                                        <p className="text-sm text-gray-400 truncate">
                                            {member.user?.email || ''}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 ml-3">
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleChangeMemberRole(member.userId, e.target.value)}
                                            className="bg-gray-600 rounded px-2 py-1 text-sm text-white"
                                        >
                                            <option value="owner">Owner</option>
                                            <option value="admin">Admin</option>
                                            <option value="member">Membro</option>
                                        </select>

                                        <button
                                            onClick={() => handleRemoveMemberConfirm(member.userId)}
                                            className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition text-sm text-white"
                                            title="Remover membro"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Adicionar Novo Membro */}
                <div className="border-t border-gray-600 pt-4">
                    <h3 className="text-lg font-semibold mb-4 text-white">
                        Convidar novo membro
                    </h3>

                    {/* Campo de busca */}
                    <div className="mb-4">
                        <input
                            type="search"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder="Buscar usuário por nome ou email"
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {loadingUsers && (
                            <p className="text-gray-400 mt-2 text-sm">Carregando usuários...</p>
                        )}

                        {!loadingUsers && filteredUsers.length > 0 && (
                            <div className="max-h-40 overflow-y-auto mt-2 bg-gray-700 rounded border border-gray-600">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleSelectUser(user)}
                                        className={`cursor-pointer px-3 py-2 hover:bg-blue-600 text-sm transition ${selectedUserId === user.id ? 'bg-blue-700 font-semibold' : ''
                                            }`}
                                    >
                                        <p className="truncate text-white">
                                            {user.name} <span className="text-gray-400">({user.email})</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAddMember}
                        disabled={!selectedUserId}
                        className="w-full bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
                    >
                        Convidar
                    </button>
                </div>
            </div>
        </div>
    );
}