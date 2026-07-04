export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  sourceName: string;
  questions: Question[];
  flashcards: Flashcard[];
  studyGuide: string;
  lastScore?: {
    score: number;
    total: number;
    date: string;
    mode: 'practice' | 'exam';
  };
}
