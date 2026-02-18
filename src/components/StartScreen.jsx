import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-gray-900 text-white p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10 text-center max-w-md w-full flex flex-col items-center">
        <span className="text-blue-400 font-bold tracking-[0.2em] text-sm mb-4 block animate-pulse">
          AI NEWS CURATOR
        </span>
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-2xl">
          나만의<br/>뉴스 큐레이터
        </h1>
        <p className="text-lg md:text-xl mb-12 text-gray-300 leading-relaxed font-light">
          8가지 질문으로 성향을 분석하고,<br/>
          <strong className="text-white">맞춤형 뉴스</strong>와 <strong className="text-white">패션 스타일</strong>을<br/>
          지금 바로 확인해보세요.
        </p>
        <button
          onClick={onStart}
          className="w-full max-w-sm py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] border border-white/10 flex items-center justify-center gap-2"
        >
          시작하기 🚀
        </button>
      </div>
      
      <div className="absolute bottom-8 text-gray-500 text-xs tracking-wider">
        © 2026 MBTI News Curator
      </div>
    </div>
  );
};

export default StartScreen;
