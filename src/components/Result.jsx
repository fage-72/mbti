import React from 'react';
import { newsData } from '../data/newsData';

const Result = ({ mbti, onReset }) => {
  const resultData = newsData[mbti] || newsData['INFP']; // Default if not found

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
            당신의 MBTI 유형은
          </p>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            {mbti}
          </h1>
          <p className="text-xl text-gray-300">
            {resultData.category} 분야의 뉴스에 관심이 많으시군요!
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg transform transition hover:scale-[1.02] duration-300">
          <div className="h-48 bg-gray-700 relative">
            <img 
              src={resultData.image} 
              alt={mbti} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent w-full h-24"></div>
            <span className="absolute top-4 right-4 bg-blue-600 text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 leading-tight">
              {resultData.headline}
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {resultData.summary}
            </p>
            <button className="w-full py-3 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-900/30 transition-colors font-semibold">
              뉴스 더 보기
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onReset}
            className="text-gray-400 hover:text-white underline text-sm transition-colors"
          >
            테스트 다시 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
