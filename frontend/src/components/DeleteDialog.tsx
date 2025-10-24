import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const }
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
      ease: "easeIn" as const
    }
  }
};

interface DeleteDialogProps {
  onConfirm: () => void;
  messageId: number;
  disabled?: boolean;
  deleting?: boolean;
}

export default function DeleteDialog({ onConfirm, messageId, disabled, deleting }: DeleteDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          disabled={disabled || deleting}
          className="text-text-muted hover:text-alert-error-text transition-colors p-1 disabled:opacity-50 cursor-pointer"
          aria-label="Excluir mensagem"
        >
          {deleting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-text-muted"></div>
          ) : (
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
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
                Excluir mensagem?
              </AlertDialog.Title>

              <AlertDialog.Description className="text-text-tertiary mb-6 space-y-2">
                <p>
                  Você está prestes a excluir a mensagem 
                  <span className="text-alert-error-text font-medium"> #{messageId}</span>.
                </p>
                <p>
                  Esta ação <span className="font-semibold">não pode ser desfeita</span>. A mensagem será
                  permanentemente removida do banco de dados.
                </p>
              </AlertDialog.Description>

              <div className="flex gap-3 justify-end">
                <AlertDialog.Cancel asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-toggle-bg text-text-secondary rounded-md hover:bg-toggle-hover focus:outline-none focus:ring-2 focus:ring-border-secondary focus:ring-offset-2 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                </AlertDialog.Cancel>

                <AlertDialog.Action asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="px-4 py-2 bg-button-danger text-white rounded-md hover:bg-button-danger-hover focus:outline-none focus:ring-2 focus:ring-button-danger focus:ring-offset-2 transition-colors"
                  >
                    Sim, excluir
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
