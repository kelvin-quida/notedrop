import type { Message } from '../types/message';
import MessageItem from './MessageItem';
import { AnimatePresence, motion } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
  onMessageUpdated?: (message: Message) => void;
  onMessageDeleted?: (id: number) => void;
}

export default function MessageList({ messages, onMessageUpdated, onMessageDeleted }: MessageListProps) {

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p className="text-lg">Nenhuma mensagem ainda</p>
        <p className="text-sm">Seja o primeiro a enviar uma mensagem!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {messages.map((message, i) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <MessageItem 
              message={message}
              index={i + 1}
              onMessageUpdated={onMessageUpdated}
              onMessageDeleted={onMessageDeleted}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
