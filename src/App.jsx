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
    <div className="fixed top-6 right-6 z-50 flex gap-4">
      {!isHome && (
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-pastel-blue dark:bg-gray-700 shadow-[0_4px_10px_rgba(174,198,207,0.5)] hover:shadow-[0_6px_15px_rgba(174,198,207,0.8)] transition-all transform hover:scale-110 border-2 border-white dark:border-gray-600 text-white flex items-center justify-center w-14 h-14"
          aria-label="Go Back"
        >
          <span className="text-2xl">🧸</span>
        </button>
      )}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full bg-pastel-pink dark:bg-gray-700 shadow-[0_4px_10px_rgba(255,209,220,0.5)] hover:shadow-[0_6px_15px_rgba(255,209,220,0.8)] transition-all transform hover:scale-110 border-2 border-white dark:border-gray-600 flex items-center justify-center w-14 h-14 text-white"
        aria-label="Toggle Dark Mode"
      >
        <span className="text-2xl">{darkMode ? '☀️' : '🌙'}</span>
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
      <div className="App min-h-dvh w-full overflow-x-hidden bg-[#FFF9F9] text-[#554444] dark:bg-[#2D2424] dark:text-[#FFE5E5] transition-colors duration-300 relative">
        <GlobalNav darkMode={darkMode} toggleTheme={toggleTheme} />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
