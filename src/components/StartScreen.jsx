import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-dvh bg-[#FFF9F9] dark:bg-[#2D2424] text-[#554444] dark:text-[#FFE5E5] p-6 relative overflow-hidden m-0 transition-colors duration-300">
      {/* Background Decor - Pastel Bubbles */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-pastel-blue/30 rounded-full blur-[60px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-pastel-pink/30 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[15%] h-[15%] bg-pastel-peach/40 rounded-full blur-[40px]"></div>
      
      <div className="relative z-10 text-center max-w-md w-full flex flex-col items-center">
        <div className="mb-6 text-6xl animate-bounce-slow">✨</div>
        <span className="text-pastel-blue dark:text-blue-300 font-bold tracking-[0.2em] text-sm mb-2 block">
          AI 성향 테스트
        </span>
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-[#FF9AA2] drop-shadow-sm">
          포근한<br/>뉴스 탐험
        </h1>
        <p className="text-lg md:text-xl mb-12 text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          부드러운 질문으로 나를 알아보고,<br/>
          <strong className="text-pastel-blue dark:text-blue-300">내게 딱 맞는 소식</strong>과 <strong className="text-pastel-pink dark:text-pink-300">패션</strong>을<br/>
          선물해 드릴게요. 🎁
        </p>
        <button
          onClick={onStart}
          className="w-full max-w-sm py-5 bg-pastel-pink hover:bg-[#FFB7C5] text-white text-2xl font-black rounded-full transition-all transform hover:scale-105 shadow-[0_10px_20px_rgba(255,154,162,0.4)] border-4 border-white flex items-center justify-center gap-3"
        >
          모험 시작! 🎈
        </button>
      </div>
      
      <div className="absolute bottom-8 text-gray-400 dark:text-gray-500 text-sm font-medium">
        🎀 MBTI News Curator v1.4
      </div>
    </div>
  );
};

export default StartScreen;
