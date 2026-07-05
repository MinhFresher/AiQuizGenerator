import React from 'react';
import { Layers, Check, PlusCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { StudySet } from '../types';

interface FlashcardTabProps {
  currentSet: StudySet;
  flashcardIndex: number;
  flashcardFlipped: boolean;
  setFlashcardFlipped: (flipped: boolean) => void;
  masteredFlashcards: Record<string, boolean>;
  toggleFlashcardMastery: (id: string) => void;
  handlePrevCard: () => void;
  handleNextCard: () => void;
}

export const FlashcardTab: React.FC<FlashcardTabProps> = ({
  currentSet,
  flashcardIndex,
  flashcardFlipped,
  setFlashcardFlipped,
  masteredFlashcards,
  toggleFlashcardMastery,
  handlePrevCard,
  handleNextCard,
}) => {
  const currentCard = currentSet.flashcards[flashcardIndex];

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
        <span>CARD {flashcardIndex + 1} OF {currentSet.flashcards.length}</span>
        <span>
          Mastered: {Object.keys(masteredFlashcards).filter(id => masteredFlashcards[id]).length} of {currentSet.flashcards.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${((flashcardIndex + 1) / currentSet.flashcards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard item - elegant 3D double sided flip */}
      <div
        className="h-80 perspective-1000 w-full cursor-pointer"
        onClick={() => setFlashcardFlipped(!flashcardFlipped)}
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          flashcardFlipped ? 'rotate-y-180' : ''
        }`}>
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-stone-200 p-8 flex flex-col justify-between shadow-md backface-hidden">
            <span className="text-[9px] uppercase tracking-widest font-mono text-stone-400 font-bold block">
              Concept Term
            </span>
            <div className="flex-1 flex items-center justify-center text-center">
              <h3 className="font-serif text-xl font-bold text-stone-900 leading-relaxed">
                {currentCard?.front}
              </h3>
            </div>
            <div className="text-center text-[10px] text-stone-400 font-mono">
              Click card to flip and view definition
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-stone-100 border border-stone-200 p-8 flex flex-col justify-between shadow-md backface-hidden rotate-y-180">
            <span className="text-[9px] uppercase tracking-widest font-mono text-amber-800 font-bold block">
              AI Explanation / Back
            </span>
            <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
              <p className="font-sans text-xs text-stone-700 leading-relaxed font-medium">
                {currentCard?.back}
              </p>
            </div>
            <div className="text-center text-[10px] text-stone-400 font-mono">
              Click to flip back to term
            </div>
          </div>
        </div>
      </div>

      {/* Card controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (currentCard) toggleFlashcardMastery(currentCard.id);
          }}
          className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentCard && masteredFlashcards[currentCard.id]
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
          }`}
        >
          {currentCard && masteredFlashcards[currentCard.id] ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              Mastered
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 text-stone-400" />
              Mark as Mastered
            </>
          )}
        </button>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevCard();
            }}
            className="p-3 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-stone-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextCard();
            }}
            className="p-3 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-all"
          >
            <ArrowRight className="w-4 h-4 text-stone-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default FlashcardTab;
