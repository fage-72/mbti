import React, { useState } from 'react';
import StartScreen from '../components/StartScreen';
import Quiz from '../components/Quiz';
import Result from '../components/Result';

const QuizFlow = () => {
  const [view, setView] = useState('start'); // 'start', 'quiz', 'result'
  const [mbtiResult, setMbtiResult] = useState('');

  const handleStart = () => {
    setView('quiz');
  };

  const handleFinishQuiz = (result) => {
    setMbtiResult(result);
    setView('result');
  };

  const handleReset = () => {
    setMbtiResult('');
    setView('start');
  };

  return (
    <div className="min-h-dvh w-full overflow-x-hidden transition-colors duration-300">
      {view === 'start' && <StartScreen onStart={handleStart} />}
      {view === 'quiz' && <Quiz onFinish={handleFinishQuiz} />}
      {view === 'result' && <Result mbti={mbtiResult} onReset={handleReset} />}
    </div>
  );
};

export default QuizFlow;
