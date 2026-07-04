import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Brain } from 'lucide-react';
import { StudySet, Question } from './types';
import { STARTER_STUDY_SET } from './data/starterSet';
import { formatTime } from './utils/time';
import NotificationToast from './components/NotificationToast';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Uploader from './components/Uploader';
import ActiveStudySetLayout from './components/ActiveStudySetLayout';
import StandaloneView from './components/StandaloneView';
import QuestionModal from './components/QuestionModal';

export default function App() {
  // Navigation & Core states
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [currentSetId, setCurrentSetId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'test' | 'flashcards' | 'guide' | 'questions'>('test');
  const [sidebarTab, setSidebarTab] = useState<'sets' | 'tests'>('sets');
  
  // File Uploader inputs
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [generationCount, setGenerationCount] = useState<number | string>(10);
  const [dragActive, setDragActive] = useState(false);

  // Active Test interface states
  const [testMode, setTestMode] = useState<'practice' | 'exam'>('practice');
  const [testStarted, setTestStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Standalone mode states
  const [standaloneMode, setStandaloneMode] = useState(false);
  const [standaloneSetId, setStandaloneSetId] = useState<string | null>(null);
  const [standaloneAnswers, setStandaloneAnswers] = useState<Record<string, number>>({});
  const [standaloneRevealed, setStandaloneRevealed] = useState<Record<string, boolean>>({});
  const [standaloneSubmitted, setStandaloneSubmitted] = useState(false);
  const [standaloneQuestionIndex, setStandaloneQuestionIndex] = useState(0);
  const [standaloneTimer, setStandaloneTimer] = useState(0);
  const [standaloneTimerActive, setStandaloneTimerActive] = useState(false);
  const [standaloneTestMode, setStandaloneTestMode] = useState<'practice' | 'exam'>('practice');
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [standaloneDarkMode, setStandaloneDarkMode] = useState(false);
  const [standaloneLayoutMode, setStandaloneLayoutMode] = useState<'single' | 'list'>('single');
  
  // Exam mode timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active Flashcards interface states
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [masteredFlashcards, setMasteredFlashcards] = useState<Record<string, boolean>>({});

  // Question Editor modal state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Feedback notifications
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // On mount: Load study sets from localStorage, fallback to empty array if none
  useEffect(() => {
    const saved = localStorage.getItem('prepai_studysets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setStudySets(parsed);
          setCurrentSetId(null); // Default to homepage generator
        } else {
          setStudySets([]);
        }
      } catch (e) {
        setStudySets([]);
      }
    } else {
      setStudySets([]);
    }
  }, []);

  // Standalone parameters detector
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const setId = params.get('setId');
    if (view === 'standalone-test' && setId) {
      setStandaloneSetId(setId);
      setStandaloneMode(true);
    }
  }, []);

  // Multi-tab storage synchronization listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'prepai_studysets' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.length > 0) {
            setStudySets(parsed);
          }
        } catch (err) {
          console.error('Storage sync error:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Dedicated standalone timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (standaloneTimerActive) {
      interval = setInterval(() => {
        setStandaloneTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [standaloneTimerActive]);

  const currentSet = studySets.find(s => s.id === currentSetId) || null;
  const standaloneSet = studySets.find(s => s.id === standaloneSetId) || null;

  // Track timer during Exam Mode
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive]);

  // Toast notifier helper
  const notify = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(prev => prev?.text === text ? null : prev);
    }, 4500);
  };

  // Drag and Drop files handlings
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'];
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      
      if (validTypes.includes(droppedFile.type) || ext === 'docx' || ext === 'pdf' || ext === 'txt' || ext === 'md') {
        setUploadFile(droppedFile);
        notify(`Attached: ${droppedFile.name}`, 'success');
      } else {
        notify('Unsupported file. Please attach PDF, Word Document, or Text files.', 'error');
      }
    }
  };

  const selectFileManually = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      notify(`Attached: ${e.target.files[0].name}`, 'success');
    }
  };

  // Core implementation: Read uploaded file and invoke Gemini Generation API
  const handleGenerateStudySet = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadFile && !pastedText.trim()) {
      notify('Please provide either a PDF/Word file or paste notes to generate the test.', 'error');
      return;
    }

    setIsGenerating(true);
    notify('PrepAI is extracting data & generating materials with Gemini...', 'info');

    try {
      let fileType = 'copy-paste';
      let fileData = pastedText;
      let name = 'Custom Input Text';

      if (uploadFile) {
        name = uploadFile.name;
        const ext = uploadFile.name.split('.').pop()?.toLowerCase() || '';
        
        if (ext === 'pdf') {
          fileType = 'pdf';
        } else if (ext === 'docx') {
          fileType = 'docx';
        } else {
          fileType = 'txt';
        }

        // Convert file to Base64 to send to server safely
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          if (fileType === 'pdf' || fileType === 'docx') {
            reader.readAsDataURL(uploadFile);
            reader.onload = () => {
              const base64 = (reader.result as string).split(',')[1];
              resolve(base64);
            };
          } else {
            // plain text
            reader.readAsText(uploadFile);
            reader.onload = () => resolve(reader.result as string);
          }
          reader.onerror = (err) => reject(err);
        });
      }

      const response = await fetch('/api/generate-study-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: name,
          fileType,
          fileData,
          generationCount,
          customInstructions: generationCount === 'auto' 
            ? `Extract ALL multiple-choice questions found in the file, or generate a comprehensive set of 10-30 questions if none are in the file. ${customInstructions}` 
            : `Generate ${generationCount} multiple-choice questions. ${customInstructions}`
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Gemini study set service failed.');
      }

      const generatedSet = await response.json();

      // Add client-side tracking variables
      const cleanSet: StudySet = {
        id: `set-${Date.now()}`,
        title: generatedSet.title || `Study Set: ${name}`,
        description: generatedSet.description || 'Custom generated set.',
        createdDate: new Date().toLocaleDateString(),
        sourceName: name,
        questions: (generatedSet.questions || []).map((q: any, i: number) => ({
          ...q,
          id: `q-${Date.now()}-${i}`
        })),
        flashcards: (generatedSet.flashcards || []).map((f: any, i: number) => ({
          ...f,
          id: `f-${Date.now()}-${i}`
        })),
        studyGuide: generatedSet.studyGuide || '# Study Guide\nNo guide was generated.'
      };

      if (cleanSet.questions.length === 0) {
        throw new Error('Gemini failed to extract questions. Please check your uploaded content.');
      }

      const updatedSets = [cleanSet, ...studySets];
      setStudySets(updatedSets);
      setCurrentSetId(cleanSet.id);
      localStorage.setItem('prepai_studysets', JSON.stringify(updatedSets));
      
      // Clear inputs
      setUploadFile(null);
      setPastedText('');
      setCustomInstructions('');

      // Focus test tab
      setActiveTab('test');
      resetTestState();
      notify('Study set created successfully! Complete study guide and test are ready.', 'success');
    } catch (error: any) {
      console.error(error);
      notify(`Generation Error: ${error.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportStudySet = (set: StudySet) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(set, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const fileName = `${set.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
      downloadAnchor.setAttribute("download", fileName);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      notify(`Successfully exported study set: "${set.title}"`, 'success');
    } catch (err) {
      notify('Failed to export study set.', 'error');
      console.error(err);
    }
  };

  const handleImportStudySet = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          
          if (!parsed.title || !Array.isArray(parsed.questions)) {
            notify('Invalid file format. The JSON file must be a valid PrepAI Study Set.', 'error');
            return;
          }

          const newId = `set-${Date.now()}`;
          const importedSet: StudySet = {
            id: newId,
            title: parsed.title,
            description: parsed.description || 'Imported study set',
            createdDate: new Date().toLocaleDateString(),
            sourceName: parsed.sourceName || file.name,
            questions: parsed.questions.map((q: any, i: number) => ({
              id: q.id || `q-${Date.now()}-${i}`,
              text: q.text || 'Unnamed Question',
              options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
              explanation: q.explanation || ''
            })),
            flashcards: Array.isArray(parsed.flashcards) ? parsed.flashcards.map((f: any, i: number) => ({
              id: f.id || `f-${Date.now()}-${i}`,
              front: f.front || 'Front Side',
              back: f.back || 'Back Side'
            })) : [],
            studyGuide: parsed.studyGuide || '# Study Guide\nNo guide was attached.',
            lastScore: parsed.lastScore
          };

          const updatedSets = [importedSet, ...studySets];
          setStudySets(updatedSets);
          localStorage.setItem('prepai_studysets', JSON.stringify(updatedSets));
          setCurrentSetId(newId);
          setActiveTab('test');
          resetTestState();
          notify(`Successfully imported study set: "${importedSet.title}"`, 'success');
        } catch (error) {
          notify('Failed to parse the JSON file. Ensure it is a valid JSON format.', 'error');
          console.error(error);
        }
      };
      reader.readAsText(file);
      e.target.value = ''; // Reset input
    }
  };

  // Test session state handlers
  const resetTestState = (keepStartedState: boolean = false) => {
    setUserAnswers({});
    setRevealedExplanations({});
    setTestSubmitted(false);
    setCurrentQuestionIndex(0);
    setTimerSeconds(0);
    setTimerActive(false);
    if (!keepStartedState) {
      setTestStarted(false);
    }
  };

  const handleSelectOption = (questionId: string, index: number) => {
    if (testSubmitted) return; // locked once exam is submitted
    
    setUserAnswers(prev => ({ ...prev, [questionId]: index }));

    if (testMode === 'practice') {
      // reveal answer and explanation instantly in practice mode
      setRevealedExplanations(prev => ({ ...prev, [questionId]: true }));
    }
  };

  const startExamMode = () => {
    resetTestState(true);
    setTestMode('exam');
    setTimerActive(true);
    setTestStarted(true);
    notify('Exam Mode Started! Timer is ticking.', 'success');
  };

  const startPracticeMode = () => {
    resetTestState(true);
    setTestMode('practice');
    setTestStarted(true);
    notify('Practice Mode enabled. Review answers and explanations step-by-step.', 'info');
  };

  const submitExam = () => {
    if (!currentSet) return;
    setTimerActive(false);
    setTestSubmitted(true);

    // Calculate score
    let score = 0;
    currentSet.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });

    const updatedSets = studySets.map(s => {
      if (s.id === currentSetId) {
        return {
          ...s,
          lastScore: {
            score,
            total: s.questions.length,
            date: new Date().toLocaleDateString(),
            mode: testMode
          }
        };
      }
      return s;
    });

    setStudySets(updatedSets);
    localStorage.setItem('prepai_studysets', JSON.stringify(updatedSets));
    notify(`Exam submitted! You scored ${score}/${currentSet.questions.length} (${Math.round((score / currentSet.questions.length) * 100)}%)`, 'success');
  };

  // Flashcards state helpers
  const handlePrevCard = () => {
    setFlashcardFlipped(false);
    setTimeout(() => {
      setFlashcardIndex(prev => (prev === 0 ? (currentSet?.flashcards.length || 1) - 1 : prev - 1));
    }, 150);
  };

  const handleNextCard = () => {
    setFlashcardFlipped(false);
    setTimeout(() => {
      setFlashcardIndex(prev => (prev === (currentSet?.flashcards.length || 1) - 1 ? 0 : prev + 1));
    }, 150);
  };

  const toggleFlashcardMastery = (cardId: string) => {
    setMasteredFlashcards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // AI CORE INTEGRATION: Request Gemini to expand current test by 5 more questions
  const generateMoreQuestions = async () => {
    if (!currentSet) return;
    
    setIsGenerating(true);
    notify('Requesting Gemini to construct 5 more unique questions from the current guide...', 'info');

    try {
      const response = await fetch('/api/generate-more-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentSet.title,
          studyGuide: currentSet.studyGuide,
          count: 5
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error.');
      }

      const data = await response.json();
      const newQuestions = (data.questions || []).map((q: any, i: number) => ({
        ...q,
        id: `q-added-${Date.now()}-${i}`
      }));

      if (newQuestions.length === 0) {
        throw new Error('No new questions returned.');
      }

      const updatedSet = {
        ...currentSet,
        questions: [...currentSet.questions, ...newQuestions]
      };

      const updatedSets = studySets.map(s => s.id === currentSetId ? updatedSet : s);
      setStudySets(updatedSets);
      localStorage.setItem('prepai_studysets', JSON.stringify(updatedSets));
      
      notify(`Successfully added ${newQuestions.length} new test questions!`, 'success');
    } catch (e: any) {
      console.error(e);
      notify(`Addition failed: ${e.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Question Management: Save edited question or create new manual question
  const saveEditedQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !currentSet) return;

    // Validate
    if (!editingQuestion.text.trim()) {
      notify('Question text cannot be empty.', 'error');
      return;
    }
    if (editingQuestion.options.some(opt => !opt.trim())) {
      notify('All options must be filled.', 'error');
      return;
    }

    let updatedQuestions;
    if (isAddingQuestion) {
      updatedQuestions = [...currentSet.questions, { ...editingQuestion, id: `q-manual-${Date.now()}` }];
      notify('New question added to the test!', 'success');
    } else {
      updatedQuestions = currentSet.questions.map(q => q.id === editingQuestion.id ? editingQuestion : q);
      notify('Question updated.', 'success');
    }

    const updatedSet = { ...currentSet, questions: updatedQuestions };
    const updatedSets = studySets.map(s => s.id === currentSetId ? updatedSet : s);
    
    setStudySets(updatedSets);
    localStorage.setItem('prepai_studysets', JSON.stringify(updatedSets));
    
    setEditingQuestion(null);
    setIsAddingQuestion(false);
  };

  const startAddQuestion = () => {
    setIsAddingQuestion(true);
    setEditingQuestion({
      id: '',
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: 'Manual question. Solved and updated by user.'
    });
  };

  const deleteQuestion = (id: string) => {
    if (!currentSet) return;
    if (currentSet.questions.length <= 1) {
      notify('A test must have at least 1 question.', 'error');
      return;
    }

    const updatedQuestions = currentSet.questions.filter(q => q.id !== id);
    const updatedSet = { ...currentSet, questions: updatedQuestions };
    const updatedSets = studySets.map(s => s.id === currentSetId ? updatedSet : s);
    
    setStudySets(updatedSets);
    localStorage.setItem('prepai_studysets', JSON.stringify(updatedSets));
    resetTestState();
    notify('Question deleted from exam.', 'info');
  };

  const deleteStudySet = (id: string) => {
    setDeleteConfirmId(id);
  };

  const onConfirmDelete = (id: string) => {
    const studySetToDelete = studySets.find(s => s.id === id);
    const title = studySetToDelete ? studySetToDelete.title : 'this study set';
    const filtered = studySets.filter(s => s.id !== id);
    setStudySets(filtered);
    localStorage.setItem('prepai_studysets', JSON.stringify(filtered));
    if (currentSetId === id) {
      setCurrentSetId(null);
    }
    setDeleteConfirmId(null);
    notify(`Permanently deleted "${title}"`, 'success');
  };

  // Helper: Copies study guide markdown content to clipboard
  const copyStudyGuide = () => {
    if (!currentSet) return;
    navigator.clipboard.writeText(currentSet.studyGuide);
    notify('Study Guide Markdown copied to clipboard!', 'success');
  };

  // Helper: Downloads study guide markdown file
  const downloadStudyGuide = () => {
    if (!currentSet) return;
    const element = document.createElement('a');
    const file = new Blob([currentSet.studyGuide], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentSet.title.replace(/\s+/g, '_')}_Study_Guide.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    notify('Markdown file downloaded successfully.', 'success');
  };

  if (standaloneMode) {
    if (!standaloneSet) {
      return (
        <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-stone-100 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-stone-500 animate-pulse" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Loading Standalone Exam Room...</h3>
          <p className="text-xs text-stone-500 max-w-sm mb-6">Reading the requested study set from your secure local database.</p>
          <button
            onClick={() => {
              window.location.search = '';
            }}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Back to Study Studio
          </button>
        </div>
      );
    }

    const startStandaloneExamMode = () => {
      setStandaloneAnswers({});
      setStandaloneRevealed({});
      setStandaloneSubmitted(false);
      setStandaloneQuestionIndex(0);
      setStandaloneTimer(0);
      setStandaloneTimerActive(true);
      setStandaloneTestMode('exam');
      setFlaggedQuestions({});
    };

    const startStandalonePracticeMode = () => {
      setStandaloneAnswers({});
      setStandaloneRevealed({});
      setStandaloneSubmitted(false);
      setStandaloneQuestionIndex(0);
      setStandaloneTimer(0);
      setStandaloneTimerActive(false);
      setStandaloneTestMode('practice');
      setFlaggedQuestions({});
    };

    const resetStandaloneTest = () => {
      setStandaloneAnswers({});
      setStandaloneRevealed({});
      setStandaloneSubmitted(false);
      setStandaloneQuestionIndex(0);
      setStandaloneTimer(0);
      setFlaggedQuestions({});
      if (standaloneTestMode === 'exam') {
        setStandaloneTimerActive(true);
      } else {
        setStandaloneTimerActive(false);
      }
    };

    const handleStandaloneSelectOption = (questionId: string, optionIndex: number) => {
      if (standaloneSubmitted) return;
      setStandaloneAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
      
      if (standaloneTestMode === 'practice') {
        setStandaloneRevealed(prev => ({ ...prev, [questionId]: true }));
      }
    };

    const toggleFlagQuestion = (questionId: string) => {
      setFlaggedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
    };

    const submitStandaloneExam = () => {
      // Calculate score Count
      const count = standaloneSet.questions.filter(q => standaloneAnswers[q.id] === q.correctAnswerIndex).length;
      setStandaloneTimerActive(false);
      setStandaloneSubmitted(true);

      // Save result back to core studySets
      const updatedSets = studySets.map(s => {
        if (s.id === standaloneSetId) {
          return {
            ...s,
            lastScore: {
              score: count,
              total: standaloneSet.questions.length,
              date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              mode: standaloneTestMode
            }
          };
        }
        return s;
      });

      setStudySets(updatedSets);
      localStorage.setItem('prepai_studysets', JSON.stringify(updatedSets));
      notify(`Exam submitted! You scored ${count}/${standaloneSet.questions.length}`, 'success');
    };

    const printStandaloneTest = () => {
      window.print();
    };

    return (
      <StandaloneView
        standaloneSet={standaloneSet}
        standaloneTestMode={standaloneTestMode}
        setStandaloneTestMode={(mode) => {
          if (mode === 'practice') startStandalonePracticeMode();
          else startStandaloneExamMode();
        }}
        standaloneDarkMode={standaloneDarkMode}
        setStandaloneDarkMode={setStandaloneDarkMode}
        standaloneTimer={standaloneTimer}
        standaloneTimerActive={standaloneTimerActive}
        setStandaloneTimerActive={setStandaloneTimerActive}
        standaloneSubmitted={standaloneSubmitted}
        submitStandaloneExam={submitStandaloneExam}
        resetStandaloneTest={resetStandaloneTest}
        standaloneLayoutMode={standaloneLayoutMode}
        setStandaloneLayoutMode={setStandaloneLayoutMode}
        standaloneQuestionIndex={standaloneQuestionIndex}
        setStandaloneQuestionIndex={setStandaloneQuestionIndex}
        standaloneAnswers={standaloneAnswers}
        standaloneRevealed={standaloneRevealed}
        handleStandaloneSelectOption={handleStandaloneSelectOption}
        flaggedQuestions={flaggedQuestions}
        toggleFlagQuestion={toggleFlagQuestion}
        printStandaloneTest={printStandaloneTest}
      />
    );
  }

  const isTestingActive = !!currentSetId && activeTab === 'test' && testStarted && !testSubmitted;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 font-sans flex flex-col antialiased">
      {/* Visual Header / Brand bar */}
      {!isTestingActive && (
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onLogoClick={() => {
            setCurrentSetId(null);
            resetTestState();
          }}
        />
      )}

      {/* Floating alert toast notifications */}
      <AnimatePresence>
        {feedbackMsg && (
          <NotificationToast message={feedbackMsg} />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {!isTestingActive && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            sidebarTab={sidebarTab}
            setSidebarTab={setSidebarTab}
            studySets={studySets}
            currentSetId={currentSetId}
            setCurrentSetId={setCurrentSetId}
            resetTestState={resetTestState}
            setFlashcardIndex={setFlashcardIndex}
            setFlashcardFlipped={setFlashcardFlipped}
            setTestMode={setTestMode}
            setActiveTab={setActiveTab}
            deleteStudySet={deleteStudySet}
            notify={notify}
          />
        )}

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto flex flex-col ${isTestingActive ? 'p-4 md:p-8' : 'p-6 md:p-10'}`}>
          {currentSet ? (
            <ActiveStudySetLayout
              currentSet={currentSet}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              deleteStudySet={deleteStudySet}
              handleExportStudySet={handleExportStudySet}
              
              // Test Tab
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

              // Flashcards Tab
              flashcardIndex={flashcardIndex}
              flashcardFlipped={flashcardFlipped}
              setFlashcardFlipped={setFlashcardFlipped}
              masteredFlashcards={masteredFlashcards}
              toggleFlashcardMastery={toggleFlashcardMastery}
              handlePrevCard={handlePrevCard}
              handleNextCard={handleNextCard}

              // Guide Tab
              copyStudyGuide={copyStudyGuide}
              downloadStudyGuide={downloadStudyGuide}

              // Questions Tab
              generateMoreQuestions={generateMoreQuestions}
              isGenerating={isGenerating}
              startAddQuestion={startAddQuestion}
              setEditingQuestion={setEditingQuestion}
              deleteQuestion={deleteQuestion}
            />
          ) : (
            <Uploader
              handleGenerateStudySet={handleGenerateStudySet}
              uploadFile={uploadFile}
              pastedText={pastedText}
              setPastedText={setPastedText}
              customInstructions={customInstructions}
              setCustomInstructions={setCustomInstructions}
              generationCount={generationCount}
              setGenerationCount={setGenerationCount}
              dragActive={dragActive}
              isGenerating={isGenerating}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              selectFileManually={selectFileManually}
              handleImportStudySet={handleImportStudySet}
              studySets={studySets}
              setSidebarTab={setSidebarTab}
              setCurrentSetId={setCurrentSetId}
              deleteStudySet={deleteStudySet}
              handleExportStudySet={handleExportStudySet}
            />
          )}
        </main>
      </div>

      {/* Modals Container */}
      <AnimatePresence>
        {editingQuestion && (
          <QuestionModal
            editingQuestion={editingQuestion}
            setEditingQuestion={setEditingQuestion}
            isAddingQuestion={isAddingQuestion}
            setIsAddingQuestion={setIsAddingQuestion}
            saveEditedQuestion={saveEditedQuestion}
          />
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        deleteConfirmId={deleteConfirmId}
        setDeleteConfirmId={setDeleteConfirmId}
        studySets={studySets}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  );
}
