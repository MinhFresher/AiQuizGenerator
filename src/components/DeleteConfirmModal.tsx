import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { StudySet } from '../types';

interface DeleteConfirmModalProps {
  deleteConfirmId: string | null;
  setDeleteConfirmId: (id: string | null) => void;
  studySets: StudySet[];
  onConfirmDelete: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  deleteConfirmId,
  setDeleteConfirmId,
  studySets,
  onConfirmDelete,
}) => {
  return (
    <AnimatePresence>
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xl max-w-md w-full relative space-y-4"
          >
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
              title="Cancel deletion"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-2xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Delete Study Set</h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-stone-900 font-semibold">"{studySets.find(s => s.id === deleteConfirmId)?.title || 'this study set'}"</strong>? This will permanently remove all questions, flashcards, study guides, and test histories associated with it. This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirmDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Trash2 className="w-4 h-4 text-rose-200" />
                Delete Set
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default DeleteConfirmModal;
