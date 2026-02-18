import React from 'react';
import { newsData } from '../data/newsData';
import { fashionData } from '../data/fashionData';
import { mbtiTraits } from '../data/mbtiTraits';

const Result = ({ mbti, onReset }) => {
  const resultData = newsData[mbti] || newsData['INFP']; // Default if not found
  const fashion = fashionData[mbti] || fashionData['INFP'];
  const traits = mbtiTraits[mbti] || mbtiTraits['INFP'];

  const getLink = (category, keyword) => {
    const query = encodeURIComponent(keyword);
    switch (category) {
      case 'job': return `https://www.wanted.co.kr/search?query=${query}`; // 직업 -> 원티드
      case 'learning': return `https://www.inflearn.com/courses?s=${query}`; // 학습 -> 인프런
      case 'content': return `https://www.youtube.com/results?search_query=${query}`; // 콘텐츠 -> 유튜브
      case 'ui': return `https://www.pinterest.co.kr/search/pins/?q=${query} UI Design`; // UI -> 핀터레스트
      case 'shopping': return `https://search.danawa.com/dsearch.php?k1=${query}`; // 쇼핑 -> 다나와
      case 'travel': return `https://www.myrealtrip.com/search?q=${query}`; // 여행 -> 마이리얼트립
      case 'relationship': return `https://www.google.com/search?q=${query} 인간관계`; // 관계 -> 구글
      case 'stress': return `https://www.youtube.com/results?search_query=${query} 힐링`; // 스트레스 -> 유튜브
      default: return `https://www.google.com/search?q=${query}`;
    }
  };

  const handleTraitClick = (category, content) => {
    const url = getLink(category, content);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 py-12">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        
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

        {/* Main Content Grid (News & Fashion) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* News Section */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col hover:shadow-blue-900/20 transition-shadow duration-300">
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
              <button 
                onClick={() => window.open(`https://www.google.com/search?q=${resultData.headline}`, '_blank')}
                className="w-full py-3 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-900/30 transition-colors font-semibold mt-auto"
              >
                뉴스 검색하기
              </button>
            </div>
          </div>

          {/* Fashion Section */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col hover:shadow-purple-900/20 transition-shadow duration-300">
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
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6 flex-grow">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">✨ 추천 스타일링 팁</h3>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  {fashion.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => window.open(`https://www.google.com/search?q=${fashion.style} 스타일`, '_blank')}
                className="w-full py-3 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-900/30 transition-colors font-semibold mt-auto"
              >
                스타일 검색하기
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Traits Analysis Section */}
        <div className="w-full mt-4">
          <h3 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            🧐 {mbti}의 라이프스타일 분석
          </h3>
          <p className="text-center text-gray-400 mb-8 -mt-6 text-sm">
            각 카드를 클릭하면 관련 커뮤니티나 정보 사이트로 이동합니다 🔗
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TraitCard 
              title="직업·역할" icon="💼" content={traits.job} color="border-blue-500/30 bg-blue-900/20" 
              onClick={() => handleTraitClick('job', traits.job)}
            />
            <TraitCard 
              title="학습 방식" icon="📚" content={traits.learning} color="border-green-500/30 bg-green-900/20" 
              onClick={() => handleTraitClick('learning', traits.learning)}
            />
            <TraitCard 
              title="콘텐츠 소비" icon="📺" content={traits.content} color="border-red-500/30 bg-red-900/20" 
              onClick={() => handleTraitClick('content', traits.content)}
            />
            <TraitCard 
              title="선호 UI/UX" icon="📱" content={traits.ui} color="border-yellow-500/30 bg-yellow-900/20" 
              onClick={() => handleTraitClick('ui', traits.ui)}
            />
            <TraitCard 
              title="쇼핑 스타일" icon="🛒" content={traits.shopping} color="border-pink-500/30 bg-pink-900/20" 
              onClick={() => handleTraitClick('shopping', traits.shopping)}
            />
            <TraitCard 
              title="여행 스타일" icon="✈️" content={traits.travel} color="border-indigo-500/30 bg-indigo-900/20" 
              onClick={() => handleTraitClick('travel', traits.travel)}
            />
            <TraitCard 
              title="인간관계" icon="🤝" content={traits.relationship} color="border-orange-500/30 bg-orange-900/20" 
              onClick={() => handleTraitClick('relationship', traits.relationship)}
            />
            <TraitCard 
              title="스트레스 해소" icon="🧘" content={traits.stress} color="border-teal-500/30 bg-teal-900/20" 
              onClick={() => handleTraitClick('stress', traits.stress)}
            />
          </div>
        </div>

        <div className="mt-8 text-center pb-8">
          <button
            onClick={onReset}
            className="px-10 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full text-white text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
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
    className={`p-6 rounded-2xl border ${color} backdrop-blur-sm hover:bg-opacity-40 transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer group relative`}
  >
    <div className="absolute top-4 right-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
      ↗️
    </div>
    <div className="flex items-center gap-3 mb-3">
      <span className="text-3xl">{icon}</span>
      <h4 className="font-bold text-lg text-gray-100 group-hover:text-blue-300 transition-colors">{title}</h4>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed font-light group-hover:text-gray-300 transition-colors">
      {content}
    </p>
  </div>
);

export default Result;
