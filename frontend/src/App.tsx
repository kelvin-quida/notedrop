import { useState, useEffect } from 'react';
import { messageService } from './services/api';
import type { Message } from './types/message';
import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';
import ExportButton from './components/ExportButton';
import DeleteAllDialog from './components/DeleteAllDialog';
import ThemeToggle from './components/ThemeToggle';
import SortSelect from './components/SortSelect';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getMessages();
      setMessages(data);
    } catch (err) {
      setError('Erro ao carregar mensagens');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageCreated = (newMessage: Message) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  const handleMessageUpdated = (updatedMessage: Message) => {
    setMessages(prev => 
      prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
    );
  };

  const handleMessageDeleted = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      await messageService.deleteAllMessages();
      setMessages([]);
    } catch (err) {
      setError('Erro ao apagar mensagens');
      console.error('Error deleting messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="app-shell min-h-screen py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        <div className={`rounded-2xl p-6 md:p-8 glass-card elevated transition-colors` }>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary leading-tight">
                  Note Drop
                </h1>
                <p className="text-sm text-text-tertiary mt-0.5">
                  Gerencie suas mensagens rápidas com agilidade
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
          
          <div className="space-y-6">
            <MessageForm onMessageCreated={handleMessageCreated} />
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-text-secondary">
                  Mensagens Recentes
                </h2>
                <p className="text-sm text-text-muted mt-1">Ordene, edite e exporte suas mensagens</p>
              </div>

                <div className="flex items-center ml-auto whitespace-nowrap">
                  <div className="mr-3">
                    <SortSelect value={sortOrder} onChange={setSortOrder} />
                  </div>

                  <div className="mr-3">
                    <DeleteAllDialog
                      onConfirm={handleDeleteAll}
                      messageCount={messages.length}
                      disabled={messages.length === 0 || loading}
                    />
                  </div>

                  <div>
                    <ExportButton />
                  </div>
                </div>
            </div>
            
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-button-primary"></div>
                <p className="mt-2 text-text-tertiary">Carregando mensagens...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-alert-error-bg border border-alert-error-border rounded-md p-4">
                <p className="text-alert-error-text">{error}</p>
                <button
                  onClick={fetchMessages}
                  className="mt-2 text-alert-error-text hover:opacity-80 underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}
            
            {!loading && !error && (
              <MessageList 
                messages={[...messages].sort((a, b) => {
                  const ta = new Date(a.updated_at ?? a.created_at).getTime();
                  const tb = new Date(b.updated_at ?? b.created_at).getTime();
                  return sortOrder === 'newest' ? tb - ta : ta - tb;
                })}
                onMessageUpdated={handleMessageUpdated}
                onMessageDeleted={handleMessageDeleted}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
