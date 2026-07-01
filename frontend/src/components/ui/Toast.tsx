import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Toast: React.FC = () => {
  const toasts = useStore((state) => state.toasts);
  const removeToast = useStore((state) => state.removeToast);

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            className={`min-w-[280px] rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === 'success'
                ? 'border-brand-success/40 bg-brand-success/10 text-brand-success'
                : toast.type === 'error'
                  ? 'border-brand-danger/40 bg-brand-danger/10 text-brand-danger'
                  : 'border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="mt-0.5 text-current opacity-70">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
