
import { useState, useEffect, useCallback } from 'react';

interface UseExamTimerProps {
  initialTimeSeconds: number;
  onTimeUp?: () => void;
  isRunning: boolean;
}

interface UseExamTimerReturn {
  remainingTime: number;
  isTimeUp: boolean;
  formattedTime: string;
}

export const useExamTimer = <T,>({ initialTimeSeconds, onTimeUp, isRunning }: UseExamTimerProps): UseExamTimerReturn => {
  const [remainingTime, setRemainingTime] = useState<number>(initialTimeSeconds);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  useEffect(() => {
    setRemainingTime(initialTimeSeconds); // Reset timer when initialTimeSeconds changes (e.g. new exam)
    setIsTimeUp(false);
  }, [initialTimeSeconds]);

  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    if (onTimeUp) {
      onTimeUp();
    }
  }, [onTimeUp]);

  useEffect(() => {
    if (!isRunning || isTimeUp) {
      return;
    }

    if (remainingTime <= 0) {
      handleTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime, isRunning, isTimeUp, handleTimeUp]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    remainingTime,
    isTimeUp,
    formattedTime: formatTime(remainingTime),
  };
};
