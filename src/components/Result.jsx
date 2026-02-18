import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { newsData } from '../data/newsData';
import { fashionData } from '../data/fashionData';
import { mbtiTraits } from '../data/mbtiTraits';

const Result = ({ mbti, stats = { strategy: 50, focus: 50, risk: 50 }, level = 1, onReset }) => {
  const navigate = useNavigate();
  const feedRef = useRef(null);
  const storyRef = useRef(null);

  const resultData = newsData[mbti] || newsData['INFP']; // Default if not found
  const fashion = fashionData[mbti] || fashionData['INFP'];
  const traits = mbtiTraits[mbti] || mbtiTraits['INFP'];

  const getLevelTitle = (lvl) => {
    switch(lvl) {
      case 4: return "마스터 (Master)";
      case 3: return "전략가 (Strategist)";
      case 2: return "분석가 (Analyst)";
      default: return "탐색자 (Explorer)";
    }
  };

  const levelTitle = getLevelTitle(level);

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

  const handleDownloadImage = async (ref, filename) => {
    if (ref.current) {
      // Temporarily make visible for capture if needed, but fixed/opacity-0 usually works.
      // Scrolling to top helps avoid offset issues
      window.scrollTo(0, 0); 
      
      const canvas = await html2canvas(ref.current, {
        scale: 2, 
        backgroundColor: null, 
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Force styles in clone if necessary
          const element = clonedDoc.getElementById(filename); // Need ID to target? Ref target is passed directly.
          if (element) {
            element.style.opacity = '1';
          }
        }
      });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleCopyTwitter = () => {
    const text = `[Lv.${level} ${levelTitle}] ${mbti} - ${resultData.headline} ✨\n\n전략: ${stats.strategy} / 집중: ${stats.focus} / 리스크: ${stats.risk}\n\n나만의 AI 뉴스 & 스타일 큐레이터 결과 보러가기 👇\nhttps://fage-72.github.io/mbti/ \n\n#MBTI #뉴스큐레이터 #AI`;
    navigator.clipboard.writeText(text).then(() => {
      alert('트위터용 요약 텍스트가 복사되었습니다! 🐦');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 py-12 transition-colors duration-300">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="text-center relative">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm md:text-base font-bold px-4 py-1 rounded-full mb-4 shadow-lg animate-bounce">
            Lv.{level} {levelTitle}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-3">
            당신의 MBTI 유형은
          </p>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 mb-6 drop-shadow-sm">
            {mbti}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light mb-8">
            <span className="font-bold text-blue-600 dark:text-blue-400">{resultData.category}</span> 분야의 뉴스에 관심이 많으시군요!
          </p>

          {/* Stats Breakdown (Visible) */}
          <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 text-left">📊 능력치 분석</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-blue-600 dark:text-blue-400">전략 (Strategy)</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{stats.strategy}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${stats.strategy}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-purple-600 dark:text-purple-400">집중력 (Focus)</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{stats.focus}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${stats.focus}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-pink-600 dark:text-pink-400">모험심 (Risk)</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{stats.risk}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-pink-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${stats.risk}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => handleDownloadImage(feedRef, `${mbti}_feed`)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            📸 인스타 피드 저장
          </button>
          <button
            onClick={() => handleDownloadImage(storyRef, `${mbti}_story`)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            📱 스토리 저장
          </button>
          <button
            onClick={handleCopyTwitter}
            className="px-6 py-3 bg-sky-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            🐦 트위터 요약 복사
          </button>
        </div>

        {/* Hidden Elements for Image Generation - Fixed position to ensure rendering */}
        <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
          {/* 1. Instagram Feed (Square 1080x1080) */}
          <div ref={feedRef} className="w-[1080px] h-[1080px] bg-gray-900 flex flex-col items-center justify-center p-20 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900"></div>
             {/* Removed blurring blobs for better html2canvas stability or kept simple */}
             <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[150px]"></div>
             <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[150px]"></div>
             
             <div className="relative z-10 text-center border-8 border-white/10 p-20 rounded-[3rem] w-full h-full flex flex-col justify-center items-center backdrop-blur-none">
               <span className="text-yellow-400 text-5xl font-bold mb-8 block drop-shadow-md">Lv.{level} {levelTitle}</span>
               <span className="text-blue-300 text-4xl font-bold tracking-[0.3em] mb-4 block">MY MBTI TYPE</span>
               {/* Changed to solid text color for html2canvas compatibility */}
               <h1 
                 className="text-[12rem] font-black text-white drop-shadow-2xl mb-10 leading-none"
                 style={{ color: '#ffffff' }}
               >
                 {mbti}
               </h1>
               <div className="w-full max-w-3xl bg-black/40 rounded-3xl p-10 mb-8 border border-white/10">
                 <div className="flex items-center justify-between text-4xl text-white mb-6">
                   <span className="w-32 text-left" style={{ color: 'white' }}>전략</span>
                   <div className="flex-grow mx-6 bg-gray-700 h-6 rounded-full overflow-hidden">
                     <div className="bg-blue-500 h-full" style={{ width: `${stats.strategy}%`, backgroundColor: '#3b82f6' }}></div>
                   </div>
                   <span className="font-bold w-16 text-right text-blue-300" style={{ color: '#93c5fd' }}>{stats.strategy}</span>
                 </div>
                 <div className="flex items-center justify-between text-4xl text-white mb-6">
                   <span className="w-32 text-left" style={{ color: 'white' }}>집중</span>
                   <div className="flex-grow mx-6 bg-gray-700 h-6 rounded-full overflow-hidden">
                     <div className="bg-purple-500 h-full" style={{ width: `${stats.focus}%`, backgroundColor: '#a855f7' }}></div>
                   </div>
                   <span className="font-bold w-16 text-right text-purple-300" style={{ color: '#d8b4fe' }}>{stats.focus}</span>
                 </div>
                 <div className="flex items-center justify-between text-4xl text-white">
                   <span className="w-32 text-left" style={{ color: 'white' }}>모험</span>
                   <div className="flex-grow mx-6 bg-gray-700 h-6 rounded-full overflow-hidden">
                     <div className="bg-pink-500 h-full" style={{ width: `${stats.risk}%`, backgroundColor: '#ec4899' }}></div>
                   </div>
                   <span className="font-bold w-16 text-right text-pink-300" style={{ color: '#f9a8d4' }}>{stats.risk}</span>
                 </div>
               </div>
               <div className="flex gap-6 mt-4">
                 <span className="bg-blue-600/30 border border-blue-400/30 px-8 py-4 rounded-full text-3xl text-blue-100 font-bold">#{resultData.category}</span>
                 <span className="bg-purple-600/30 border border-purple-400/30 px-8 py-4 rounded-full text-3xl text-purple-100 font-bold">#{fashion.style}</span>
               </div>
             </div>
             <div className="absolute bottom-10 text-white/50 text-3xl tracking-[0.5em] font-light">
               AI NEWS CURATOR
             </div>
          </div>

          {/* 2. Instagram Story (Vertical 1080x1920) */}
          <div ref={storyRef} className="w-[1080px] h-[1920px] bg-gray-950 flex flex-col items-center p-20 relative overflow-hidden text-white">
             {/* Background */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black"></div>
             <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[120%] h-[40%] bg-blue-600/20 rounded-full blur-[150px]"></div>

             <div className="relative z-10 w-full flex flex-col items-center h-full">
               <div className="mt-40 mb-20 text-4xl text-gray-400 tracking-[0.5em] font-light">AI NEWS CURATOR</div>
               
               <h1 
                 className="text-[12rem] font-black text-white mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                 style={{ color: '#ffffff' }}
               >
                 {mbti}
               </h1>
               
               <div className="w-full bg-white/5 border border-white/10 rounded-[3rem] p-16 backdrop-blur-md mb-16 shadow-2xl">
                 <h2 className="text-6xl font-bold text-blue-300 mb-8 tracking-tight" style={{ color: '#93c5fd' }}>AI Headline</h2>
                 <p className="text-5xl leading-[1.4] text-gray-100 font-light" style={{ color: '#f3f4f6' }}>
                   {resultData.summary}
                 </p>
               </div>

               <div className="w-full bg-white/5 border border-white/10 rounded-[3rem] p-16 backdrop-blur-md shadow-2xl">
                 <h2 className="text-6xl font-bold text-purple-300 mb-12 tracking-tight" style={{ color: '#d8b4fe' }}>Key Traits</h2>
                 <div className="space-y-12">
                   <div className="flex items-center gap-10">
                     <span className="text-8xl">👗</span>
                     <span className="text-5xl font-medium">{fashion.style}</span>
                   </div>
                   <div className="flex items-center gap-10">
                     <span className="text-8xl">💼</span>
                     <span className="text-5xl font-medium">{traits.job.split(',')[0]}</span>
                   </div>
                   <div className="flex items-center gap-10">
                     <span className="text-8xl">✈️</span>
                     <span className="text-5xl font-medium">{traits.travel.split(',')[0]}</span>
                   </div>
                 </div>
               </div>

               <div className="mt-auto mb-20">
                 <span className="text-3xl text-gray-400 font-light tracking-widest">
                   CHECK FULL REPORT 🔗
                 </span>
               </div>
             </div>
          </div>
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

        <div className="mt-12 text-center pb-12 flex flex-col items-center gap-6">
          <button
            onClick={() => navigate('/saju')}
            className="w-full max-w-md px-12 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full text-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 animate-pulse"
          >
            🔮 내 사주와 MBTI 궁합 보기
          </button>
          
          <button
            onClick={onReset}
            className="w-full max-w-md px-12 py-5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-900 dark:text-white text-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
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
