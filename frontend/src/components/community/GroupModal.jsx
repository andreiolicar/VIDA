import React, { useState, useEffect } from 'react';

export default function GroupModal({
    isOpen,
    onClose,
    onSubmit,
    editingGroup = null,
    error = ''
}) {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupImageUrl, setGroupImageUrl] = useState('');
    const [localError, setLocalError] = useState('');

    // Resetar formulário quando o modal abrir/fechar ou grupo mudar
    useEffect(() => {
        if (isOpen) {
            if (editingGroup) {
                setGroupName(editingGroup.name || '');
                setGroupDescription(editingGroup.description || '');
                setGroupImageUrl(editingGroup.imageUrl || '');
            } else {
                setGroupName('');
                setGroupDescription('');
                setGroupImageUrl('');
            }
            setLocalError('');
        }
    }, [isOpen, editingGroup]);

    // Fechar modal e limpar dados
    const handleClose = () => {
        setGroupName('');
        setGroupDescription('');
        setGroupImageUrl('');
        setLocalError('');
        onClose();
    };

    // Submeter formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!groupName.trim()) {
            setLocalError('O nome do grupo é obrigatório');
            return;
        }

        setLocalError('');

        const groupData = {
            name: groupName.trim(),
            description: groupDescription,
            imageUrl: groupImageUrl
        };

        try {
            await onSubmit(groupData, editingGroup?.id);
            handleClose();
        } catch (err) {
            console.error('Erro ao salvar grupo:', err);
            setLocalError('Erro ao salvar grupo. Tente novamente.');
        }
    };

    // Não renderizar se modal não estiver aberto
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md text-white shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {editingGroup ? 'Editar Grupo' : 'Criar Grupo'}
                </h2>

                {(localError || error) && (
                    <p className="text-red-500 mb-3">{localError || error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col">
                        Nome <span className="text-red-500">*</span>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="mt-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nome do grupo"
                            required
                            autoFocus
                        />
                    </label>

                    <label className="flex flex-col">
                        Descrição
                        <textarea
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            className="mt-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descrição opcional"
                            rows={3}
                        />
                    </label>

                    <label className="flex flex-col">
                        URL da imagem
                        <input
                            type="url"
                            value={groupImageUrl}
                            onChange={(e) => setGroupImageUrl(e.target.value)}
                            className="mt-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Link para imagem do grupo (opcional)"
                        />
                    </label>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold"
                        >
                            {editingGroup ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}