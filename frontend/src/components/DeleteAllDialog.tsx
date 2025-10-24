import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' as const }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const }
  }
};

const contentVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 10
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: "easeOut" as const,
      scale: { duration: 0.25 }
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: { 
      duration: 0.2,
      ease: 'easeIn' as const
    }
  }
};

interface DeleteAllDialogProps {
  onConfirm: () => void;
  messageCount: number;
  disabled?: boolean;
}

export default function DeleteAllDialog({ onConfirm, messageCount, disabled }: DeleteAllDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          disabled={disabled}
          className="shrink-0 px-3 py-1.5 bg-button-danger text-white rounded-full hover:bg-button-danger-hover focus:outline-none focus:ring-2 focus:ring-button-danger focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-transform transform hover:-translate-y-0.5 shadow-sm text-sm cursor-pointer"
          aria-label="Apagar todas as mensagens"
        >
          <span className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-md">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </span>
          <span className="font-semibold text-sm">Apagar Tudo</span>
        </button>
      </AlertDialog.Trigger>
      
      <AlertDialog.Portal>
        <AnimatePresence>
          <AlertDialog.Overlay asChild>
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
            />
          </AlertDialog.Overlay>

          <AlertDialog.Content asChild>
            <motion.div
              key="content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-bg-secondary rounded-lg shadow-xl p-6"
            >
              <AlertDialog.Title className="text-xl font-semibold text-text-primary mb-2">
                Apagar todas as mensagens?
              </AlertDialog.Title>
              
              <AlertDialog.Description className="text-text-tertiary mb-6 space-y-2">
                <p>
                  Você está prestes a apagar <strong className="text-alert-error-text">{messageCount} {messageCount === 1 ? 'mensagem' : 'mensagens'}</strong>.
                </p>
                <p>
                  Esta ação <strong>não pode ser desfeita</strong>. Todas as mensagens serão permanentemente removidas do banco de dados.
                </p>
              </AlertDialog.Description>
              
              <div className="flex gap-3 justify-end">
                <AlertDialog.Cancel asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-toggle-bg text-text-secondary rounded-md hover:bg-toggle-hover border border-border-secondary focus:outline-none focus:ring-1 focus:ring-border-secondary focus:ring-offset-2 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </motion.button>
                </AlertDialog.Cancel>
                
                <AlertDialog.Action asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="px-4 py-2 bg-button-danger text-white rounded-md hover:bg-button-danger-hover focus:outline-none focus:ring-1 focus:ring-button-danger focus:ring-offset-2 transition-colors cursor-pointer"
                  >
                    Sim, apagar tudo
                  </motion.button>
                </AlertDialog.Action>
              </div>
            </motion.div>
          </AlertDialog.Content>
        </AnimatePresence>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
