import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Clock,
  RotateCcw,
  Info,
  XCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  LogOut,
  Check
} from 'lucide-react';
import { StudySet } from '../types';
import { formatTime } from '../utils/time';

interface TestTabProps {
  currentSet: StudySet;
  testMode: 'practice' | 'exam';
  testStarted: boolean;
  startPracticeMode: () => void;
  startExamMode: () => void;
  timerSeconds: number;
  testSubmitted: boolean;
  submitExam: () => void;
  resetTestState: () => void;
  userAnswers: Record<string, number>;
  revealedExplanations: Record<string, boolean>;
  handleSelectOption: (questionId: string, optionIndex: number) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  notify: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const TestTab: React.FC<TestTabProps> = ({
  currentSet,
  testMode,
  testStarted,
  startPracticeMode,
  startExamMode,
  timerSeconds,
  testSubmitted,
  submitExam,
  resetTestState,
  userAnswers,
  revealedExplanations,
  handleSelectOption,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  notify,
}) => {
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);

  useEffect(() => {
    setIsQuestionTransitioning(true);
    const timer = setTimeout(() => {
      setIsQuestionTransitioning(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  if (!testStarted) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-3xl p-8 md:p-12 shadow-xs flex flex-col items-center text-center max-w-3xl mx-auto space-y-8 animate-fade-in">
        <div className="p-4 bg-amber-50 rounded-full text-amber-600 shadow-xs border border-amber-100">
          <Award className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-2xl font-bold text-stone-950">
            Interactive Test Center
          </h3>
          <p className="text-xs text-stone-500 max-w-lg leading-relaxed">
            Test your understanding of <strong className="text-stone-800 font-medium">{currentSet.title}</strong>. 
            Select one of the optimized learning models below to begin your session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-2">
          {/* Practice Mode Card */}
          <div className="border border-stone-200 hover:border-stone-400 bg-stone-50/40 p-6 rounded-2xl text-left flex flex-col justify-between transition-all hover:shadow-xs group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-[10px] uppercase tracking-wider font-mono border border-emerald-100">
                  PRACTICE
                </span>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 group-hover:text-stone-950">
                  Untimed Practice
                </h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Best for initial learning and review. Work through the full questionnaire at your own pace with real-time AI tutor explanations.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-stone-600 pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold font-mono">✓</span> No time constraints
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold font-mono">✓</span> Instant choice verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold font-mono">✓</span> In-depth AI tutor explanations
                </li>
              </ul>
            </div>
            <button
              onClick={startPracticeMode}
              className="mt-6 w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Start Practice Session</span>
              <ChevronRight className="w-4 h-4 text-stone-450 group-hover:text-white transition-all" />
            </button>
          </div>

          {/* Exam Mode Card */}
          <div className="border border-stone-200 hover:border-stone-400 bg-stone-50/40 p-6 rounded-2xl text-left flex flex-col justify-between transition-all hover:shadow-xs group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-bold text-[10px] uppercase tracking-wider font-mono border border-amber-100">
                  EXAM
                </span>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 group-hover:text-stone-950">
                  Simulated Exam
                </h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Best for testing your readiness. Simulates test conditions with a focused single-question viewport and detailed score report.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-stone-600 pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold font-mono">✓</span> Focused single-question view
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold font-mono">✓</span> No immediate correctness clues
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold font-mono">✓</span> Comprehensive scorecard on submit
                </li>
              </ul>
            </div>
            <button
              onClick={startExamMode}
              className="mt-6 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Start Simulated Exam</span>
              <ChevronRight className="w-4 h-4 text-stone-800" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (testStarted && !testSubmitted) {
    const answeredCount = Object.keys(userAnswers).length;
    const totalCount = currentSet.questions.length;
    const progressPercent = Math.round((answeredCount / totalCount) * 100);

    const activeQuestion = currentSet.questions[currentQuestionIndex];
    const qId = activeQuestion.id;
    const answerIndex = userAnswers[qId];
    const hasAnswered = answerIndex !== undefined;

    return (
      <div className="flex flex-col lg:flex-row gap-6 w-full items-start animate-fade-in">
        {/* Left Taskbar */}
        <div className="w-full lg:w-64 bg-white border border-stone-200 rounded-3xl p-5 flex flex-col justify-between shrink-0 h-auto lg:h-[calc(100vh-140px)] lg:sticky lg:top-6 shadow-xs">
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header depending on Practice or Exam mode */}
            {testMode === 'exam' ? (
              <div className="border-b border-stone-100 pb-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-850 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/40">
                  Exam Mode
                </span>
                <div className="flex items-center justify-between mt-1">
                  <h4 className="font-serif text-sm font-bold text-stone-900">
                    Active Session
                  </h4>
                  <span className="text-xs font-bold font-mono text-stone-600">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              <div className="border-b border-stone-100 pb-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/40">
                  Practice Mode
                </span>
                <div className="flex items-center justify-between mt-1">
                  <h4 className="font-serif text-sm font-bold text-stone-900">
                    Self-Paced
                  </h4>
                  <span className="text-xs font-bold font-mono text-stone-600">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}

            {/* Questions mini-list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 py-1 max-h-[300px] lg:max-h-none">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Questions Progress
              </span>
              {currentSet.questions.map((q, idx) => {
                const isActive = idx === currentQuestionIndex;
                const isQAnswered = userAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-stone-900 bg-stone-50 font-semibold shadow-xs'
                        : 'border-stone-100 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <span className="text-xs truncate">
                      Question {idx + 1}
                    </span>
                    {isQAnswered ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" title="Answered" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full border border-stone-300 bg-white shrink-0" title="Unanswered" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="border-t border-stone-100 pt-4 mt-4 space-y-2">
            <button
              onClick={submitExam}
              className="w-full py-2.5 bg-amber-550 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border border-amber-400/20"
            >
              <Check className="w-4 h-4 text-stone-950" />
              <span>{testMode === 'exam' ? 'Submit Exam' : 'Finish Practice'}</span>
            </button>
            <button
              onClick={() => resetTestState()}
              className="w-full py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span>Exit Test</span>
            </button>
          </div>
        </div>

        {/* Right Active Question Panel */}
        <div className="flex-1 w-full bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col justify-between min-h-[460px]">
          {isQuestionTransitioning ? (
            <div className="space-y-6 animate-pulse w-full">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="h-4 bg-stone-200 rounded w-1/4" />
                <div className="h-4 bg-stone-200 rounded w-12" />
              </div>
              <div className="space-y-2.5">
                <div className="h-5 bg-stone-200 rounded w-11/12" />
                <div className="h-5 bg-stone-200 rounded w-3/4" />
              </div>
              <div className="space-y-3.5 pt-4">
                <div className="h-14 bg-stone-100 border border-stone-200/40 rounded-2xl w-full" />
                <div className="h-14 bg-stone-100 border border-stone-200/40 rounded-2xl w-full" />
                <div className="h-14 bg-stone-100 border border-stone-200/40 rounded-2xl w-full" />
                <div className="h-14 bg-stone-100 border border-stone-200/40 rounded-2xl w-full" />
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-stone-100">
                <div className="h-9 bg-stone-100 rounded-xl w-24" />
                <div className="h-9 bg-stone-100 rounded-xl w-24" />
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
                  <span className="text-xs font-bold text-stone-500 font-mono uppercase tracking-wider">
                    QUESTION {currentQuestionIndex + 1} OF {currentSet.questions.length}
                  </span>
                  {hasAnswered && testMode === 'practice' && (
                    <span className={`text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-1 ${
                      answerIndex === activeQuestion.correctAnswerIndex ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {answerIndex === activeQuestion.correctAnswerIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" /> Incorrect
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-950 leading-relaxed mb-6">
                  {activeQuestion.text}
                </h3>

                <div className="space-y-3">
                  {activeQuestion.options.map((option, idx) => {
                    const isSelected = answerIndex === idx;
                    const isCorrectOption = idx === activeQuestion.correctAnswerIndex;

                    // Decide option styling
                    let optionStyle = 'border-stone-100 hover:border-stone-300';
                    let pillStyle = 'bg-stone-100 text-stone-600';

                    if (isSelected) {
                      if (testMode === 'practice') {
                        const isChoiceCorrect = idx === activeQuestion.correctAnswerIndex;
                        optionStyle = isChoiceCorrect 
                          ? 'border-emerald-500 bg-emerald-50/40' 
                          : 'border-rose-500 bg-rose-50/40';
                        pillStyle = isChoiceCorrect 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-rose-500 text-white';
                      } else {
                        // Exam mode: active select but do not verify yet
                        optionStyle = 'border-stone-900 bg-stone-50';
                        pillStyle = 'bg-stone-900 text-white';
                      }
                    } else if (testMode === 'practice' && hasAnswered && isCorrectOption) {
                      // Highlight correct answer in practice mode if answered incorrectly
                      optionStyle = 'border-emerald-400 bg-emerald-50/30';
                      pillStyle = 'bg-emerald-500 text-white';
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectOption(qId, idx)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          !hasAnswered || testMode === 'practice'
                            ? 'cursor-pointer'
                            : 'cursor-default'
                        } flex items-start gap-3 ${optionStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-bold ${pillStyle}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs text-stone-800 leading-relaxed pt-0.5">
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* AI Tutor Explanation Drawer (Practice mode only, after answered) */}
                {testMode === 'practice' && hasAnswered && (
                  <div className="pt-4 border-t border-stone-100 bg-stone-50/50 p-4 rounded-2xl space-y-2 mt-5 animate-fade-in">
                    <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      AI Tutor Explanation
                    </h4>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-5 border-t border-stone-100 mt-6">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex === currentSet.questions.length - 1 ? (
                  <button
                    onClick={submitExam}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 text-stone-950" />
                    <span>Submit {testMode === 'exam' ? 'Exam' : 'Practice'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle Controls */}
      <div className="flex flex-wrap items-center justify-between bg-[var(--bg-header)] border border-stone-200 p-4 rounded-3xl gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={startPracticeMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              testMode === 'practice'
                ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            Practice Mode
          </button>
          <button
            onClick={startExamMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              testMode === 'exam'
                ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            Exam Mode (Timed)
          </button>
          <button
            onClick={() => resetTestState()}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 hover:bg-stone-100 text-stone-700 transition-all bg-white"
            title="Exit active session and return to mode selection lobby"
          >
            Exit to Lobby
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Open Standalone Test in New Tab */}
          <button
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}?view=standalone-test&setId=${currentSet.id}`;
              const win = window.open(url, '_blank');
              if (!win) {
                notify('Popup blocked! Please allow popups, or open PrepAI in a separate browser window/tab first, then click again.', 'error');
              } else {
                notify('Standalone test workspace opened in a new tab!', 'success');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/50 rounded-xl text-xs font-semibold transition-all shadow-xs"
            title="Open the active test in a full, distraction-free browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
            <span>Open Test in New Tab</span>
          </button>

          {testMode === 'exam' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-xl text-xs font-mono font-bold text-stone-800">
                <Clock className="w-4 h-4 text-stone-500" />
                {formatTime(timerSeconds)}
              </div>
              {!testSubmitted && (
                <button
                  onClick={submitExam}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Submit Exam
                </button>
              )}
            </div>
          )}

          {testMode === 'practice' && (
            <button
              onClick={startPracticeMode}
              className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart Practice
            </button>
          )}
        </div>
      </div>

      {/* Mode Info Callouts */}
      {testMode === 'practice' ? (
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex gap-2.5 text-xs text-stone-700">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>Practice Mode lists all questions sequentially. Selected choices are verified instantly with in-depth tutoring explanations.</span>
        </div>
      ) : (
        testSubmitted && (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 flex items-center justify-center">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-950">Exam Session Complete</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Duration: <strong className="text-stone-800">{formatTime(timerSeconds)}</strong> • Questions answered: {Object.keys(userAnswers).length} of {currentSet.questions.length}
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <span className="text-3xl font-serif font-black text-stone-950 block">
                {Math.round((currentSet.questions.filter(q => userAnswers[q.id] === q.correctAnswerIndex).length / currentSet.questions.length) * 105) > 100 
                  ? Math.round((currentSet.questions.filter(q => userAnswers[q.id] === q.correctAnswerIndex).length / currentSet.questions.length) * 100)
                  : Math.round((currentSet.questions.filter(q => userAnswers[q.id] === q.correctAnswerIndex).length / currentSet.questions.length) * 100)}%
              </span>
              <span className="text-xs font-semibold text-stone-600 mt-1 block">
                Score: {currentSet.questions.filter(q => userAnswers[q.id] === q.correctAnswerIndex).length} / {currentSet.questions.length} Correct
              </span>
            </div>

            <button
              onClick={startExamMode}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Retake Exam
            </button>
          </div>
        )
      )}

      {/* Sequential Exam Question Navigation or Practice list */}
      {testMode === 'exam' && !testSubmitted ? (
        // Single Question Viewer (Exam Mode)
        <div>
          {currentSet.questions.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-3xl shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <span className="text-xs font-bold text-stone-500 font-mono">
                  QUESTION {currentQuestionIndex + 1} OF {currentSet.questions.length}
                </span>
                <div className="flex gap-1">
                  {currentSet.questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentQuestionIndex 
                          ? 'bg-stone-900' 
                          : userAnswers[currentSet.questions[idx].id] !== undefined
                            ? 'bg-amber-400'
                            : 'bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-stone-950 leading-relaxed">
                {currentSet.questions[currentQuestionIndex].text}
              </h3>

              <div className="space-y-3">
                {currentSet.questions[currentQuestionIndex].options.map((option, idx) => {
                  const qId = currentSet.questions[currentQuestionIndex].id;
                  const isSelected = userAnswers[qId] === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(qId, idx)}
                      className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-stone-900 bg-stone-50 shadow-sm'
                          : 'border-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-bold ${
                        isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs text-stone-800 leading-relaxed pt-0.5">{option}</span>
                    </div>
                  );
                })}
              </div>

              {/* Nav buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4.5 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentQuestionIndex === currentSet.questions.length - 1 ? (
                  <button
                    onClick={submitExam}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-sm transition-all"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-4.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Full list presentation (Practice Mode OR Exam Score Review)
        <div className="space-y-6">
          {currentSet.questions.map((question, qIdx) => {
            const answerIndex = userAnswers[question.id];
            const hasAnswered = answerIndex !== undefined;
            const isCorrect = answerIndex === question.correctAnswerIndex;
            const showExplanation = revealedExplanations[question.id] || testSubmitted;

            return (
              <div
                key={question.id}
                className={`bg-white border rounded-3xl p-6 md:p-8 shadow-sm space-y-5 transition-all ${
                  hasAnswered && testMode === 'practice'
                    ? isCorrect
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-rose-200 bg-rose-50/10'
                    : 'border-stone-200/80'
                }`}
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-xs font-bold text-stone-500 font-mono">
                    QUESTION {qIdx + 1}
                  </span>
                  {hasAnswered && (
                    <span className={`text-[10px] uppercase font-mono font-bold tracking-wider flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" /> Incorrect
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base font-bold text-stone-950 leading-relaxed">
                  {question.text}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, oIdx) => {
                    const isSelected = answerIndex === oIdx;
                    const isCorrectOption = oIdx === question.correctAnswerIndex;

                    // Decide option colors based on test state
                    let optionStyle = 'border-stone-100 hover:border-stone-300';
                    let pillStyle = 'bg-stone-100 text-stone-600';

                    if (isSelected) {
                      if (testMode === 'practice') {
                        optionStyle = isCorrect 
                          ? 'border-emerald-500 bg-emerald-50/40' 
                          : 'border-rose-500 bg-rose-50/40';
                        pillStyle = isCorrect 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-rose-500 text-white';
                      } else {
                        // Exam mode submitted
                        if (testSubmitted) {
                          optionStyle = isCorrectOption 
                            ? 'border-emerald-500 bg-emerald-50/30' 
                            : 'border-rose-500 bg-rose-50/30';
                          pillStyle = isCorrectOption 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-rose-500 text-white';
                        } else {
                          optionStyle = 'border-stone-900 bg-stone-50';
                          pillStyle = 'bg-stone-900 text-white';
                        }
                      }
                    } else if (showExplanation && isCorrectOption) {
                      // Highlight correct answer if incorrect choice was selected or test is submitted
                      optionStyle = 'border-emerald-400 bg-emerald-50/30';
                      pillStyle = 'bg-emerald-500 text-white';
                    }

                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(question.id, oIdx)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          (!hasAnswered || testMode === 'practice') && !testSubmitted
                            ? 'cursor-pointer'
                            : 'cursor-default'
                        } flex items-start gap-3 ${optionStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs font-bold ${pillStyle}`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-xs text-stone-800 leading-relaxed pt-0.5">{option}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Tutoring Explanation Drawer */}
                {showExplanation && (
                  <div className="pt-4 border-t border-stone-100 bg-stone-50/50 p-4 rounded-2xl space-y-2">
                    <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      AI Tutor Explanation
                    </h4>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default TestTab;
