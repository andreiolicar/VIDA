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

  // Função para verificar se o prazo está expirado, ignorando tarefas concluídas
  const isDueDateExpired = (task) => {
    if (!task.dueDate) return false;
    if (task.status === 'feito') return false;
    return new Date(task.dueDate) < new Date();
  };

  // Define a classe da borda
  const borderClass = isDueDateExpired(task)
    ? 'border-2 border-red-500'
    : task.status === 'feito'
    ? 'border-2 border-green-500'
    : '';

  // Define a cor do texto do prazo
  const dueDateTextColor = task.status === 'feito'
    ? 'text-green-500'
    : isDueDateExpired(task)
    ? 'text-red-500'
    : 'text-gray-300';

  return (
    <Link
      to={`/dashboard/task/${task.id}`}
      className={`relative rounded-2xl p-4 min-h-[180px] min-w-[220px] max-w-[280px] shadow-md transition cursor-pointer flex flex-col group bg-[#1f2937] ${borderClass} hover:bg-[#374151] hover:brightness-110`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          className="text-xl font-semibold leading-tight max-w-[calc(100%-60px)] overflow-hidden text-ellipsis break-words"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            hyphens: 'auto',
            WebkitHyphens: 'auto',
            MozHyphens: 'auto',
            msHyphens: 'auto',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
          lang="pt"
          title={task.title}
        >
          {task.title}
        </h3>

        <div
          className="absolute top-3 right-4 flex gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-10"
        >
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
      </div>

      {task.list && (
        <p className="text-sm text-indigo-400 font-medium mb-2 truncate max-w-full">
          Lista: {task.list.title}
        </p>
      )}

      <p className="flex-1 text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap overflow-hidden mb-3 max-h-[4.5rem]">
        {task.description || 'Sem descrição'}
      </p>

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

      <div className="mb-2">
        <div className="text-xs font-semibold text-gray-400 mb-1">Data do Prazo</div>
        <div className={`flex justify-between items-center text-xs font-semibold ${dueDateTextColor}`}>
          <span>
            {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'Não definido'}
          </span>
          <span>
            {task.status === 'feito' ? (
              <span className="text-green-500 font-semibold">Tarefa Concluída</span>
            ) : isDueDateExpired(task) ? (
              <span className="text-red-500 font-semibold">Prazo Expirado</span>
            ) : null}
          </span>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all max-h-0 opacity-0 pointer-events-none group-hover:max-h-40 group-hover:opacity-100 group-hover:pointer-events-auto"
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        {extraButtons}
      </div>
    </Link>
  );
}
