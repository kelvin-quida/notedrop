import { useState } from 'react';
import type { Message } from '../types/message';
import { messageService } from '../services/api';

interface MessageFormProps {
  onMessageCreated: (message: Message) => void;
}

export default function MessageForm({ onMessageCreated }: MessageFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Por favor, digite uma mensagem');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newMessage = await messageService.createMessage({ content: content.trim() });
      onMessageCreated(newMessage);
      setContent('');
    } catch (err) {
      setError('Erro ao enviar mensagem');
      console.error('Error creating message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const txtFile = files.find(file => file.name.endsWith('.txt'));

    if (!txtFile) {
      setError('Por favor, solte apenas arquivos .txt');
      return;
    }

    try {
      const text = await txtFile.text();
      setContent(text);
      setError(null);
    } catch (err) {
      setError('Erro ao ler o arquivo');
      console.error('Error reading file:', err);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-secondary mb-3">
        Enviar Nova Mensagem
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite sua mensagem aqui ou arraste um arquivo .txt..."
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary focus:border-transparent resize-y min-h-[72px] bg-bg-input text-text-primary placeholder-text-muted transition-colors ${
              isDragging 
                ? 'border-button-primary border-2 bg-button-primary/6' 
                : 'border-border-input'
            }`}
            rows={3}
            disabled={loading}
          />
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-button-primary/10 rounded-md pointer-events-none">
              <p className="text-button-primary font-semibold">
                Solte o arquivo .txt aqui
              </p>
            </div>
          )}
        </div>
        
        {error && (
          <div className="text-alert-error-text text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-6 py-2 bg-button-primary text-white rounded-full hover:bg-button-primary-hover focus:outline-none focus:ring-2 focus:ring-button-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-transform transform-gpu hover:-translate-y-0.5 shadow-md"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{loading ? 'Enviando...' : 'Enviar'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
