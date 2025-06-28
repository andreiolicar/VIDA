import React, { useRef, useEffect, useState } from 'react';
import { useGroups } from '@/hooks/community/useGroups';
import { useAuth } from '@/context/useAuth'; // ajuste o caminho

export default function GroupChat({ groupId }) {
    const { token } = useAuth();

    const {
        messages,
        sendMessage,
        loadingMessages,
        fetchMessages,
        errorMessage,
        clearError,
    } = useGroups(token);

    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (groupId && fetchMessages) {
            fetchMessages(groupId);
        }
    }, [groupId, fetchMessages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            sendMessage(groupId, newMessage.trim());
            setNewMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-[#1a2332] rounded p-4 min-h-0 max-h-full">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {loadingMessages && <p className="text-gray-400 italic">Carregando mensagens...</p>}

                {!loadingMessages && messages.length === 0 && (
                    <p className="text-gray-400 italic">Nenhuma mensagem ainda. Comece a conversa!</p>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-[80%] p-3 rounded-lg shadow-sm break-words whitespace-pre-wrap ${msg.senderUserId === msg.currentUserId
                                ? 'bg-blue-600 text-white self-end rounded-br-md'
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

            {errorMessage && (
                <div className="text-red-500 mb-2">
                    {errorMessage}{' '}
                    <button onClick={clearError} className="underline">
                        Fechar
                    </button>
                </div>
            )}

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
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}