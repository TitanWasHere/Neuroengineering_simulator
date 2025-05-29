
import React, { useState, useEffect, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import ExamScreen from './components/ExamScreen';
import ReviewScreen from './components/ReviewScreen';
import { ExamPhase, Question, UserAnswers, ExamConfig } from './types';
import questionsDataA from './data/questionsA.json';
import questionsDataB from './data/questionsB.json';

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const App: React.FC = () => {
  const [examPhase, setExamPhase] = useState<ExamPhase>(ExamPhase.SETUP);
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [allQuestionsA, setAllQuestionsA] = useState<Question[]>([]);
  const [allQuestionsB, setAllQuestionsB] = useState<Question[]>([]);
  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        
        //const responseA = await fetch('/data/questionsA.json');
        //if (!responseA.ok) throw new Error(`Failed to load Part A questions (status: ${responseA.status})`);
        // Type assertion to ensure imported data matches Question type
        const dataA = questionsDataA as Question[]; 
        setAllQuestionsA(dataA);

        //const responseB = await fetch('/data/questionsB.json');
        //if (!responseB.ok) throw new Error(`Failed to load Part B questions (status: ${responseB.status})`);
        //const dataB = await responseB.json() as Question[];
        const dataB = questionsDataB as Question[]; 
        setAllQuestionsB(dataB);

      } catch (e: any) {
        console.error("Error loading questions:", e);
        setError(e.message || "Could not load exam questions. Please try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleStartExam = useCallback((config: ExamConfig) => {
    if (isLoading || error) {
        alert("Questions data not ready. Retry in a moment");
        return;
    }
    setExamConfig(config);
    
    const questionsA = shuffleArray(allQuestionsA).slice(0, config.numQuestionsA);
    const questionsB = shuffleArray(allQuestionsB).slice(0, config.numQuestionsB);
    
    const combinedQuestions = [...questionsA, ...questionsB];
    // It's good practice to shuffle the combined list too, if parts shouldn't be grouped strictly
    // For now, keep A then B as per typical exam structure
    setCurrentExamQuestions(combinedQuestions);
    
    setUserAnswers({}); // Reset answers for new exam
    setExamPhase(ExamPhase.IN_PROGRESS);
  }, [allQuestionsA, allQuestionsB, isLoading, error]);

  const handleUpdateAnswers = useCallback((updatedAnswers: UserAnswers) => {
    setUserAnswers(updatedAnswers);
  }, []);
  
  const handleFinishExam = useCallback((finalAnswers: UserAnswers) => {
    setUserAnswers(finalAnswers); // Ensure final answers are set
    setExamPhase(ExamPhase.REVIEW);
  }, []);

  const handleRestart = () => {
    setExamPhase(ExamPhase.SETUP);
    // examConfig remains so user can see their last setup
    setCurrentExamQuestions([]);
    setUserAnswers({});
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-basetxt/80 bg-background">Question loading...</div>;
  }

  if (error && examPhase === ExamPhase.SETUP) { // Show error primarily on setup screen
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background">
        <h2 className="text-2xl text-red-500 mb-4">Loading error</h2>
        <p className="text-basetxt/80 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg"
        >
          Ricarica Pagina
        </button>
      </div>
    );
  }


  switch (examPhase) {
    case ExamPhase.SETUP:
      return <SetupScreen onStartExam={handleStartExam} lastConfig={examConfig || undefined} />;
    case ExamPhase.IN_PROGRESS:
      if (!examConfig) { // Should not happen if logic is correct
        handleRestart(); // Go back to setup
        return null;
      }
      return (
        <ExamScreen
          questions={currentExamQuestions}
          examTimeSeconds={examConfig.timeLimitMinutes * 60}
          initialUserAnswers={userAnswers}
          onUpdateAnswers={handleUpdateAnswers}
          onFinishExam={handleFinishExam}
        />
      );
    case ExamPhase.REVIEW:
      return (
        <ReviewScreen
          questions={currentExamQuestions}
          userAnswers={userAnswers}
          onRestart={handleRestart}
        />
      );
    default:
      return <SetupScreen onStartExam={handleStartExam} />;
  }
};

export default App;
