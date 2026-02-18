import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mbtiTraits } from '../data/mbtiTraits';

const keywordMap = {
  '직업': { icon: '💼', title: '커리어 전략', desc: '당신의 강점을 극대화할 수 있는 최고의 직업과 커리어 패스를 제안합니다.' },
  '재테크': { icon: '💰', title: '부자 되는 법', desc: '성향에 딱 맞는 투자 스타일과 자산 관리 노하우를 알려드립니다.' },
  '연애': { icon: '💕', title: '사랑의 기술', desc: '이상형을 찾고, 관계를 오래 유지하는 당신만의 연애 비법입니다.' },
  '공부법': { icon: '📚', title: '학습 전략', desc: '최소 시간으로 최대 효율을 내는 당신만의 공부 스타일을 찾아보세요.' },
  '인간관계': { icon: '🤝', title: '소통의 기술', desc: '갈등을 줄이고 내 편을 만드는 스마트한 인간관계 관리법입니다.' },
  '스트레스': { icon: '🧘', title: '마음 챙김', desc: '지친 마음을 가장 빠르게 회복시켜줄 힐링 솔루션입니다.' },
  '여행': { icon: '✈️', title: '완벽한 여행', desc: '당신이 꿈꾸던 최고의 휴가를 위한 여행지와 계획법을 소개합니다.' },
  '쇼핑': { icon: '🛒', title: '스마트 쇼핑', desc: '후회 없는 소비를 위한 당신만의 쇼핑 원칙과 추천 아이템입니다.' },
  '리더십': { icon: '👑', title: '리더의 자격', desc: '조직을 이끌고 사람들에게 영감을 주는 당신만의 리더십 스타일입니다.' },
  'AI': { icon: '🤖', title: 'AI 활용법', desc: '미래 기술을 누구보다 똑똑하게 활용하여 앞서나가는 방법입니다.' },
  '건강': { icon: '💪', title: '건강 관리', desc: '활기찬 하루를 위한 맞춤형 운동과 식단 가이드입니다.' },
  '취미': { icon: '🎨', title: '취미 생활', desc: '일상의 활력이 되어줄, 당신에게 딱 맞는 새로운 취미를 발견해보세요.' },
  '패션': { icon: '👗', title: '패션 스타일', desc: '나만의 개성을 돋보이게 할 코디네이션과 스타일링 팁입니다.' },
  '인테리어': { icon: '🏠', title: '공간 연출', desc: '가장 편안하고 능률적인 당신만의 공간을 꾸미는 아이디어입니다.' },
  '음식': { icon: '🍽️', title: '미식 가이드', desc: '입맛을 사로잡을 최고의 메뉴와 맛집 탐방 리스트입니다.' },
  '음악': { icon: '🎵', title: '플레이리스트', desc: '마음을 울리고 영감을 주는 당신을 위한 맞춤형 음악 추천입니다.' },
  '영화': { icon: '🎬', title: '인생 영화', desc: '당신의 취향을 저격할 명작 영화와 드라마 추천 목록입니다.' },
  '독서': { icon: '📖', title: '책 추천', desc: '지적 호기심을 채워주고 성장을 돕는 필독 도서 리스트입니다.' },
  '창의성': { icon: '💡', title: '아이디어 발상', desc: '잠재된 창의력을 깨우고 혁신적인 아이디어를 만드는 방법입니다.' },
  '멘탈': { icon: '🧠', title: '멘탈 관리', desc: '어떤 시련에도 흔들리지 않는 강철 멘탈을 만드는 습관입니다.' },
};

const DetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // URL 파싱 (예: intj-재테크 -> mbti: INTJ, keyword: 재테크)
  const [mbtiRaw, keywordRaw] = (slug || '').split('-');
  const mbti = mbtiRaw ? mbtiRaw.toUpperCase() : 'INFP';
  const keyword = keywordRaw ? decodeURIComponent(keywordRaw) : '직업';

  const keywordInfo = keywordMap[keyword] || keywordMap['직업'];
  const trait = mbtiTraits[mbti] || mbtiTraits['INFP'];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-dvh bg-[#FFF9F9] dark:bg-[#2D2424] text-[#554444] dark:text-[#FFE5E5] transition-colors duration-300 flex flex-col items-center p-6 py-12">
      <div className="max-w-3xl w-full">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-2 bg-white dark:bg-gray-800 border-2 border-pastel-blue/20 rounded-full shadow-sm hover:bg-pastel-blue/10 transition-colors flex items-center gap-2 text-sm font-black text-pastel-blue"
        >
          🧸 이전으로
        </button>

        <header className="text-center mb-16">
          <div className="inline-block bg-pastel-blue/10 dark:bg-blue-900/30 text-pastel-blue dark:text-blue-300 px-6 py-2 rounded-full text-sm font-black mb-6 border-2 border-pastel-blue/20">
            {mbti} 🎀 {keyword}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-[#554444] dark:text-white">
            <span className="text-pastel-pink">
              {mbti}
            </span>를 위한<br/>
            {keywordInfo.title}
          </h1>
          <p className="text-xl text-gray-400 dark:text-gray-400 leading-relaxed font-medium max-w-2xl mx-auto">
            {keywordInfo.desc}
          </p>
        </header>

        <div className="bg-white/90 dark:bg-gray-800 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-4 border-white dark:border-gray-700 overflow-hidden p-10 md:p-16 mb-12 relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-pastel-blue"></div>
          
          <div className="flex flex-col items-center text-center gap-6 mb-12 pb-12 border-b-2 border-[#F0F7F9] dark:border-gray-700">
            <span className="text-7xl md:text-8xl filter drop-shadow-sm animate-bounce-slow">
              {keywordInfo.icon}
            </span>
            <div>
              <h2 className="text-3xl font-black text-[#556677] dark:text-white mb-2">
                {mbti}의 포근 포인트
              </h2>
              <p className="text-pastel-blue font-black tracking-widest text-sm">
                BASIC ANALYSIS
              </p>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-xl leading-loose mb-8 text-gray-500 font-medium">
              <strong className="text-pastel-pink font-black">{mbti}</strong> 유형은 {trait.job.split(' ')[0]} 성향을 가지고 있어, 
              <strong className="text-pastel-blue font-black">{keyword}</strong> 분야에서도 자신만의 독특한 방식을 선호합니다.
            </p>
            <p className="text-xl leading-loose mb-8 text-gray-500 font-medium">
              특히 {trait.learning.split(',')[0]} 방식으로 접근할 때 가장 큰 효율을 발휘하며,
              {trait.stress.split(',')[0]} 같은 상황을 피하는 것이 중요합니다.
            </p>
            
            <div className="bg-[#F0F7F9] dark:bg-blue-900/20 p-8 rounded-[2rem] my-10 border-4 border-white shadow-sm">
              <h3 className="text-xl font-black text-pastel-blue mb-4 flex items-center gap-2">
                💡 포근한 {keyword} 조언
              </h3>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                당신의 강점인 <strong className="text-pastel-blue">"{trait.job.split(',')[0]}"</strong> 능력을 {keyword}에 접목해보세요.
                남들보다 더 체계적이고 전략적으로 접근한다면, {keyword} 분야에서도 탁월한 성과를 낼 수 있습니다.
              </p>
            </div>

            <p className="text-xl text-center text-gray-400 font-medium italic mt-12">
              더 깊은 이야기가 궁금하다면 아래 버튼을 눌러보세요! ✨
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.open(`https://www.google.com/search?q=${mbti}+${keyword}`, '_blank')}
            className="w-full md:w-auto px-12 py-5 bg-pastel-pink text-white rounded-full font-black text-xl shadow-lg hover:shadow-[0_8px_25px_rgba(255,154,162,0.4)] hover:scale-[1.05] transition-all flex items-center justify-center gap-3 mx-auto border-4 border-white"
          >
            🔍 {mbti} {keyword} 더 알아보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
