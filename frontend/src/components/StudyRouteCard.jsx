import { Heart, Clock, BookOpen, Trash2, CheckCircle, Star, TrendingUp, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudyRouteCard({ route, onDelete, onToggleFavorite }) {
  const completed = route.topics?.filter(t => t.completed).length || 0;
  const total = route.topics?.length || 0;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const isCompleted = completed === total && total > 0;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-colors">
      <div className="p-6">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAreaBadge(route.area)}`}>
                {route.area}
              </span>
              {route.favorite && (
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              )}
              {isCompleted && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-medium text-green-400">Concluída</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
              {route.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {route.description}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <BookOpen className="w-4 h-4" />
              <span>{completed}/{total} tópicos</span>
            </div>
            <span className={`text-sm font-medium ${progress === 100 ? 'text-green-400' :
                progress >= 50 ? 'text-blue-400' : 'text-gray-400'
              }`}>
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' :
                  progress >= 50 ? 'bg-blue-500' : 'bg-gray-500'
                }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(route)}
              className={`p-2 rounded-lg transition-colors ${route.favorite
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              title={route.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`w-4 h-4 ${route.favorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => onDelete(route)}
              className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Excluir trilha"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <Link
            to={`/dashboard/study/${route.id}`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Revisar
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {completed === 0 ? 'Começar' : 'Continuar'}
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function for styling
function getAreaBadge(area) {
  const badges = {
    'Programação': 'bg-blue-500/20 text-blue-400',
    'Design': 'bg-purple-500/20 text-purple-400',
    'Negócios': 'bg-green-500/20 text-green-400',
    'Marketing': 'bg-orange-500/20 text-orange-400',
    'Finanças': 'bg-yellow-500/20 text-yellow-400',
    'Saúde': 'bg-green-500/20 text-green-400',
    'Educação': 'bg-indigo-500/20 text-indigo-400',
    'Tecnologia': 'bg-blue-500/20 text-blue-400',
    'Psicologia': 'bg-purple-500/20 text-purple-400',
    'Artes': 'bg-pink-500/20 text-pink-400',
  };
  return badges[area] || 'bg-gray-500/20 text-gray-400';
}