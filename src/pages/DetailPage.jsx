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
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col items-center p-6 py-12">
      <div className="max-w-3xl w-full">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          ← 메인으로 돌아가기
        </button>

        <header className="text-center mb-12">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1 rounded-full text-sm font-bold mb-4">
            {mbti} × {keyword}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
              {mbti}
            </span>를 위한<br/>
            {keywordInfo.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            {keywordInfo.desc}
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden p-8 md:p-12 mb-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
            <span className="text-5xl md:text-6xl filter drop-shadow-md">
              {keywordInfo.icon}
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {mbti}형의 특징
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                기본 성향 분석
              </p>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-loose mb-6">
              <strong>{mbti}</strong> 유형은 {trait.job.split(' ')[0]} 성향을 가지고 있어, 
              <strong>{keyword}</strong> 분야에서도 자신만의 독특한 방식을 선호합니다.
            </p>
            <p className="text-lg leading-loose mb-6">
              특히 {trait.learning.split(',')[0]} 방식으로 접근할 때 가장 큰 효율을 발휘하며,
              {trait.stress.split(',')[0]} 같은 상황을 피하는 것이 중요합니다.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl my-8 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">
                💡 {mbti}를 위한 {keyword} 핵심 조언
              </h3>
              <p className="text-blue-700 dark:text-blue-200">
                당신의 강점인 <strong>"{trait.job.split(',')[0]}"</strong> 능력을 {keyword}에 접목해보세요.
                남들보다 더 체계적이고 전략적으로 접근한다면, {keyword} 분야에서도 탁월한 성과를 낼 수 있습니다.
              </p>
            </div>

            <p className="text-lg leading-loose">
              더 자세한 정보나 커뮤니티 반응을 보고 싶다면 아래 버튼을 클릭하여 관련 정보를 탐색해보세요.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.open(`https://www.google.com/search?q=${mbti}+${keyword}`, '_blank')}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            🔍 {mbti} {keyword} 더 알아보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
