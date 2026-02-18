import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Quiz from './components/Quiz';
import Result from './components/Result';
import './App.css';

function App() {
  const [view, setView] = useState('start'); // 'start', 'quiz', 'result'
  const [mbtiResult, setMbtiResult] = useState('');
  
  // Theme State: Check localStorage or default to dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

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
    <div className="App min-h-dvh w-full overflow-x-hidden bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border border-gray-200 dark:border-gray-700"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {view === 'start' && <StartScreen onStart={handleStart} />}
      {view === 'quiz' && <Quiz onFinish={handleFinishQuiz} />}
      {view === 'result' && <Result mbti={mbtiResult} onReset={handleReset} />}
    </div>
  );
}

export default App;
