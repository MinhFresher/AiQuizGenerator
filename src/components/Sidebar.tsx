import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Award, Plus, Trash2, ExternalLink, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { StudySet } from '../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  sidebarTab: 'sets' | 'tests';
  setSidebarTab: (tab: 'sets' | 'tests') => void;
  studySets: StudySet[];
  currentSetId: string | null;
  setCurrentSetId: (id: string | null) => void;
  resetTestState: () => void;
  setFlashcardIndex: (idx: number) => void;
  setFlashcardFlipped: (flipped: boolean) => void;
  setTestMode: (mode: 'practice' | 'exam') => void;
  setActiveTab: (tab: 'test' | 'flashcards' | 'guide' | 'questions') => void;
  deleteStudySet: (id: string) => void;
  notify: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  sidebarTab,
  setSidebarTab,
  studySets,
  currentSetId,
  setCurrentSetId,
  resetTestState,
  setFlashcardIndex,
  setFlashcardFlipped,
  setTestMode,
  setActiveTab,
  deleteStudySet,
  notify,
}) => {
  const [setsPage, setSetsPage] = useState(1);
  const [testsPage, setTestsPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const totalSets = studySets.length;
  const totalSetsPages = Math.ceil(totalSets / ITEMS_PER_PAGE) || 1;
  const currentSetsPage = Math.min(setsPage, totalSetsPages);
  const paginatedSets = studySets.slice(
    (currentSetsPage - 1) * ITEMS_PER_PAGE,
    currentSetsPage * ITEMS_PER_PAGE
  );

  const totalTests = studySets.length;
  const totalTestsPages = Math.ceil(totalTests / ITEMS_PER_PAGE) || 1;
  const currentTestsPage = Math.min(testsPage, totalTestsPages);
  const paginatedTests = studySets.slice(
    (currentTestsPage - 1) * ITEMS_PER_PAGE,
    currentTestsPage * ITEMS_PER_PAGE
  );
  return (
    <AnimatePresence initial={false}>
      {isSidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 310, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-r border-stone-200 bg-[var(--bg-header)] shrink-0 h-[calc(100vh-69px)] overflow-y-auto flex flex-col"
        >
          {/* Tab Switcher inside Sidebar */}
          <div className="p-4 pb-2 border-b border-stone-200">
            <div className="flex p-1 bg-stone-100 rounded-xl gap-1">
              <button
                onClick={() => setSidebarTab('sets')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  sidebarTab === 'sets'
                    ? 'bg-white text-stone-900 shadow-sm border border-stone-250/20'
                    : 'text-stone-500 hover:text-stone-850'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                Study Sets
              </button>
              <button
                onClick={() => setSidebarTab('tests')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  sidebarTab === 'tests'
                    ? 'bg-white text-stone-900 shadow-sm border border-stone-250/20'
                    : 'text-stone-500 hover:text-stone-850'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-stone-400" />
                All Tests ({studySets.length})
              </button>
            </div>

            {/* Create New Button */}
            <button
              onClick={() => {
                setCurrentSetId(null);
                resetTestState();
              }}
              className="w-full mt-3 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Create New Study Set
            </button>
          </div>

          {sidebarTab === 'sets' ? (
            <div className="p-5 border-b border-stone-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-stone-400" />
                Local Study Library
              </h2>
              <div className="space-y-2">
                {paginatedSets.map(set => {
                  const isActive = set.id === currentSetId;
                  return (
                    <div
                      key={set.id}
                      className={`group relative p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                          : 'bg-white border-stone-200/80 text-stone-800 hover:border-stone-400 hover:shadow-sm'
                      }`}
                      onClick={() => {
                        setCurrentSetId(set.id);
                        resetTestState();
                        setFlashcardIndex(0);
                        setFlashcardFlipped(false);
                      }}
                    >
                      <h3 className={`font-serif font-bold text-xs leading-snug line-clamp-2 ${isActive ? 'text-amber-300' : 'text-stone-950'}`}>
                        {set.title}
                      </h3>
                      <p className={`text-[10px] mt-1.5 font-mono ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                        {set.questions.length} Questions • {set.flashcards.length} Flashcards
                      </p>
                      {set.lastScore && (
                        <div className={`mt-2 inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>
                          <Award className="w-3 h-3 text-amber-500" />
                          Score: {set.lastScore.score}/{set.lastScore.total}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStudySet(set.id);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                          isActive ? 'hover:bg-stone-800 text-stone-400 hover:text-rose-400' : 'hover:bg-stone-100 text-stone-500 hover:text-rose-600'
                        }`}
                        title="Delete study set"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {totalSetsPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-150/40">
                  <button
                    disabled={currentSetsPage === 1}
                    onClick={() => setSetsPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent text-stone-600 transition-all cursor-pointer flex items-center justify-center"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-stone-500">
                    Page {currentSetsPage} of {totalSetsPages}
                  </span>
                  <button
                    disabled={currentSetsPage === totalSetsPages}
                    onClick={() => setSetsPage(prev => Math.min(prev + 1, totalSetsPages))}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent text-stone-600 transition-all cursor-pointer flex items-center justify-center"
                    title="Next Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 border-b border-stone-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-stone-400" />
                Test & Performance Hub
              </h2>
              <div className="space-y-3">
                {studySets.length === 0 ? (
                  <div className="text-center py-6 text-stone-400 text-xs">
                    No tests available yet. Create one by uploading a file.
                  </div>
                ) : (
                  paginatedTests.map(set => {
                    const isActive = set.id === currentSetId;
                    const scorePercentage = set.lastScore 
                      ? Math.round((set.lastScore.score / set.lastScore.total) * 100) 
                      : null;
                    return (
                      <div
                        key={set.id}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 relative ${
                          isActive
                            ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                            : 'bg-white border-stone-200/80 text-stone-800 hover:border-stone-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="pr-6">
                          <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-amber-500">
                            {set.questions.length} QUESTIONS
                          </span>
                          <h3 
                            onClick={() => {
                              setCurrentSetId(set.id);
                              resetTestState();
                              setFlashcardIndex(0);
                              setFlashcardFlipped(false);
                            }}
                            className={`font-serif font-bold text-xs leading-snug line-clamp-2 mt-0.5 cursor-pointer hover:underline ${isActive ? 'text-amber-300' : 'text-stone-950'}`}
                          >
                            {set.title}
                          </h3>
                          <p className={`text-[9px] mt-1 line-clamp-1 opacity-70`}>
                            Source: {set.sourceName}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStudySet(set.id);
                          }}
                          className={`absolute top-2 right-2 p-1 rounded-lg ${
                            isActive ? 'text-stone-400 hover:text-rose-400 hover:bg-stone-800' : 'text-stone-400 hover:text-rose-600 hover:bg-stone-100'
                          }`}
                          title="Delete this test"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="mt-2.5 pt-2 border-t border-stone-150/40 flex flex-col gap-1.5">
                          {set.lastScore ? (
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-stone-400">LAST SCORE:</span>
                              <span className={`text-[10px] font-mono font-bold ${
                                scorePercentage! >= 80 ? 'text-emerald-500' : scorePercentage! >= 60 ? 'text-amber-500' : 'text-rose-500'
                              }`}>
                                {set.lastScore.score}/{set.lastScore.total} ({scorePercentage}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] italic text-stone-400">Not taken yet</span>
                          )}

                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setCurrentSetId(set.id);
                                resetTestState();
                                setActiveTab('test');
                                setTestMode('practice');
                              }}
                              className={`flex-1 py-1 rounded text-[9px] font-bold border transition-all ${
                                isActive
                                  ? 'bg-stone-800 border-stone-700 hover:bg-stone-750 text-stone-200'
                                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                              }`}
                            >
                              Practice
                            </button>
                            <button
                              onClick={() => {
                                setCurrentSetId(set.id);
                                resetTestState();
                                setActiveTab('test');
                                setTestMode('exam');
                              }}
                              className={`flex-1 py-1 rounded text-[9px] font-bold border transition-all ${
                                isActive
                                  ? 'bg-amber-500 border-amber-600 hover:bg-amber-400 text-stone-950'
                                  : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-900'
                              }`}
                            >
                              Exam
                            </button>
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}${window.location.pathname}?view=standalone-test&setId=${set.id}`;
                                const win = window.open(url, '_blank');
                                if (!win) {
                                  notify('Popup blocked! Please allow popups.', 'error');
                                }
                              }}
                              className={`p-1 rounded border transition-all ${
                                isActive
                                  ? 'bg-stone-800 border-stone-700 hover:bg-stone-750 text-stone-300'
                                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-500'
                              }`}
                              title="Open Standalone Exam Room in New Tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {totalTestsPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-150/40">
                  <button
                    disabled={currentTestsPage === 1}
                    onClick={() => setTestsPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent text-stone-600 transition-all cursor-pointer flex items-center justify-center"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-stone-500">
                    Page {currentTestsPage} of {totalTestsPages}
                  </span>
                  <button
                    disabled={currentTestsPage === totalTestsPages}
                    onClick={() => setTestsPage(prev => Math.min(prev + 1, totalTestsPages))}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent text-stone-600 transition-all cursor-pointer flex items-center justify-center"
                    title="Next Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Dynamic study status panel */}
          <div className="p-5 flex-1 flex flex-col justify-end">
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" /> Active Recall Study Tip
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                Read the generated <strong>Study Guide</strong> first, then flip through the <strong>Flashcards</strong>. Finally, test your mastery by entering <strong>Exam Mode</strong>!
              </p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
export default Sidebar;
