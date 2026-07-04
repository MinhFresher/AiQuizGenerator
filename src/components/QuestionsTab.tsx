import React from 'react';
import { Sparkles, Plus, Edit, Trash2 } from 'lucide-react';
import { StudySet, Question } from '../types';

interface QuestionsTabProps {
  currentSet: StudySet;
  generateMoreQuestions: () => void;
  isGenerating: boolean;
  startAddQuestion: () => void;
  setEditingQuestion: (question: Question | null) => void;
  deleteQuestion: (id: string) => void;
}

export const QuestionsTab: React.FC<QuestionsTabProps> = ({
  currentSet,
  generateMoreQuestions,
  isGenerating,
  startAddQuestion,
  setEditingQuestion,
  deleteQuestion,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Custom Test Questions</h3>
          <p className="text-xs text-stone-500 mt-0.5">Customize, edit, and add test items or use AI to generate more content.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateMoreQuestions}
            disabled={isGenerating}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate 5 More
          </button>
          <button
            onClick={startAddQuestion}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Question
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {currentSet.questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white border border-stone-200 p-5 rounded-2xl flex items-start gap-4 justify-between group/q"
          >
            <div className="flex-1 space-y-2">
              <h4 className="font-serif font-bold text-sm text-stone-900 leading-relaxed">
                {index + 1}. {question.text}
              </h4>
              <div className="grid grid-cols-2 gap-2 pl-4">
                {question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`text-[11px] p-2 rounded-lg border flex items-center gap-1.5 ${
                      idx === question.correctAnswerIndex
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                        : 'bg-stone-50 border-stone-100 text-stone-600'
                    }`}
                  >
                    <span className="font-mono font-bold uppercase">{String.fromCharCode(65 + idx)}:</span>
                    <span className="truncate">{option}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-stone-500 pl-4">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 opacity-40 group-hover/q:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingQuestion(question)}
                className="p-2 hover:bg-stone-100 text-stone-600 rounded-lg transition-all"
                title="Edit question details"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-all"
                title="Delete question"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default QuestionsTab;
