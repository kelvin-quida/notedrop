import { useState } from 'react';
import { messageService } from '../services/api';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      
      const blob = await messageService.exportMessages();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `messages_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting messages:', error);
      alert('Erro ao exportar mensagens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="shrink-0 px-3 py-1.5 bg-linear-to-r from-green-500 to-emerald-400 text-white rounded-full hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-button-success focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-transform transform hover:-translate-y-0.5 shadow-sm text-sm cursor-pointer"
      aria-label="Exportar mensagens para Excel"
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          <span>Exportando...</span>
        </div>
      ) : (
        <>
          <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-md" aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <span className="font-semibold text-sm">Exportar Excel</span>
        </>
      )}
    </button>
  );
}



