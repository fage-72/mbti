import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-dvh bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 relative overflow-hidden m-0 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 dark:bg-blue-600/30 rounded-full blur-[100px] transition-colors duration-300"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 dark:bg-purple-600/30 rounded-full blur-[100px] transition-colors duration-300"></div>
      <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-pink-200/30 dark:bg-pink-600/20 rounded-full blur-[80px] transition-colors duration-300"></div>
      
      <div className="relative z-10 text-center max-w-md w-full flex flex-col items-center">
        <span className="text-blue-600 dark:text-blue-400 font-bold tracking-[0.2em] text-sm mb-4 block animate-pulse">
          AI NEWS CURATOR
        </span>
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500 drop-shadow-xl transition-all duration-300">
          나만의<br/>뉴스 큐레이터
        </h1>
        <p className="text-lg md:text-xl mb-12 text-gray-600 dark:text-gray-300 leading-relaxed font-light transition-colors duration-300">
          8가지 질문으로 성향을 분석하고,<br/>
          <strong className="text-gray-900 dark:text-white font-semibold">맞춤형 뉴스</strong>와 <strong className="text-gray-900 dark:text-white font-semibold">패션 스타일</strong>을<br/>
          지금 바로 확인해보세요.
        </p>
        <button
          onClick={onStart}
          className="w-full max-w-sm py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 rounded-2xl text-white text-xl font-bold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl border border-white/20 flex items-center justify-center gap-2"
        >
          시작하기 🚀
        </button>
      </div>
      
      <div className="absolute bottom-8 text-gray-400 dark:text-gray-500 text-xs tracking-wider transition-colors duration-300">
        © 2026 MBTI News Curator v1.4
      </div>
    </div>
  );
};

export default StartScreen;
