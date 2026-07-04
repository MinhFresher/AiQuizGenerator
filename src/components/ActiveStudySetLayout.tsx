import React from 'react';
import { Download, Trash2, FileText, Award, Layers, BookOpen, Edit } from 'lucide-react';
import { StudySet, Question } from '../types';
import TestTab from './TestTab';
import FlashcardTab from './FlashcardTab';
import GuideTab from './GuideTab';
import QuestionsTab from './QuestionsTab';

interface ActiveStudySetLayoutProps {
  currentSet: StudySet;
  activeTab: 'test' | 'flashcards' | 'guide' | 'questions';
  setActiveTab: (tab: 'test' | 'flashcards' | 'guide' | 'questions') => void;
  deleteStudySet: (id: string) => void;
  handleExportStudySet: (set: StudySet) => void;
  
  // Test Tab Props
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

  // Flashcards Tab Props
  flashcardIndex: number;
  flashcardFlipped: boolean;
  setFlashcardFlipped: (flipped: boolean) => void;
  masteredFlashcards: Record<string, boolean>;
  toggleFlashcardMastery: (id: string) => void;
  handlePrevCard: () => void;
  handleNextCard: () => void;

  // Guide Tab Props
  copyStudyGuide: () => void;
  downloadStudyGuide: () => void;

  // Questions Tab Props
  generateMoreQuestions: () => void;
  isGenerating: boolean;
  startAddQuestion: () => void;
  setEditingQuestion: (question: Question | null) => void;
  deleteQuestion: (id: string) => void;
}

export const ActiveStudySetLayout: React.FC<ActiveStudySetLayoutProps> = ({
  currentSet,
  activeTab,
  setActiveTab,
  deleteStudySet,
  handleExportStudySet,

  // Test Tab
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

  // Flashcards Tab
  flashcardIndex,
  flashcardFlipped,
  setFlashcardFlipped,
  masteredFlashcards,
  toggleFlashcardMastery,
  handlePrevCard,
  handleNextCard,

  // Guide Tab
  copyStudyGuide,
  downloadStudyGuide,

  // Questions Tab
  generateMoreQuestions,
  isGenerating,
  startAddQuestion,
  setEditingQuestion,
  deleteQuestion,
}) => {
  const isTestingActive = activeTab === 'test' && testStarted && !testSubmitted;

  return (
    <div className={`${isTestingActive ? 'max-w-6xl' : 'max-w-4xl'} mx-auto w-full flex-1 flex flex-col`}>
      {/* Active Set Card Header */}
      {!isTestingActive && (
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-5 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-800 font-mono font-bold uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                Active Study Set
              </span>
              <button
                onClick={() => handleExportStudySet(currentSet)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full border border-stone-250/30 text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                title="Export this study set as a JSON file"
              >
                <Download className="w-3 h-3 text-stone-600" />
                Export Set (JSON)
              </button>
              <button
                onClick={() => deleteStudySet(currentSet.id)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-full border border-rose-200/50 text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                title="Delete this study set permanently"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-650" />
                Delete Set
              </button>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-950 mt-2.5">
              {currentSet.title}
            </h2>
            <p className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-stone-400 shrink-0" />
              Source: <strong className="text-stone-800 font-medium">{currentSet.sourceName}</strong> • Generated on {currentSet.createdDate}
            </p>
          </div>

          {/* Workspace tab navigation bar */}
          <div className="flex border border-stone-200 bg-white p-1 rounded-2xl shadow-sm overflow-x-auto self-start md:self-center">
            <button
              onClick={() => setActiveTab('test')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'test' 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Award className="w-4 h-4" />
              Interactive Test
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'flashcards' 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'guide' 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Study Guide
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'questions' 
                  ? 'bg-stone-900 text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Edit className="w-4 h-4" />
              Manage Questions ({currentSet.questions.length})
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Workspace Container */}
      <div className="flex-1 min-h-[400px]">
        {activeTab === 'test' && (
          <TestTab
            currentSet={currentSet}
            testMode={testMode}
            testStarted={testStarted}
            startPracticeMode={startPracticeMode}
            startExamMode={startExamMode}
            timerSeconds={timerSeconds}
            testSubmitted={testSubmitted}
            submitExam={submitExam}
            resetTestState={resetTestState}
            userAnswers={userAnswers}
            revealedExplanations={revealedExplanations}
            handleSelectOption={handleSelectOption}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            notify={notify}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardTab
            currentSet={currentSet}
            flashcardIndex={flashcardIndex}
            flashcardFlipped={flashcardFlipped}
            setFlashcardFlipped={setFlashcardFlipped}
            masteredFlashcards={masteredFlashcards}
            toggleFlashcardMastery={toggleFlashcardMastery}
            handlePrevCard={handlePrevCard}
            handleNextCard={handleNextCard}
          />
        )}

        {activeTab === 'guide' && (
          <GuideTab
            currentSet={currentSet}
            copyStudyGuide={copyStudyGuide}
            downloadStudyGuide={downloadStudyGuide}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionsTab
            currentSet={currentSet}
            generateMoreQuestions={generateMoreQuestions}
            isGenerating={isGenerating}
            startAddQuestion={startAddQuestion}
            setEditingQuestion={setEditingQuestion}
            deleteQuestion={deleteQuestion}
          />
        )}
      </div>
    </div>
  );
};
export default ActiveStudySetLayout;
