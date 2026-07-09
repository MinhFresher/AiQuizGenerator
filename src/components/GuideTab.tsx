import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download } from 'lucide-react';
import { StudySet } from '../types';

interface GuideTabProps {
  currentSet: StudySet;
  copyStudyGuide: () => void;
  downloadStudyGuide: () => void;
}

export const GuideTab: React.FC<GuideTabProps> = ({
  currentSet,
  copyStudyGuide,
  downloadStudyGuide,
}) => {
  const hasGuide = currentSet.studyGuide && 
                   currentSet.studyGuide.trim().length > 0 && 
                   !currentSet.studyGuide.includes('No guide was generated.');

  if (!hasGuide) {
    return (
      <div className="text-center py-12 px-6 bg-white border border-stone-200 rounded-3xl max-w-md mx-auto">
        <Download className="w-12 h-12 text-amber-500/80 mx-auto mb-4 animate-pulse" />
        <h3 className="font-serif text-lg font-bold text-stone-800">No Study Guide Generated</h3>
        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
          The study guide was not selected during generation for this study set. You can always include it next time by checking the "Study Guide" option!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Share / Export tools */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <span className="text-xs font-bold text-stone-400 font-mono uppercase tracking-wider">
          Markdown Study Summary
        </span>
        <div className="flex gap-2">
          <button
            onClick={copyStudyGuide}
            className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Copy full study guide text"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
          <button
            onClick={downloadStudyGuide}
            className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Download guide file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="markdown-body select-text">
        <ReactMarkdown>{currentSet.studyGuide}</ReactMarkdown>
      </div>
    </div>
  );
};
export default GuideTab;
