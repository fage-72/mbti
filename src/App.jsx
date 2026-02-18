import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import QuizFlow from './pages/QuizFlow';
import DetailPage from './pages/DetailPage';
import SajuPage from './pages/SajuPage';
import './App.css';

function App() {
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

  return (
    <Router>
      <div className="App min-h-dvh w-full overflow-x-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 relative">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border border-gray-200 dark:border-gray-700"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <Routes>
          <Route path="/" element={<QuizFlow />} />
          <Route path="/saju" element={<SajuPage />} />
          <Route path="/:slug" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
