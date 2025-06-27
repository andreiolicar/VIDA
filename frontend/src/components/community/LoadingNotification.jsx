import React from 'react';

const LoadingNotification = ({ isOpen, message = "Carregando..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1f2937]/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-2xl animate-slideInScale">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-600/30 rounded-full animate-spin">
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
            </div>
          </div>
          <p className="text-gray-200 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingNotification;