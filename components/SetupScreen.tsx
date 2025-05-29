
import React, { useState } from 'react';
import { ExamConfig } from '../types';

interface SetupScreenProps {
  onStartExam: (config: ExamConfig) => void;
  lastConfig?: ExamConfig;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartExam, lastConfig }) => {
  const [numQuestionsA, setNumQuestionsA] = useState<number>(lastConfig?.numQuestionsA ?? 5);
  const [numQuestionsB, setNumQuestionsB] = useState<number>(lastConfig?.numQuestionsB ?? 5);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(lastConfig?.timeLimitMinutes ?? 30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numQuestionsA < 0 || numQuestionsB < 0 || timeLimitMinutes <= 0) {
        alert("Insert valid numbers (n >= 0, time > 0).");
        return;
    }
    onStartExam({ numQuestionsA, numQuestionsB, timeLimitMinutes });
  };

  const NumberInput: React.FC<{label: string, value: number, onChange: (val: number) => void, min?: number, max?:number, step?:number}> = 
    ({label, value, onChange, min = 0, max = 99, step = 1}) => (
    <div className="mb-6">
      <label htmlFor={label.replace(/\s+/g, '')} className="block text-sm font-medium text-basetxt/80 mb-1">
        {label}
      </label>
      <input
        type="number"
        id={label.replace(/\s+/g, '')}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        min={min}
        max={max}
        step={step}
        className="w-full p-3 bg-neutral/10 border border-neutral/30 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors text-basetxt"
        required
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-neutral/5 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-accent mb-8">Neuroengineering exam simulator</h1>
        <form onSubmit={handleSubmit}>
          <NumberInput label="Questions number Part A" value={numQuestionsA} onChange={setNumQuestionsA} />
          <NumberInput label="Questions number Part B" value={numQuestionsB} onChange={setNumQuestionsB} />
          <NumberInput label="Time (minutes)" value={timeLimitMinutes} onChange={setTimeLimitMinutes} min={1} />
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Start exam
          </button>
        </form>
      </div>
      <footer className="text-center mt-8 text-sm text-basetxt/60">
        <p>&copy; {new Date().getFullYear()} Andrea Gravili - Github: <a href="https://github.com/TitanWasHere">@TitanWasHere</a></p>
      </footer>
    </div>
  );
};

export default SetupScreen;
