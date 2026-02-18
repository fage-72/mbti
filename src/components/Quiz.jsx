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
    <div className="flex flex-col items-center justify-center min-h-dvh w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 transition-colors duration-300">
      <div className="w-full max-w-xl">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8 transition-colors duration-300">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center min-h-[100px] flex items-center justify-center leading-snug drop-shadow-sm transition-colors duration-300">
          <span className="text-blue-600 dark:text-blue-400 mr-2">Q{currentQuestion.id}.</span>
          {currentQuestion.text}
        </h2>

        <div className="flex flex-col gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full py-5 px-8 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-2xl text-lg md:text-xl text-left transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md font-medium text-gray-700 dark:text-gray-200"
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