import React, { useState, useEffect } from 'react';
import api from '@/services/axios';

export default function UserSearch({ selectedUserId, setSelectedUserId, placeholder = 'Buscar usuário' }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Buscar usuários do backend (ajuste a rota conforme seu backend)
    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/users'); // ajuste a rota para buscar usuários
                setUsers(res.data);
                setFilteredUsers(res.data);
            } catch (err) {
                setError('Erro ao carregar usuários');
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    // Filtrar usuários conforme a query
    useEffect(() => {
        if (!query.trim()) {
            setFilteredUsers(users);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = users.filter(
            (user) =>
                (user.name && user.name.toLowerCase().includes(lowerQuery)) ||
                (user.email && user.email.toLowerCase().includes(lowerQuery))
        );
        setFilteredUsers(filtered);
    }, [query, users]);

    return (
        <div className="flex flex-col">
            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={placeholder}
            />

            {loading && <p className="text-gray-400 mt-2">Carregando usuários...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {!loading && !error && (
                <ul className="max-h-48 overflow-y-auto mt-2 bg-gray-800 rounded border border-gray-600">
                    {filteredUsers.length === 0 && (
                        <li className="p-2 text-gray-400 italic">Nenhum usuário encontrado.</li>
                    )}
                    {filteredUsers.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => setSelectedUserId(user.id)}
                            className={`cursor-pointer px-3 py-2 hover:bg-blue-600 ${selectedUserId === user.id ? 'bg-blue-700 font-semibold' : ''
                                }`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setSelectedUserId(user.id);
                                }
                            }}
                        >
                            <p className="truncate">{user.name} <span className="text-sm text-gray-400">({user.email})</span></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}