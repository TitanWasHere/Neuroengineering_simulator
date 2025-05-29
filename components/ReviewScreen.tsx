import React from 'react';
import { Question, UserAnswers } from '../types';
import QuestionCard from './QuestionCard';
import { calculateScoreForQuestion, calculateTotalScore } from '../utils/scoring';
import { DocumentTextIcon } from './icons';

interface ReviewScreenProps {
  questions: Question[];
  userAnswers: UserAnswers;
  onRestart: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ questions, userAnswers, onRestart }) => {
  const totalScore = calculateTotalScore(questions, userAnswers);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-bold text-accent mb-2">Exam review</h1>
        <div className="flex items-center justify-center space-x-2 p-3 rounded-lg shadow-md bg-neutral/10 text-basetxt text-2xl font-bold">
            <DocumentTextIcon className="w-8 h-8 text-accent" />
            <span>Final Score:</span>
            <span className={totalScore >= 0 ? 'text-green-400' : 'text-red-400'}>
              {totalScore.toFixed(2)}
            </span>
        </div>
      </header>

      <main className="w-full max-w-4xl space-y-6 mb-8">
        {questions.map((question, index) => {
          const selection = userAnswers[question.id];
          const scoreForThisQuestion = calculateScoreForQuestion(question, selection);
          // Il badge "Corretta" si basa su un punteggio positivo per la domanda
          const isDisplayCorrect = scoreForThisQuestion > 0;
          
          return (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              totalQuestions={questions.length}
              userSelection={selection}
              onAnswerChange={() => {}} // No changes in review mode
              isReviewMode={true}
              isCorrect={isDisplayCorrect}
              achievedScore={scoreForThisQuestion} // Passa il punteggio ottenuto alla card
            />
          );
        })}
      </main>
      
      {questions.length === 0 && (
         <p className="text-xl text-center text-basetxt/80 mb-8">No question to review.<br/></p>
      )}

      <footer className="w-full max-w-4xl text-center">
        <button
          onClick={onRestart}
          className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
        >
          Back to Menu
        </button>
      </footer>
    </div>
  );
};

export default ReviewScreen;