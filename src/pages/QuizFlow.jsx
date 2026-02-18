import React, { useState } from 'react';
import StartScreen from '../components/StartScreen';
import Quiz from '../components/Quiz';
import Result from '../components/Result';

const QuizFlow = () => {
  const [view, setView] = useState('start'); // 'start', 'quiz', 'result'
  const [resultData, setResultData] = useState(null); // { mbti, stats, level }

  const handleStart = () => {
    setView('quiz');
  };

  const handleFinishQuiz = (result) => {
    setResultData(result);
    setView('result');
  };

  const handleReset = () => {
    setResultData(null);
    setView('start');
  };

  return (
    <div className="min-h-dvh w-full overflow-x-hidden transition-colors duration-300">
      {view === 'start' && <StartScreen onStart={handleStart} />}
      {view === 'quiz' && <Quiz onFinish={handleFinishQuiz} />}
      {view === 'result' && resultData && (
        <Result 
          mbti={resultData.mbti} 
          stats={resultData.stats} 
          level={resultData.level} 
          onReset={handleReset} 
        />
      )}
    </div>
  );
};

export default QuizFlow;
