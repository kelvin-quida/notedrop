import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '../types/message';
import { messageService } from '../services/api';
import DeleteDialog from './DeleteDialog';

interface MessageItemProps {
  message: Message;
  onMessageUpdated?: (message: Message) => void;
  onMessageDeleted?: (id: number) => void;
  index?: number;
}

const MAX_LENGTH = 200;

export default function MessageItem({ message, onMessageUpdated, onMessageDeleted, index }: MessageItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [originalContent, setOriginalContent] = useState(message.content);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffSec < 60) {
      return 'agora pouco';
    } else if (diffMin < 60) {
      return `${diffMin}m atrás`;
    } else if (diffHour < 24) {
      return `${diffHour}h atrás`;
    } else {
      return `${diffDay}d atrás`;
    }
  };

  const hasChanges = editContent !== originalContent;
  const isSaveDisabled = !hasChanges || !editContent.trim();

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      setError('O conteúdo não pode estar vazio');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updatedMessage = await messageService.updateMessage(message.id, {
        content: editContent.trim(),
      });
      if (onMessageUpdated) {
        onMessageUpdated(updatedMessage);
      }
      setIsEditing(false);
    } catch (err) {
      setError('Erro ao atualizar mensagem');
      console.error('Error updating message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(originalContent);
    setIsEditing(false);
    setError(null);
  };

  const startEditing = () => {
    setOriginalContent(message.content);
    setEditContent(message.content);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError(null);
      await messageService.deleteMessage(message.id);
      if (onMessageDeleted) {
        onMessageDeleted(message.id);
      }
    } catch (err) {
      setError('Erro ao excluir mensagem');
      console.error('Error deleting message:', err);
    } finally {
      setDeleting(false);
    }
  };

  const isLongMessage = message.content.length > MAX_LENGTH;
  const timestamp = message.updated_at ?? message.created_at;
  const isEdited = !!(message.updated_at && (new Date(message.updated_at).getTime() - new Date(message.created_at).getTime() > 1000));

  const editVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.995 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.18, 
        ease: 'easeOut' as const 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -6, 
      scale: 0.995, 
      transition: { 
        duration: 0.14, 
        ease: 'easeIn' as const 
      } 
    }
  };

  return (
    <div className={`rounded-xl p-4 glass-card ${isEditing ? 'ring-2 ring-button-primary/20' : 'hover:shadow-lg hover:-translate-y-0.5 hover:bg-bg-secondary/50'} border border-border-primary transition-all duration-200 ease-out cursor-default`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <div className="size-7 rounded-lg bg-button-primary text-white flex items-center justify-center font-semibold shadow-sm">{index ?? message.id}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-primary font-semibold">Mensagem</span>
              {isEdited && (
                <span className="muted-badge">editado</span>
              )}
            </div>
            <div className="text-xs text-text-muted">{formatDate(timestamp)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={startEditing}
                disabled={deleting}
                className="p-2 rounded-md text-text-secondary hover:text-button-primary transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Editar mensagem"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <DeleteDialog
                onConfirm={handleDelete}
                messageId={message.id}
                disabled={loading}
                deleting={deleting}
              />
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-2 text-alert-error-text text-sm">
          {error}
        </div>
      )}

      <AnimatePresence>
        {isEditing ? (
          <motion.div className="space-y-3" variants={editVariants} initial="hidden" animate="visible" exit="exit">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 border border-border-input rounded-md focus:outline-none focus:ring-2 focus:ring-button-primary focus:border-transparent resize-y min-h-[100px] bg-bg-input text-text-primary transition-colors"
              disabled={loading}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={loading}
                className="px-4 py-2 cursor-pointer text-text-secondary hover:text-text-primary border border-border-input rounded-md hover:bg-bg-primary transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaveDisabled || loading}
                className={`px-4 py-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 transition-colors ${
                  isSaveDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-button-primary text-white hover:bg-button-primary-hover focus:ring-button-primary'
                }`}
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{loading ? 'Salvando...' : 'Salvar'}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="relative">
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded ? 'max-h-[5000px]' : 'max-h-[200px]'
              }`}
            >
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>
            {isLongMessage && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[rgba(0,0,0,0.06)] to-transparent pointer-events-none rounded-b-lg" />
            )}
            {isLongMessage && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-button-primary hover:bg-button-primary-hover text-white shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-button-primary focus:ring-offset-2"
                  aria-label={isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
