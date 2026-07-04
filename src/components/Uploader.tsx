import React, { useState } from 'react';
import {
  Sparkles,
  FileUp,
  RotateCcw,
  Download,
  Layers,
  Trash2,
  BookOpen,
  Award,
  FileText,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { StudySet } from '../types';

interface UploaderProps {
  handleGenerateStudySet: (e: React.FormEvent) => void;
  uploadFile: File | null;
  pastedText: string;
  setPastedText: (text: string) => void;
  customInstructions: string;
  setCustomInstructions: (text: string) => void;
  generationCount: number | string;
  setGenerationCount: (count: number | string) => void;
  dragActive: boolean;
  isGenerating: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  selectFileManually: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportStudySet: (e: React.ChangeEvent<HTMLInputElement>) => void;
  studySets: StudySet[];
  setSidebarTab: (tab: 'sets' | 'tests') => void;
  setCurrentSetId: (id: string | null) => void;
  deleteStudySet: (id: string) => void;
  handleExportStudySet: (set: StudySet) => void;
}

export const Uploader: React.FC<UploaderProps> = ({
  handleGenerateStudySet,
  uploadFile,
  pastedText,
  setPastedText,
  customInstructions,
  setCustomInstructions,
  generationCount,
  setGenerationCount,
  dragActive,
  isGenerating,
  handleDrag,
  handleDrop,
  selectFileManually,
  handleImportStudySet,
  studySets,
  setSidebarTab,
  setCurrentSetId,
  deleteStudySet,
  handleExportStudySet,
}) => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<'create' | 'library'>('create');

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 mb-8">
      {/* Dashboard Tab Navigation */}
      <div className="flex border-b border-stone-200/80 pb-px">
        <button
          onClick={() => setActiveDashboardTab('create')}
          className={`pb-3.5 px-6 font-serif text-sm font-bold transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeDashboardTab === 'create'
              ? 'border-stone-900 text-stone-950'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Create New AI Study Set
        </button>
        <button
          onClick={() => setActiveDashboardTab('library')}
          className={`pb-3.5 px-6 font-serif text-sm font-bold transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeDashboardTab === 'library'
              ? 'border-stone-900 text-stone-950'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <Layers className="w-4 h-4 text-stone-400" />
          My Study Library ({studySets.length})
        </button>
      </div>

      {activeDashboardTab === 'create' ? (
        <div className="space-y-6 animate-fade-in">
          {/* Create New Form Panel */}
          <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4.5 mb-6">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-900 border border-amber-100">
                <Sparkles className="w-6 h-6 text-amber-600 animate-pulse" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-900">Create New AI Study Set</h2>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Upload course documents, textbooks, lecture slides (PDF, Word, or Text files) or copy-paste content to instantly generate customized learning tools.
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateStudySet} className="space-y-5">
              {/* Drag and Drop File field */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
                  dragActive 
                    ? 'border-amber-500 bg-amber-50/40' 
                    : uploadFile 
                      ? 'border-stone-400 bg-stone-50' 
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={selectFileManually}
                />
                <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center justify-center">
                  <FileUp className={`w-8 h-8 mb-2.5 ${uploadFile ? 'text-amber-600' : 'text-stone-400'}`} />
                  {uploadFile ? (
                    <div className="text-xs text-stone-800">
                      <span className="font-bold font-mono block text-amber-800">{uploadFile.name}</span>
                      <span className="text-[10px] text-stone-500 block mt-1">
                        {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-600 leading-relaxed max-w-sm">
                      <strong className="text-stone-950 font-semibold">Drag & drop your study document</strong> or click to search files.
                      <span className="text-[10px] text-stone-500 block mt-1">Supports PDF, Word (.docx), and plain text files.</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Plain text Fallback toggle */}
              {!uploadFile && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Or copy & paste notes/syllabus text
                  </label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste textbook definitions, lecture slide bullets, list of questions with/without answers, or raw exam syllabus..."
                    className="w-full text-xs p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:border-stone-500 outline-none h-24 resize-none leading-relaxed font-mono"
                  />
                </div>
              )}

              {/* Settings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Target Question Count
                  </label>
                  <select
                    value={generationCount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGenerationCount(val === 'auto' ? 'auto' : parseInt(val, 10));
                    }}
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400"
                  >
                    <option value="auto">✨ Extract All Questions from File (Automatic / No Limit)</option>
                    <option value={5}>5 Questions (Short Quiz)</option>
                    <option value={10}>10 Questions (Standard Test)</option>
                    <option value={15}>15 Questions (Detailed Exam)</option>
                    <option value={20}>20 Questions (Comprehensive Exam)</option>
                    <option value={30}>30 Questions (Mock Midterm)</option>
                    <option value={40}>40 Questions (Comprehensive Review)</option>
                    <option value={50}>50 Questions (Mega Marathon)</option>
                    <option value={60}>60 Questions (Simulated Finals)</option>
                    <option value={80}>80 Questions (Ultimate Academic Board)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Custom Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g. 'Concentrate on cellular transport formulas', 'Make questions highly difficult.'"
                    className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-stone-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                    isGenerating 
                      ? 'bg-stone-700 cursor-not-allowed opacity-80' 
                      : 'bg-stone-900 hover:bg-stone-800 hover:scale-[1.01]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Generating Study Set...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Generate Study Set</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Start helpers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200/80 p-6 rounded-3xl flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-600" />
                  Import Saved Study Set
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Have a previously exported PrepAI study set JSON file? Import it here to instantly restore your questions, flashcards, and study guides.
                </p>
              </div>
              <div className="mt-5">
                <input
                  type="file"
                  id="json-import"
                  className="hidden"
                  accept=".json"
                  onChange={handleImportStudySet}
                />
                <label
                  htmlFor="json-import"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FCFAF7] hover:bg-stone-100 border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-bold text-stone-700 transition-all text-center cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Choose JSON File to Import</span>
                </label>
              </div>
            </div>

            <div className="bg-white border border-stone-200/80 p-6 rounded-3xl flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Browse Your Local Library
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  You have <strong>{studySets.length} study sets</strong> saved in your local library. View them all inside the library navigation tab or select any from the sidebar.
                </p>
              </div>
              <button
                onClick={() => setActiveDashboardTab('library')}
                className="mt-5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all text-center self-start cursor-pointer"
              >
                Open Study Library
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Study Library panel */}
          <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-900">Your Study Library</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Access and organize all your custom generated test preparation environments.
                </p>
              </div>
              <button
                onClick={() => setActiveDashboardTab('create')}
                className="px-3.5 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Create New</span>
              </button>
            </div>

            {studySets.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-serif font-bold text-stone-900">No study sets found</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Generate your first interactive exam suite or import a JSON backup file to populate your study library.
                  </p>
                </div>
                <button
                  onClick={() => setActiveDashboardTab('create')}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Create New Study Set
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studySets.map((set) => {
                  const scorePercentage = set.lastScore 
                    ? Math.round((set.lastScore.score / set.lastScore.total) * 100) 
                    : null;

                  return (
                    <div
                      key={set.id}
                      className="group relative border border-stone-200/80 hover:border-stone-400 bg-stone-50/20 hover:bg-white p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-xs cursor-pointer"
                      onClick={() => setCurrentSetId(set.id)}
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/30">
                            {set.questions.length} QUESTIONS
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            {set.createdDate}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-stone-950 line-clamp-1">
                            {set.title}
                          </h3>
                          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1 truncate">
                            <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            Source: <strong className="text-stone-700 font-medium">{set.sourceName}</strong>
                          </p>
                        </div>

                        <div className="flex gap-4 text-stone-500 pt-1">
                          <div className="text-center bg-white/60 border border-stone-150/40 px-2.5 py-1 rounded-lg shrink-0">
                            <span className="text-[9px] font-bold block text-stone-400 uppercase tracking-wide">Cards</span>
                            <span className="text-xs font-bold font-mono text-stone-700">{set.flashcards.length}</span>
                          </div>
                          {scorePercentage !== null ? (
                            <div className="text-center bg-white/60 border border-stone-150/40 px-2.5 py-1 rounded-lg shrink-0">
                              <span className="text-[9px] font-bold block text-stone-400 uppercase tracking-wide">Last Score</span>
                              <span className={`text-xs font-bold font-mono ${
                                scorePercentage >= 80 ? 'text-emerald-600' : scorePercentage >= 60 ? 'text-amber-600' : 'text-rose-600'
                              }`}>
                                {set.lastScore?.score}/{set.lastScore?.total} ({scorePercentage}%)
                              </span>
                            </div>
                          ) : (
                            <div className="text-center bg-stone-100 border border-transparent px-2.5 py-1 rounded-lg shrink-0">
                              <span className="text-[9px] font-medium block text-stone-400 uppercase tracking-wide">Last Score</span>
                              <span className="text-xs italic text-stone-400 font-medium">None</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportStudySet(set);
                            }}
                            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all cursor-pointer border border-stone-200/50"
                            title="Export backup file (JSON)"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStudySet(set.id);
                            }}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-750 rounded-xl transition-all cursor-pointer border border-rose-100"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => setCurrentSetId(set.id)}
                          className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer hover:translate-x-0.5"
                        >
                          <span>Open Study Set</span>
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Uploader;
