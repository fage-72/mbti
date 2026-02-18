import React from 'react';
import { useNavigate } from 'react-router-dom';
import { newsData } from '../data/newsData';
import { fashionData } from '../data/fashionData';
import { mbtiTraits } from '../data/mbtiTraits';

const Result = ({ mbti, onReset }) => {
  const navigate = useNavigate();
  const resultData = newsData[mbti] || newsData['INFP']; // Default if not found
  const fashion = fashionData[mbti] || fashionData['INFP'];
  const traits = mbtiTraits[mbti] || mbtiTraits['INFP'];

  const handleTraitClick = (category) => {
    let keyword = '직업';
    switch (category) {
      case 'job': keyword = '직업'; break;
      case 'learning': keyword = '공부법'; break;
      case 'content': keyword = '취미'; break;
      case 'ui': keyword = 'AI'; break;
      case 'shopping': keyword = '쇼핑'; break;
      case 'travel': keyword = '여행'; break;
      case 'relationship': keyword = '인간관계'; break;
      case 'stress': keyword = '스트레스'; break;
      default: keyword = '직업';
    }
    navigate(`/${mbti}-${keyword}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 py-12 transition-colors duration-300">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-3">
            당신의 MBTI 유형은
          </p>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 mb-6 drop-shadow-sm">
            {mbti}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light">
            <span className="font-bold text-blue-600 dark:text-blue-400">{resultData.category}</span> 분야의 뉴스에 관심이 많으시군요!
          </p>
        </div>

        {/* Main Content Grid (News & Fashion) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* News Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-8 flex flex-col flex-grow relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="flex justify-between items-center mb-6">
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                  NEWS
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-gray-900 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                {resultData.headline}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed flex-grow text-lg">
                {resultData.summary}
              </p>
              <button 
                onClick={() => window.open(`https://www.google.com/search?q=${resultData.headline}`, '_blank')}
                className="w-full py-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 flex items-center justify-center gap-2"
              >
                뉴스 검색하기 🔍
              </button>
            </div>
          </div>

          {/* Fashion Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-8 flex flex-col flex-grow relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="flex justify-between items-center mb-6">
                <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                  FASHION
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-gray-900 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                {fashion.style}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-lg">
                {fashion.description}
              </p>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 mb-8 flex-grow border border-gray-100 dark:border-gray-700/50">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">✨ Styling Tips</h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-2 list-none">
                  {fashion.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => window.open(`https://www.google.com/search?q=${fashion.style} 스타일`, '_blank')}
                className="w-full py-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-bold transition-all border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 flex items-center justify-center gap-2"
              >
                스타일 검색하기 👗
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Traits Analysis Section */}
        <div className="w-full mt-8">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 dark:from-teal-400 dark:to-cyan-500 drop-shadow-sm">
            🧐 {mbti}의 라이프스타일 분석
          </h3>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-10 -mt-8 text-sm font-medium">
            각 카드를 클릭하면 상세 분석 페이지로 이동합니다 🔍
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TraitCard 
              title="직업·역할" icon="💼" content={traits.job} 
              color="border-blue-200 bg-blue-50/50 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-900/20 dark:hover:bg-blue-900/40" 
              onClick={() => handleTraitClick('job')}
            />
            <TraitCard 
              title="학습 방식" icon="📚" content={traits.learning} 
              color="border-green-200 bg-green-50/50 hover:bg-green-100 dark:border-green-500/30 dark:bg-green-900/20 dark:hover:bg-green-900/40" 
              onClick={() => handleTraitClick('learning')}
            />
            <TraitCard 
              title="콘텐츠 소비" icon="📺" content={traits.content} 
              color="border-red-200 bg-red-50/50 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-900/20 dark:hover:bg-red-900/40" 
              onClick={() => handleTraitClick('content')}
            />
            <TraitCard 
              title="선호 UI/UX" icon="📱" content={traits.ui} 
              color="border-yellow-200 bg-yellow-50/50 hover:bg-yellow-100 dark:border-yellow-500/30 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40" 
              onClick={() => handleTraitClick('ui')}
            />
            <TraitCard 
              title="쇼핑 스타일" icon="🛒" content={traits.shopping} 
              color="border-pink-200 bg-pink-50/50 hover:bg-pink-100 dark:border-pink-500/30 dark:bg-pink-900/20 dark:hover:bg-pink-900/40" 
              onClick={() => handleTraitClick('shopping')}
            />
            <TraitCard 
              title="여행 스타일" icon="✈️" content={traits.travel} 
              color="border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40" 
              onClick={() => handleTraitClick('travel')}
            />
            <TraitCard 
              title="인간관계" icon="🤝" content={traits.relationship} 
              color="border-orange-200 bg-orange-50/50 hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-900/20 dark:hover:bg-orange-900/40" 
              onClick={() => handleTraitClick('relationship')}
            />
            <TraitCard 
              title="스트레스 해소" icon="🧘" content={traits.stress} 
              color="border-teal-200 bg-teal-50/50 hover:bg-teal-100 dark:border-teal-500/30 dark:bg-teal-900/20 dark:hover:bg-teal-900/40" 
              onClick={() => handleTraitClick('stress')}
            />
          </div>
        </div>

        <div className="mt-12 text-center pb-12">
          <button
            onClick={onReset}
            className="px-12 py-5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-900 dark:text-white text-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            🔄 테스트 다시 하기
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Trait Cards
const TraitCard = ({ title, icon, content, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-3xl border ${color} backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 h-full cursor-pointer group shadow-sm hover:shadow-lg bg-opacity-60 dark:bg-opacity-20`}
  >
    <div className="flex items-center gap-4 mb-4">
      <span className="text-4xl filter drop-shadow-sm">{icon}</span>
      <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{title}</h4>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
      {content}
    </p>
  </div>
);

export default Result;
