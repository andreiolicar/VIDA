import React, { useState, useEffect } from 'react';
import { X, Users, Image, AlertCircle } from 'lucide-react';

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                {/* Header do Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 rounded-full p-2">
                            <Users size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {editingGroup ? 'Editar Grupo' : 'Criar Novo Grupo'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Conteúdo do Modal */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Mensagem de Erro */}
                    {(localError || error) && (
                        <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <AlertCircle size={16} className="text-red-500 mr-2 flex-shrink-0" />
                            <span className="text-red-700 dark:text-red-300 text-sm">
                                {localError || error}
                            </span>
                        </div>
                    )}

                    {/* Campo Nome do Grupo */}
                    <div className="space-y-2">
                        <label
                            htmlFor="groupName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Nome do Grupo *
                        </label>
                        <input
                            id="groupName"
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Digite o nome do grupo"
                            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Campo Descrição */}
                    <div className="space-y-2">
                        <label
                            htmlFor="groupDescription"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Descrição
                        </label>
                        <textarea
                            id="groupDescription"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            placeholder="Descreva o propósito do grupo (opcional)"
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
                        />
                    </div>

                    {/* Campo URL da Imagem */}
                    <div className="space-y-2">
                        <label
                            htmlFor="groupImageUrl"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                            <Image size={16} className="mr-2" />
                            URL da Imagem
                        </label>
                        <input
                            id="groupImageUrl"
                            type="url"
                            value={groupImageUrl}
                            onChange={(e) => setGroupImageUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg (opcional)"
                            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    {/* Preview da Imagem */}
                    {groupImageUrl && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Preview da Imagem
                            </label>
                            <div className="flex justify-center">
                                <img
                                    src={groupImageUrl}
                                    alt="Preview do grupo"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!groupName.trim()}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {editingGroup ? 'Salvar Alterações' : 'Criar Grupo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
