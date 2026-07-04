import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Layers,
  Maximize2,
  Printer,
  ArrowLeft,
  Check,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { StudySet, Question } from '../types';
import { formatTime } from '../utils/time';

interface StandaloneViewProps {
  standaloneSet: StudySet;
  standaloneTestMode: 'practice' | 'exam';
  setStandaloneTestMode: (mode: 'practice' | 'exam') => void;
  standaloneDarkMode: boolean;
  setStandaloneDarkMode: (dark: boolean) => void;
  standaloneTimer: number;
  standaloneTimerActive: boolean;
  setStandaloneTimerActive: (active: boolean) => void;
  standaloneSubmitted: boolean;
  submitStandaloneExam: () => void;
  resetStandaloneTest: () => void;
  standaloneLayoutMode: 'single' | 'list';
  setStandaloneLayoutMode: (mode: 'single' | 'list') => void;
  standaloneQuestionIndex: number;
  setStandaloneQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  standaloneAnswers: Record<string, number>;
  standaloneRevealed: Record<string, boolean>;
  handleStandaloneSelectOption: (qId: string, idx: number) => void;
  flaggedQuestions: Record<string, boolean>;
  toggleFlagQuestion: (qId: string) => void;
  printStandaloneTest: () => void;
}

export const StandaloneView: React.FC<StandaloneViewProps> = ({
  standaloneSet,
  standaloneTestMode,
  setStandaloneTestMode,
  standaloneDarkMode,
  setStandaloneDarkMode,
  standaloneTimer,
  standaloneTimerActive,
  setStandaloneTimerActive,
  standaloneSubmitted,
  submitStandaloneExam,
  resetStandaloneTest,
  standaloneLayoutMode,
  setStandaloneLayoutMode,
  standaloneQuestionIndex,
  setStandaloneQuestionIndex,
  standaloneAnswers,
  standaloneRevealed,
  handleStandaloneSelectOption,
  flaggedQuestions,
  toggleFlagQuestion,
  printStandaloneTest,
}) => {
  const totalQuestions = standaloneSet.questions.length;
  const answeredCount = Object.keys(standaloneAnswers).length;
  
  const scoreCount = standaloneSet.questions.filter(
    q => standaloneAnswers[q.id] === q.correctAnswerIndex
  ).length;
  
  const scorePercentage = totalQuestions > 0 ? Math.round((scoreCount / totalQuestions) * 100) : 0;

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased select-none print:bg-white print:text-black ${
      standaloneDarkMode ? 'bg-[#121212] text-stone-200' : 'bg-[#FAF9F5] text-stone-900'
    }`}>
      {/* Visual Header / Brand bar */}
      <header className={`border-b px-6 py-4 flex items-center justify-between print:hidden ${
        standaloneDarkMode ? 'bg-[#1e1e1e] border-stone-800' : 'bg-[#FCFAF7]/95 border-stone-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-stone-900 rounded-xl text-white shadow-sm flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold tracking-tight text-amber-500">
              PrepAI Sandbox Room
            </h1>
            <p className="text-[9px] font-mono opacity-60">DISTRACTION-FREE ACADEMIC EVALUATION UNIT</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light/Dark mode trigger */}
          <button
            onClick={() => setStandaloneDarkMode(!standaloneDarkMode)}
            className={`p-2 rounded-xl border transition-all ${
              standaloneDarkMode 
                ? 'bg-[#252525] border-stone-800 text-amber-400 hover:text-amber-300' 
                : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
            title="Toggle theme mode"
          >
            {standaloneDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Standalone Workspace Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Standalone Sidebar Controls */}
        <aside className={`w-full md:w-80 border-r p-6 flex flex-col justify-between print:hidden shrink-0 ${
          standaloneDarkMode ? 'bg-[#181818] border-stone-850' : 'bg-[#FCFAF7] border-stone-200'
        }`}>
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase opacity-50 block mb-1">
                Active Test Document
              </span>
              <h2 className="font-serif font-black text-sm leading-snug line-clamp-2">
                {standaloneSet.title}
              </h2>
              <span className="text-[10px] font-mono opacity-60 mt-1 block">
                Source Document: {standaloneSet.sourceName}
              </span>
            </div>

            {/* Test Mode Switcher */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Select Exam Method
              </span>
              <div className="flex p-1 bg-stone-900/10 dark:bg-stone-100/5 rounded-xl gap-1">
                <button
                  disabled={standaloneSubmitted}
                  onClick={() => setStandaloneTestMode('practice')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    standaloneTestMode === 'practice'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-850'
                  } disabled:opacity-50`}
                >
                  Practice (AILearn)
                </button>
                <button
                  disabled={standaloneSubmitted}
                  onClick={() => setStandaloneTestMode('exam')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    standaloneTestMode === 'exam'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  } disabled:opacity-50`}
                >
                  Exam (Timed)
                </button>
              </div>
            </div>

            {/* Timer/Progress Block */}
            {standaloneTestMode === 'exam' && (
              <div className={`p-3 rounded-2xl border text-center space-y-2 ${
                standaloneDarkMode ? 'bg-[#121212] border-stone-850' : 'bg-stone-50 border-stone-150'
              }`}>
                <span className="text-[10px] uppercase font-mono text-stone-500 tracking-wider font-bold block">
                  ELAPSED TIMER
                </span>
                <div className="flex items-center justify-center gap-1.5 text-xl font-mono font-bold">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>{formatTime(standaloneTimer)}</span>
                </div>
                {standaloneTimerActive ? (
                  <button
                    onClick={() => setStandaloneTimerActive(false)}
                    className="text-[10px] font-bold text-rose-500 hover:underline"
                  >
                    Pause timer
                  </button>
                ) : (
                  !standaloneSubmitted && (
                    <button
                      onClick={() => setStandaloneTimerActive(true)}
                      className="text-[10px] font-bold text-emerald-500 hover:underline"
                    >
                      Resume timer
                    </button>
                  )
                )}
              </div>
            )}

            {/* Layout switcher & Actions */}
            <div className="space-y-1.5 pt-2">
              <button
                onClick={() => setStandaloneLayoutMode(standaloneLayoutMode === 'single' ? 'list' : 'single')}
                className={`w-full py-2 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  standaloneDarkMode 
                    ? 'bg-[#1e1e1e] border-stone-800 hover:bg-stone-800 text-stone-200' 
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                {standaloneLayoutMode === 'single' ? (
                  <>
                    <Layers className="w-3.5 h-3.5 text-stone-400" />
                    Show All Questions
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                    Single Question Focus
                  </>
                )}
              </button>

              <button
                onClick={printStandaloneTest}
                className={`w-full py-2 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  standaloneDarkMode 
                    ? 'bg-[#1e1e1e] border-stone-800 hover:bg-stone-800 text-stone-200' 
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Printer className="w-3.5 h-3.5 text-stone-400" />
                Print Test / Download PDF
              </button>
            </div>

            {/* Question Navigation Map */}
            <div className="space-y-2.5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Questions Board
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {standaloneSet.questions.map((q, idx) => {
                  const isAnswered = standaloneAnswers[q.id] !== undefined;
                  const isCurrent = standaloneQuestionIndex === idx && standaloneLayoutMode === 'single';
                  const isFlagged = flaggedQuestions[q.id];
                  
                  let bgClass = '';
                  let textClass = '';
                  
                  if (isCurrent) {
                    bgClass = 'bg-stone-900 border-stone-900';
                    textClass = 'text-white font-bold';
                  } else if (isFlagged) {
                    bgClass = 'bg-amber-100 border-amber-300';
                    textClass = 'text-amber-900 font-bold';
                  } else if (isAnswered) {
                    bgClass = standaloneDarkMode ? 'bg-stone-800 border-stone-750' : 'bg-emerald-50 border-emerald-200';
                    textClass = standaloneDarkMode ? 'text-stone-300' : 'text-emerald-900 font-medium';
                  } else {
                    bgClass = standaloneDarkMode ? 'bg-[#121212] border-stone-850 hover:border-stone-700' : 'bg-stone-50 border-stone-150 hover:bg-stone-100';
                    textClass = 'text-stone-500';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setStandaloneLayoutMode('single');
                        setStandaloneQuestionIndex(idx);
                      }}
                      className={`aspect-square rounded-lg border text-[11px] font-mono flex flex-col items-center justify-center relative transition-all ${bgClass} ${textClass}`}
                      title={`Question ${idx + 1}`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer: Back button */}
          <div className={`p-4 border-t pt-4 mt-6 ${standaloneDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
            <button
              onClick={() => {
                window.location.href = window.location.origin + window.location.pathname;
              }}
              className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to PrepAI Studio
            </button>
          </div>
        </aside>

        {/* Standalone Workspace Content view */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col">
          {/* If Exam is complete, show scorecard summary overlay */}
          {standaloneSubmitted ? (
            <div className="max-w-3xl mx-auto w-full space-y-8 my-auto">
              {/* Visual scorecard */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border rounded-3xl p-8 shadow-md flex flex-col md:flex-row items-center gap-8 justify-between ${
                  standaloneDarkMode ? 'bg-[#1e1e1e] border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="p-5 bg-amber-50 rounded-2xl text-amber-600 flex items-center justify-center shrink-0">
                    <Award className="w-12 h-12" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-800 bg-amber-100/50 border border-amber-200/50 px-2 py-0.5 rounded-full">
                      Exam Session Saved
                    </span>
                    <h3 className="font-serif text-xl font-bold mt-2">Evaluation Completed!</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm">
                      Your score is instantly saved and synchronized with your active study library in the main tab.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-center md:text-right shrink-0">
                  <div className="space-y-1">
                    <span className={`text-4xl font-serif font-black block ${scorePercentage >= 80 ? 'text-emerald-500' : scorePercentage >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {scorePercentage}%
                    </span>
                    <span className="text-xs font-bold text-stone-500 block">
                      Score: {scoreCount} / {totalQuestions} Correct
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={resetStandaloneTest}
                      className="px-4 py-2 bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      Retake Exam
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Staggered detailed list of question corrections */}
              <div className="space-y-5">
                <h4 className="font-serif font-bold text-lg">Detailed Item Correction</h4>
                
                {standaloneSet.questions.map((q, qIdx) => {
                  const uAns = standaloneAnswers[q.id];
                  const isCorrect = uAns === q.correctAnswerIndex;
                  return (
                    <div
                      key={q.id}
                      className={`border p-6 rounded-2xl space-y-4 ${
                        standaloneDarkMode 
                          ? 'bg-[#1e1e1e] border-stone-850' 
                          : isCorrect 
                            ? 'bg-emerald-50/20 border-emerald-100' 
                            : uAns === undefined 
                              ? 'bg-stone-50/50 border-stone-150' 
                              : 'bg-rose-50/20 border-rose-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h5 className={`font-serif font-bold text-sm leading-relaxed ${standaloneDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                          {qIdx + 1}. {q.text}
                        </h5>
                        {uAns === undefined ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-500 font-bold shrink-0">
                            SKIPPED
                          </span>
                        ) : isCorrect ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" /> CORRECT
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold flex items-center gap-1 shrink-0">
                            <XCircle className="w-3 h-3 text-rose-600" /> INCORRECT
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isChosen = uAns === oIdx;
                          const isCorrOpt = oIdx === q.correctAnswerIndex;
                          let cardStyle = '';
                          if (isCorrOpt) {
                            cardStyle = 'bg-emerald-50 border-emerald-200 text-emerald-800';
                          } else if (isChosen) {
                            cardStyle = 'bg-rose-50 border-rose-200 text-rose-800';
                          } else {
                            cardStyle = standaloneDarkMode ? 'bg-[#121212] border-stone-800 text-stone-450' : 'bg-stone-50 border-stone-100 text-stone-600';
                          }
                          return (
                            <div key={oIdx} className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex items-center gap-2 ${cardStyle}`}>
                              <span className="font-mono font-bold shrink-0">{String.fromCharCode(65 + oIdx)}:</span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className={`p-3.5 rounded-xl text-[11px] leading-relaxed ${
                        standaloneDarkMode ? 'bg-[#121212] text-stone-400 border border-stone-850' : 'bg-stone-50 text-stone-600'
                      }`}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* If test is active and not submitted, render single-question focus mode or list mode */
            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
              {standaloneLayoutMode === 'single' ? (
                /* SINGLE FOCUS LAYOUT */
                <div className="space-y-6 my-auto">
                  {/* Header bar of focus view */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500 font-mono">
                      QUESTION {standaloneQuestionIndex + 1} OF {totalQuestions}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFlagQuestion(standaloneSet.questions[standaloneQuestionIndex].id)}
                        className={`p-2 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          flaggedQuestions[standaloneSet.questions[standaloneQuestionIndex].id]
                            ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                            : standaloneDarkMode ? 'bg-[#1e1e1e] border-stone-800 text-stone-400 hover:text-stone-200' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                        title="Flag this item to review later"
                      >
                        <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[standaloneSet.questions[standaloneQuestionIndex].id] ? 'fill-amber-500 text-amber-600' : ''}`} />
                        <span>{flaggedQuestions[standaloneSet.questions[standaloneQuestionIndex].id] ? 'Flagged' : 'Flag for review'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className={`border p-6 md:p-8 rounded-3xl shadow-sm space-y-6 ${
                    standaloneDarkMode ? 'bg-[#1e1e1e] border-stone-800' : 'bg-white border-stone-200'
                  }`}>
                    <h3 className={`font-serif text-lg md:text-xl font-bold leading-relaxed ${standaloneDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                      {standaloneSet.questions[standaloneQuestionIndex].text}
                    </h3>

                    <div className="space-y-3">
                      {standaloneSet.questions[standaloneQuestionIndex].options.map((option, idx) => {
                        const qId = standaloneSet.questions[standaloneQuestionIndex].id;
                        const isSelected = standaloneAnswers[qId] === idx;
                        const isCorrect = idx === standaloneSet.questions[standaloneQuestionIndex].correctAnswerIndex;
                        const hasBeenAnswered = standaloneRevealed[qId];

                        let optionStyle = '';
                        if (standaloneTestMode === 'practice' && hasBeenAnswered) {
                          if (isCorrect) {
                            optionStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-900';
                          } else if (isSelected) {
                            optionStyle = 'border-rose-300 bg-rose-50/30 text-rose-900';
                          } else {
                            optionStyle = standaloneDarkMode ? 'border-stone-800 bg-transparent text-stone-500' : 'border-stone-100 bg-transparent text-stone-400';
                          }
                        } else {
                          if (isSelected) {
                            optionStyle = standaloneDarkMode ? 'border-amber-500 bg-amber-500/10 text-amber-300' : 'border-stone-900 bg-stone-50 shadow-sm';
                          } else {
                            optionStyle = standaloneDarkMode ? 'border-stone-800 hover:border-stone-700 bg-transparent text-stone-300' : 'border-stone-100 hover:border-stone-200 bg-transparent text-stone-850';
                          }
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() => handleStandaloneSelectOption(qId, idx)}
                            className={`p-4.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-start gap-3 ${optionStyle}`}
                          >
                            <span className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-bold ${
                              isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-xs font-medium leading-relaxed pt-0.5">{option}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Immediate explanation under Practice Mode */}
                    {standaloneTestMode === 'practice' && standaloneRevealed[standaloneSet.questions[standaloneQuestionIndex].id] && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          standaloneAnswers[standaloneSet.questions[standaloneQuestionIndex].id] === standaloneSet.questions[standaloneQuestionIndex].correctAnswerIndex
                            ? 'bg-emerald-50 border border-emerald-100 text-emerald-900'
                            : 'bg-stone-50 border border-stone-200 text-stone-700'
                        }`}
                      >
                        <p className="font-bold mb-1.5 flex items-center gap-1">
                          {standaloneAnswers[standaloneSet.questions[standaloneQuestionIndex].id] === standaloneSet.questions[standaloneQuestionIndex].correctAnswerIndex ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              Correct! Excellent Reasoning:
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-stone-600 shrink-0" />
                              Academic Feedback:
                            </>
                          )}
                        </p>
                        <span>{standaloneSet.questions[standaloneQuestionIndex].explanation}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation bar of focus view */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      disabled={standaloneQuestionIndex === 0}
                      onClick={() => setStandaloneQuestionIndex(prev => prev - 1)}
                      className={`px-5 py-2.5 border text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        standaloneQuestionIndex === 0 
                          ? 'opacity-40 cursor-not-allowed' 
                          : standaloneDarkMode ? 'bg-[#1e1e1e] border-stone-800 hover:bg-stone-800 text-stone-200' : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous Question
                    </button>

                    <div className="text-xs font-mono font-bold text-stone-500">
                      {answeredCount} of {totalQuestions} Answered
                    </div>

                    {standaloneQuestionIndex === totalQuestions - 1 ? (
                      <button
                        onClick={submitStandaloneExam}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-all"
                      >
                        Submit Test Results
                      </button>
                    ) : (
                      <button
                        onClick={() => setStandaloneQuestionIndex(prev => prev + 1)}
                        className={`px-5 py-2.5 border text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                          standaloneDarkMode ? 'bg-[#1e1e1e] border-stone-800 hover:bg-stone-800 text-stone-200' : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        Next Question
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* LIST LAYOUT (ALL QUESTIONS) */
                <div className="space-y-8 py-4">
                  <div className="flex justify-between items-center border-b pb-4 border-stone-200">
                    <div>
                      <h3 className="font-serif text-lg font-bold">Interactive Practice Worksheet</h3>
                      <p className="text-xs text-stone-500">Select answers sequentially. Explanations will display when a choice is made.</p>
                    </div>
                    <button
                      onClick={submitStandaloneExam}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
                    >
                      Submit Test
                    </button>
                  </div>

                  <div className="space-y-6">
                    {standaloneSet.questions.map((q, qIdx) => {
                      const uAns = standaloneAnswers[q.id];
                      const isRevealed = standaloneRevealed[q.id];
                      const isCorrect = uAns === q.correctAnswerIndex;
                      
                      return (
                        <div
                          key={q.id}
                          className={`border p-6 rounded-2xl space-y-4 shadow-xs transition-all ${
                            standaloneDarkMode ? 'bg-[#1e1e1e] border-stone-800' : 'bg-white border-stone-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="font-serif font-bold text-sm leading-relaxed">
                              {qIdx + 1}. {q.text}
                            </h4>
                            <button
                              onClick={() => toggleFlagQuestion(q.id)}
                              className="p-1 text-stone-400 hover:text-amber-500"
                              title="Flag question"
                            >
                              <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[q.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {q.options.map((option, oIdx) => {
                              const isSelected = uAns === oIdx;
                              const isCorrectOpt = oIdx === q.correctAnswerIndex;
                              
                              let optStyle = '';
                              if (isRevealed && standaloneTestMode === 'practice') {
                                if (isCorrectOpt) {
                                  optStyle = 'border-emerald-500 bg-emerald-50/40 text-emerald-900';
                                } else if (isSelected) {
                                  optStyle = 'border-rose-300 bg-rose-50/20 text-rose-900';
                                } else {
                                  optStyle = 'border-stone-100 text-stone-400';
                                }
                              } else {
                                if (isSelected) {
                                  optStyle = 'border-stone-900 bg-stone-50';
                                } else {
                                  optStyle = 'border-stone-100 hover:border-stone-200';
                                }
                              }

                              return (
                                <div
                                  key={oIdx}
                                  onClick={() => handleStandaloneSelectOption(q.id, oIdx)}
                                  className={`p-3 rounded-xl border text-[11px] leading-relaxed cursor-pointer flex items-center gap-2 ${optStyle}`}
                                >
                                  <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                                    isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'
                                  }`}>
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span className="truncate">{option}</span>
                                </div>
                              );
                            })}
                          </div>

                          {standaloneTestMode === 'practice' && isRevealed && (
                            <div className={`p-3 rounded-xl text-[11px] leading-relaxed ${
                              isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-50 text-stone-600'
                            }`}>
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default StandaloneView;
