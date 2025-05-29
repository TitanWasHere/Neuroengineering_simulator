import React, { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswers, UserSelection } from '../types';
import QuestionCard from './QuestionCard';
import TimerDisplay from './TimerDisplay';
import { useExamTimer } from '../hooks/useExamTimer';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon as FinishIcon, DocumentTextIcon } from './icons';
// import { calculateTotalScore } from '../utils/scoring'; // calculateTotalScore non è più usato qui

interface ExamScreenProps {
  questions: Question[];
  examTimeSeconds: number;
  initialUserAnswers: UserAnswers;
  onFinishExam: (finalAnswers: UserAnswers) => void;
  onUpdateAnswers: (updatedAnswers: UserAnswers) => void;
}

const ExamScreen: React.FC<ExamScreenProps> = ({
  questions,
  examTimeSeconds,
  initialUserAnswers,
  onFinishExam,
  onUpdateAnswers,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(initialUserAnswers);
  // const [currentTotalScore, setCurrentTotalScore] = useState<number>(0); // Rimosso

  const maxPossibleScore = questions.reduce((sum, q) => sum + q.maxScore, 0);

  const handleTimeUp = useCallback(() => {
    alert("Il tempo è scaduto! L'esame terminerà e potrai vedere i risultati.");
    onFinishExam(userAnswers);
  }, [onFinishExam, userAnswers]);

  const { formattedTime, isTimeUp } = useExamTimer({
    initialTimeSeconds: examTimeSeconds,
    onTimeUp: handleTimeUp,
    isRunning: true,
  });

  useEffect(() => {
    // const score = calculateTotalScore(questions, userAnswers); // Rimosso
    // setCurrentTotalScore(score); // Rimosso
    onUpdateAnswers(userAnswers); // Propagate updates to App.tsx
  }, [userAnswers, questions, onUpdateAnswers]);

  const handleAnswerChange = (questionId: string, selectedOptions: UserSelection) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOptions,
    }));
  };

  const navigateQuestion = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishAttempt = () => {
    console.log("finished");
    if (window.confirm("Sei sicuro di voler terminare l'esame?")) {
      onFinishExam(userAnswers);
    }
    //onFinishExam(userAnswers);
  };
  
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <p className="text-xl text-basetxt/80">No question uploaded. Turn to config.<br/></p>
         <button 
            onClick={() => onFinishExam({})} // Effectively a restart
            className="mt-4 bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
           Back to Menu
          </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background">
      <header className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 p-2 rounded-lg shadow bg-neutral/10 text-basetxt">
            <DocumentTextIcon className="w-5 h-5 text-accent"/>
            <span className="font-semibold">Max score:</span>
            <span className="font-bold text-lg text-basetxt/90">
              {maxPossibleScore.toFixed(2)}
            </span>
        </div>
        <TimerDisplay formattedTime={formattedTime} isTimeUp={isTimeUp} />
      </header>

      <main className="w-full max-w-4xl flex-grow">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            userSelection={userAnswers[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
            // isReviewMode and achievedScore non sono passati qui
          />
        )}
      </main>

      <footer className="w-full max-w-4xl mt-8 flex justify-between items-center">
        <button
          onClick={() => navigateQuestion('prev')}
          disabled={currentQuestionIndex === 0}
          className="flex items-center space-x-2 bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Domanda precedente"
        >
          <ChevronLeftIcon />
          <span>Back</span>
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleFinishAttempt}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
            aria-label="Termina esame"
          >
            <FinishIcon className="w-5 h-5" />
            <span>End exam</span>
          </button>
        ) : (
          <button
            onClick={() => navigateQuestion('next')}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex items-center space-x-2 bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Domanda successiva"
          >
            <span>Next</span>
            <ChevronRightIcon />
          </button>
        )}
      </footer>
    </div>
  );
};

export default ExamScreen;