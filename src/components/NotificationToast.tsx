import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface NotificationToastProps {
  message: { text: string; type: 'success' | 'error' | 'info' } | null;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className={`p-4 rounded-2xl border shadow-lg flex items-start gap-3 bg-white ${
            message.type === 'success' ? 'border-emerald-200 text-emerald-950' :
            message.type === 'error' ? 'border-rose-200 text-rose-950' :
            'border-stone-200 text-stone-900'
          }`}>
            {message.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {message.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {message.type === 'info' && <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
            <span className="text-xs font-semibold">{message.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default NotificationToast;
