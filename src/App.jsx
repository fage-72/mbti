import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Quiz from './components/Quiz';
import Result from './components/Result';
import DetailPage from './pages/DetailPage';
import SajuPage from './pages/SajuPage';
import CommunityPage from './pages/CommunityPage';
import './App.css';

// Global Navigation Component to handle Theme and Back buttons
const GlobalNav = ({ darkMode, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-3">
      {!isHome && (
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center w-12 h-12"
          aria-label="Go Back"
        >
          <span className="text-xl">⬅️</span>
        </button>
      )}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border border-gray-200 dark:border-gray-700 flex items-center justify-center w-12 h-12"
        aria-label="Toggle Dark Mode"
      >
        <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
      </button>
    </div>
  );
};

// Separate component to use useNavigate inside Router
const AppRoutes = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<StartScreen onStart={() => navigate('/quiz')} />} />
      <Route path="/quiz" element={<Quiz onFinish={(data) => navigate('/result', { state: data })} />} />
      <Route path="/result" element={<Result onReset={() => navigate('/')} />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/saju" element={<SajuPage />} />
      <Route path="/:slug" element={<DetailPage />} />
    </Routes>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

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
        <GlobalNav darkMode={darkMode} toggleTheme={toggleTheme} />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
