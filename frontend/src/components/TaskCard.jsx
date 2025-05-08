import { Link } from 'react-router-dom';
import { Plus, Trash, Edit } from 'lucide-react';

export default function TaskCard({ task, onDelete, onToggleStatus, onEdit, extraButtons }) {
  // Função para definir a cor da prioridade
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta':
        return 'text-red-500';
      case 'media':
      case 'média':
        return 'text-yellow-400';
      case 'baixa':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Link
      to={`/dashboard/task/${task.id}`}
      className={`relative rounded-2xl p-4 min-h-[180px] min-w-[220px] max-w-[280px] shadow-md hover:shadow-lg transition cursor-pointer flex flex-col group bg-[#1f2937] ${
        task.status === 'feito' ? 'border-2 border-green-500' : ''
      }`}
    >
      <h3 className="text-xl font-semibold mb-2 leading-tight pr-14 line-clamp-2">{task.title}</h3>

      {task.list && (
        <p className="text-sm text-indigo-400 font-medium mb-2 truncate max-w-full">
          Lista: {task.list.title}
        </p>
      )}

      <p className="flex-1 text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap overflow-hidden mb-3 max-h-[4.5rem]">
        {task.description || 'Sem descrição'}
      </p>

      {/* Espaçamento horizontal ajustado entre Prioridade e Status */}
      <div
        className="flex justify-start items-center text-xs text-gray-400 mb-2 gap-x-10 max-w-[180px]"
      >
        <div className="flex flex-col items-start">
          <span className="font-semibold">Prioridade:</span>
          <span className={`font-medium capitalize ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex flex-col items-start">
          <span className="font-semibold">Status:</span>
          <span className="font-medium capitalize">{formatStatus(task.status)}</span>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all max-h-0 opacity-0 pointer-events-none group-hover:max-h-40 group-hover:opacity-100 group-hover:pointer-events-auto"
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        {extraButtons}
      </div>

      <div className="absolute top-3 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit && onEdit(task);
          }}
          title="Editar tarefa"
          className="text-blue-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-label="Editar tarefa"
        >
          <Edit size={18} />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleStatus && onToggleStatus(task);
          }}
          title={task.status === 'feito' ? 'Reabrir tarefa' : 'Concluir tarefa'}
          className="text-green-400 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
          aria-label={task.status === 'feito' ? 'Reabrir tarefa' : 'Concluir tarefa'}
        >
          <Plus size={18} className={task.status === 'feito' ? 'rotate-45' : ''} />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete && onDelete(task);
          }}
          title="Excluir tarefa"
          className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          aria-label="Excluir tarefa"
        >
          <Trash size={18} />
        </button>
      </div>
    </Link>
  );
}
