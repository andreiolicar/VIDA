import { useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function PopupMessage({ message, isVisible, onClose, loading = false }) {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-message-title"
    >
      <div className="bg-[#111827] rounded-xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center text-center relative">
        {loading ? (
          <>
            <Loader2 className="animate-spin w-12 h-12 text-blue-400 mb-4" />
            <h2 id="popup-message-title" className="text-white text-lg font-semibold">
              {message}
            </h2>
          </>
        ) : (
          <>
            <CheckCircle className="w-14 h-14 text-green-400 mb-4" />
            <h2 id="popup-message-title" className="text-white text-lg font-semibold mb-4">
              {message}
            </h2>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
              autoFocus
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  );
}