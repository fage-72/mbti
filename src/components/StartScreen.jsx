import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-400">
        나만의 뉴스 큐레이터
      </h1>
      <p className="text-lg mb-8 text-center text-gray-300 max-w-md">
        8가지 질문을 통해 당신의 성향을 분석하고,<br />
        딱 맞는 뉴스를 추천해 드립니다.
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-xl font-semibold transition-transform transform hover:scale-105 shadow-lg"
      >
        테스트 시작하기
      </button>
    </div>
  );
};

export default StartScreen;
