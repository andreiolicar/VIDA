import React, { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Users, UserPlus, UserMinus } from 'lucide-react';

const NotificationModal = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  actions = [],
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen && autoClose) {
      setProgress(100); // Reset progress quando abrir

      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      // Atualizar a barra de progresso
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (autoCloseDelay / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  // Reset progress quando modal fecha
  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'friend-request':
        return <UserPlus className="w-6 h-6 text-blue-400" />;
      case 'friend-accepted':
        return <Users className="w-6 h-6 text-green-400" />;
      case 'friend-rejected':
        return <UserMinus className="w-6 h-6 text-red-400" />;
      default:
        return <AlertCircle className="w-6 h-6 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-900/20 border-green-700/50',
          text: 'text-green-100',
          accent: 'text-green-400',
          progress: 'bg-green-400'
        };
      case 'error':
        return {
          bg: 'bg-red-900/20 border-red-700/50',
          text: 'text-red-100',
          accent: 'text-red-400',
          progress: 'bg-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-900/20 border-yellow-700/50',
          text: 'text-yellow-100',
          accent: 'text-yellow-400',
          progress: 'bg-yellow-400'
        };
      case 'friend-request':
      case 'friend-accepted':
      case 'friend-rejected':
        return {
          bg: 'bg-blue-900/20 border-blue-700/50',
          text: 'text-blue-100',
          accent: 'text-blue-400',
          progress: 'bg-blue-400'
        };
      default:
        return {
          bg: 'bg-gray-900/20 border-gray-700/50',
          text: 'text-gray-100',
          accent: 'text-gray-400',
          progress: 'bg-gray-400'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`
        relative max-w-md w-full mx-auto rounded-2xl border ${colors.bg} 
        backdrop-blur-lg shadow-2xl transform transition-all duration-300 ease-out
        animate-slideInScale overflow-hidden
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className={`text-lg font-semibold ${colors.accent}`}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${colors.text}`}
            aria-label="Fechar notificação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className={`${colors.text} leading-relaxed`}>
            {message}
          </p>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-3 p-6 pt-0 justify-end">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${action.variant === 'primary'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-600/30'
                    : action.variant === 'success'
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-600/30'
                      : action.variant === 'danger'
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-600/30'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Auto-close progress bar */}
        {autoClose && (
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className="absolute inset-0 bg-white/10" />
            <div
              className={`h-full transition-all duration-75 ease-linear ${colors.progress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;