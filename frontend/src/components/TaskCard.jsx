import { Link } from 'react-router-dom';
import { Plus, Trash, Edit } from 'lucide-react';

export default function TaskCard({ task, onDelete, onToggleStatus, onEdit, extraButtons }) {
  return (
    <Link
      to={`/dashboard/task/${task.id}`}
      className={`relative rounded-2xl p-4 min-h-[140px] min-w-[220px] shadow-md hover:shadow-lg transition cursor-pointer flex flex-col group bg-[#1f2937] ${
        task.status === 'feito' ? 'border-2 border-green-500' : ''
      }`}
    >
      <h3 className="text-xl font-semibold mb-2 leading-tight pr-14">{task.title}</h3>

      <p className="flex-1 text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap max-h-24 overflow-auto mb-3">
        {task.description || 'Sem descrição'}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
        <span>
          Prioridade: <span className="font-medium capitalize">{task.priority}</span>
        </span>
        <span>
          Status: <span className="font-medium capitalize">{task.status.replace('_', ' ')}</span>
        </span>
      </div>

      {/* Área para botões extras (ex: mover status) */}
      <div
        className="overflow-hidden transition-all max-h-0 opacity-0 pointer-events-none group-hover:max-h-40 group-hover:opacity-100 group-hover:pointer-events-auto"
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        {extraButtons}
      </div>

      {/* Botões de ação */}
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
