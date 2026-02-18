import React, { useState } from 'react';
import { questions } from '../data/questions';

const Quiz = ({ onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stats, setStats] = useState({ strategy: 0, focus: 0, risk: 0 });

  const handleAnswer = (option) => {
    // 1. Save answer for MBTI calculation
    const newAnswers = { ...answers, [currentQuestionIndex]: option.value };
    setAnswers(newAnswers);

    // 2. Accumulate Stats
    if (option.stats) {
      setStats(prev => ({
        strategy: prev.strategy + (option.stats.strategy || 0),
        focus: prev.focus + (option.stats.focus || 0),
        risk: prev.risk + (option.stats.risk || 0)
      }));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Pass stats manually as state update is async
      calculateResult(newAnswers, stats, option.stats); 
    }
  };

  const calculateResult = (finalAnswers, currentStats, lastOptionStats) => {
    let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    Object.values(finalAnswers).forEach((val) => {
      scores[val] = (scores[val] || 0) + 1;
    });

    // Determine types
    const mbti = [
      scores.E > scores.I ? 'E' : 'I',
      scores.S > scores.N ? 'S' : 'N',
      scores.T > scores.F ? 'T' : 'F',
      scores.J > scores.P ? 'J' : 'P',
    ].join('');

    // Normalize Stats (Max possible roughly 20-25 per category)
    // Scale to 0-100
    const finalStats = {
      strategy: currentStats.strategy + (lastOptionStats?.strategy || 0),
      focus: currentStats.focus + (lastOptionStats?.focus || 0),
      risk: currentStats.risk + (lastOptionStats?.risk || 0)
    };

    const normalizedStats = {
      strategy: Math.min(100, Math.round(finalStats.strategy * 4)), 
      focus: Math.min(100, Math.round(finalStats.focus * 4)),
      risk: Math.min(100, Math.round(finalStats.risk * 4))
    };

    // Calculate Level
    const totalScore = normalizedStats.strategy + normalizedStats.focus + normalizedStats.risk;
    let level = 1;
    if (totalScore > 200) level = 4; // Master
    else if (totalScore > 150) level = 3; // Expert
    else if (totalScore > 100) level = 2; // Pro
    else level = 1; // Rookie

    // Send object with all data
    onFinish({ mbti, stats: normalizedStats, level });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh w-full bg-[#FFF9F9] dark:bg-[#2D2424] text-[#554444] dark:text-[#FFE5E5] p-6 transition-colors duration-300">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="w-full bg-white dark:bg-gray-700 rounded-full h-4 mb-12 shadow-inner border-2 border-pastel-pink/20 overflow-hidden">
          <div
            className="bg-pastel-pink h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,209,220,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-[2.5rem] p-8 mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-2 border-white dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-black text-center min-h-[80px] flex items-center justify-center leading-snug text-[#FF9AA2]">
            <span className="text-pastel-blue mr-3 italic">Step {currentQuestionIndex + 1}.</span>
            {currentQuestion.text}
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full py-6 px-8 bg-white dark:bg-gray-800 hover:bg-pastel-blue/10 dark:hover:bg-gray-700 rounded-[1.8rem] text-lg md:text-xl text-center transition-all duration-300 border-2 border-white dark:border-gray-700 hover:border-pastel-blue dark:hover:border-blue-400 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(174,198,207,0.3)] font-bold text-[#665555] dark:text-gray-200"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;