import { Question, QuestionType, UserAnswers, UserSelection } from '../types';

export function calculateScoreForQuestion(
  question: Question,
  selectedOptions: UserSelection | undefined
): number {
  if (!selectedOptions || selectedOptions.length === 0) {
    // Rule: Not answered T/F = 0. Assume same for MC if not specified otherwise.
    return 0; 
  }

  if (question.type === QuestionType.TRUE_FALSE) {
    // T/F: Correct +0.5, Incorrect -0.25, Not answered 0 (handled above)
    const correctAnswer = question.answer[0]; // T/F has one correct answer
    const userAnswer = selectedOptions[0]; // User selects one option for T/F
    if (userAnswer === correctAnswer) {
      return 0.5;
    } else {
      return -0.25;
    }
  } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
    // MC: "la somma di tutte quelle giuste darà un punteggio massimo"
    // "altrimenti ognuna risposta segnata di quelle sbagliate darà -1/N" (N = num possible options)
    
    const correctAnswersSet = new Set(question.answer);
    const userSelectedSet = new Set(selectedOptions);

    let isPerfectMatch = correctAnswersSet.size === userSelectedSet.size;
    if (isPerfectMatch) {
      for (const selectedOpt of userSelectedSet) {
        if (!correctAnswersSet.has(selectedOpt)) {
          isPerfectMatch = false;
          break;
        }
      }
    }
    // Previous redundant check removed:
    // if (userSelectedSet.size !== correctAnswersSet.size) {
    //     isPerfectMatch = false;
    // }

    let positiveScore = 0;
    if (isPerfectMatch) {
      positiveScore = question.maxScore;
    }

    let penalty = 0;
    // Interpretation: "1/N" means 1/Nth of the question's maxScore as penalty
    const penaltyPerIncorrectOption = question.maxScore / question.options.length; 
    
    for (const selectedOpt of selectedOptions) {
      if (!correctAnswersSet.has(selectedOpt)) { // If a selected option is not in the set of correct answers
        penalty += penaltyPerIncorrectOption;
      }
    }
    
    // The score is maxScore if perfect, otherwise it's 0 minus penalties for incorrect selections.
    // No partial credit for correctly selected items if the selection isn't perfect.
    const finalQuestionScore = positiveScore - penalty;
    return finalQuestionScore; // Score can be negative
  }
  return 0; // Should not happen if type is always T/F or MC
}

export function calculateTotalScore(
  questions: Question[],
  userAnswers: UserAnswers
): number {
  let totalScore = 0;
  for (const question of questions) {
    const selection = userAnswers[question.id];
    totalScore += calculateScoreForQuestion(question, selection);
  }
  // Round to avoid floating point inaccuracies with scores like 0.25
  return Math.round(totalScore * 100) / 100;
}