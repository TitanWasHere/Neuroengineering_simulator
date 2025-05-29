import React from 'react';
import { Question, QuestionType, UserSelection } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userSelection: UserSelection | undefined;
  onAnswerChange: (questionId: string, selectedOptions: UserSelection) => void;
  isReviewMode?: boolean;
  isCorrect?: boolean; // Determinato dal punteggio in ReviewScreen
  achievedScore?: number; // Nuovo prop per il punteggio ottenuto
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  userSelection,
  onAnswerChange,
  isReviewMode = false,
  isCorrect,
  achievedScore,
}) => {
  const handleOptionChange = (option: string) => {
    if (isReviewMode) return;

    let newSelection: UserSelection;
    if (question.type === QuestionType.TRUE_FALSE) {
      newSelection = [option];
    } else { // MULTIPLE_CHOICE
      const currentSelection = userSelection || [];
      if (currentSelection.includes(option)) {
        newSelection = currentSelection.filter((o) => o !== option);
      } else {
        newSelection = [...currentSelection, option];
      }
    }
    onAnswerChange(question.id, newSelection);
  };

  const getOptionStyling = (option: string): string => {
    let baseStyle = 'p-3 rounded-lg border transition-all duration-150 cursor-pointer hover:bg-neutral/30';
    if (isReviewMode) {
      baseStyle += ' cursor-default';
      const isSelected = userSelection?.includes(option);
      const isCorrectAnswer = question.answer.includes(option);

      if (isCorrectAnswer) {
        baseStyle += ' bg-green-600 border-green-700 text-white';
      } else if (isSelected && !isCorrectAnswer) {
        baseStyle += ' bg-red-600 border-red-700 text-white';
      } else {
        baseStyle += ' bg-neutral/10 border-neutral/20';
      }
    } else { // Exam mode
      if (userSelection?.includes(option)) {
        baseStyle += ' bg-primary border-secondary ring-2 ring-accent text-white';
      } else {
        baseStyle += ' bg-neutral/10 border-neutral/20 hover:border-accent';
      }
    }
    return baseStyle;
  };

  let cardBgClass = 'bg-neutral/5';
  if (isReviewMode && achievedScore !== undefined) {
    if (achievedScore > 0) {
      cardBgClass = 'bg-green-500/20'; // Verde trasparente
    } else {
      cardBgClass = 'bg-red-500/20'; // Rosso trasparente
    }
  }

  return (
    <div className={`${cardBgClass} p-6 rounded-xl shadow-lg w-full transition-colors duration-300`}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-accent font-semibold">Question {questionNumber}/{totalQuestions} (Part {question.part})</p>
          {isReviewMode && isCorrect !== undefined && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isCorrect ? 'Corretta' : 'Errata'}
            </span>
          )}
        </div>
        <h2 className="text-xl font-semibold text-basetxt mb-1">{question.text}</h2>
        <div className="flex justify-between text-xs text-basetxt/70 mb-3">
            <span>Max question score: {question.maxScore}</span>
            {isReviewMode && achievedScore !== undefined && (
            <span className={`font-semibold ${achievedScore > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Punteggio Ottenuto: {achievedScore.toFixed(2)}
            </span>
            )}
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={getOptionStyling(option)}
            onClick={() => handleOptionChange(option)}
            role={question.type === QuestionType.TRUE_FALSE ? "radio" : "checkbox"}
            aria-checked={userSelection?.includes(option)}
            tabIndex={isReviewMode ? -1 : 0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOptionChange(option);}}
          >
            <label className="flex items-center cursor-pointer w-full">
              <input
                type={question.type === QuestionType.TRUE_FALSE ? "radio" : "checkbox"}
                name={question.id}
                value={option}
                checked={userSelection?.includes(option)}
                onChange={() => handleOptionChange(option)}
                className="hidden"
                disabled={isReviewMode}
              />
              <span className={`mr-3 h-5 w-5 border-2 rounded-sm flex items-center justify-center transition-all duration-150 ${userSelection?.includes(option) ? (isReviewMode && !question.answer.includes(option) && !question.answer.includes(userSelection?.[0] || '') ? 'border-red-500 bg-red-500' : 'border-accent bg-accent') : 'border-basetxt/50'}`}>
                {userSelection?.includes(option) && <span className="text-white text-xs">✔</span>}
              </span>
              <span className="text-basetxt/90">{option}</span>
            </label>
          </div>
        ))}
      </div>

      {isReviewMode && (
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
          <h4 className="font-semibold text-accent mb-1">Explaination:</h4>
          <p className="text-sm text-basetxt/80">{question.explanation}</p>
          {question.type === QuestionType.MULTIPLE_CHOICE && (
            <p className="text-xs text-accent/80 mt-2">Expected correct answers: {question.answer.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;