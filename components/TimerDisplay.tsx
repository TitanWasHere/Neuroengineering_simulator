
import React from 'react';
import { ClockIcon } from './icons';

interface TimerDisplayProps {
  formattedTime: string;
  isTimeUp: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ formattedTime, isTimeUp }) => {
  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg shadow ${isTimeUp ? 'bg-red-500 text-white' : 'bg-secondary text-basetxt'}`}>
      <ClockIcon className="w-5 h-5" />
      <span className="font-mono text-lg">
        {isTimeUp ? "Tempo Scaduto!" : formattedTime}
      </span>
    </div>
  );
};

export default TimerDisplay;
