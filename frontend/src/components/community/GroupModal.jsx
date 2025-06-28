import React, { useState, useEffect } from 'react';
import { useGroups } from '@/hooks/community/useGroups';

export default function GroupModal({ onClose, initialData = null }) {
    const { createGroup, updateGroup, error, clearError } = useGroups();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setImageUrl(initialData.imageUrl || '');
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setLocalError('O nome do grupo é obrigatório');
            return;
        }
        setLocalError('');

        try {
            if (initialData) {
                await updateGroup(initialData.id, { name: name.trim(), description, imageUrl });
            } else {
                await createGroup({ name: name.trim(), description, imageUrl });
            }
            clearError();
            onClose();
        } catch {
            // erro tratado no hook
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-white shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{initialData ? 'Editar Grupo' : 'Criar Grupo'}</h2>

                {(localError || error) && (
                    <p className="text-red-500 mb-3">{localError || error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Nome <span className="text-red-500">*</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nome do grupo"
                            required
                            autoFocus
                        />
                    </label>

                    <label className="flex flex-col">
                        Descrição
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descrição opcional"
                            rows={3}
                        />
                    </label>

                    <label className="flex flex-col">
                        URL da imagem
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="mt-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Link para imagem do grupo (opcional)"
                        />
                    </label>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                clearError();
                                onClose();
                            }}
                            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold"
                        >
                            {initialData ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}