import React from 'react';
import { newsData } from '../data/newsData';
import { fashionData } from '../data/fashionData';

const Result = ({ mbti, onReset }) => {
  const resultData = newsData[mbti] || newsData['INFP']; // Default if not found
  const fashion = fashionData[mbti] || fashionData['INFP'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 py-12">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="text-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* News Section */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col">
            <div className="h-48 bg-gray-700 relative shrink-0">
              <img 
                src={resultData.image} 
                alt={mbti} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-0 left-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent w-full h-24"></div>
              <span className="absolute top-4 right-4 bg-blue-600 text-xs font-bold px-2 py-1 rounded">
                NEWS
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold mb-3 leading-tight text-blue-300">
                {resultData.headline}
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed flex-grow">
                {resultData.summary}
              </p>
              <button className="w-full py-3 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-900/30 transition-colors font-semibold mt-auto">
                뉴스 더 보기
              </button>
            </div>
          </div>

          {/* Fashion Section */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col">
            <div className="h-48 bg-gray-700 relative shrink-0">
              <img 
                src={fashion.image} 
                alt={`${mbti} Fashion`} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-0 left-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent w-full h-24"></div>
              <span className="absolute top-4 right-4 bg-purple-600 text-xs font-bold px-2 py-1 rounded">
                FASHION
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold mb-3 leading-tight text-purple-300">
                {fashion.style}
              </h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                {fashion.description}
              </p>
              <div className="bg-gray-900/50 rounded-lg p-4 mt-auto">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">✨ 추천 스타일링 팁</h3>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  {fashion.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            테스트 다시 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
