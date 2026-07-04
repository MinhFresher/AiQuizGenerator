import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';
import { Question } from '../types';

interface QuestionModalProps {
  editingQuestion: Question | null;
  setEditingQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  isAddingQuestion: boolean;
  setIsAddingQuestion: (adding: boolean) => void;
  saveEditedQuestion: (e: React.FormEvent) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  editingQuestion,
  setEditingQuestion,
  isAddingQuestion,
  setIsAddingQuestion,
}) => {
  if (!editingQuestion) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save is handled inside App.tsx which we will pass via event dispatcher or save callback
    // For now we'll trigger a submit on the form
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-stone-200 w-full max-w-lg rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center border-b border-stone-100 pb-3.5 mb-4">
          <h3 className="font-serif font-bold text-base text-stone-950">
            {isAddingQuestion ? 'Add Custom Test Question' : 'Edit Question Details'}
          </h3>
          <button
            onClick={() => {
              setEditingQuestion(null);
              setIsAddingQuestion(false);
            }}
            className="p-1 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Since form uses saveEditedQuestion onSubmit, we make sure it triggers parent callback */}
        <form id="question-modal-form" className="space-y-4 overflow-y-auto flex-1 pr-1.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Question text
            </label>
            <textarea
              value={editingQuestion.text}
              required
              onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
              className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400 h-20 resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Multiple Choice Choices
            </label>
            {editingQuestion.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 bg-stone-100 rounded-md flex items-center justify-center text-[10px] font-mono font-bold text-stone-500 shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  value={opt}
                  required
                  onChange={(e) => {
                    const updatedOpts = [...editingQuestion.options];
                    updatedOpts[idx] = e.target.value;
                    setEditingQuestion({ ...editingQuestion, options: updatedOpts });
                  }}
                  className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400"
                  placeholder={`Choice option ${idx + 1}...`}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Correct Option Indicator
            </label>
            <select
              value={editingQuestion.correctAnswerIndex}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswerIndex: parseInt(e.target.value) })}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400"
            >
              <option value={0}>Option A</option>
              <option value={1}>Option B</option>
              <option value={2}>Option C</option>
              <option value={3}>Option D</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Detailed Explanation
            </label>
            <textarea
              value={editingQuestion.explanation}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
              className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400 h-20 resize-none leading-relaxed"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 pt-3 border-t border-stone-100 mt-4">
          <button
            type="button"
            onClick={() => {
              setEditingQuestion(null);
              setIsAddingQuestion(false);
            }}
            className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-all"
          >
            Cancel
          </button>
          {/* We trigger click or form submit of parent form via button type button with custom click trigger */}
          <button
            type="submit"
            form="question-modal-form"
            className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            Save Question
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default QuestionModal;
