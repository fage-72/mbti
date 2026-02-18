import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SajuPage = () => {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState({
    year: '',
    month: '',
    day: '',
    time: ''
  });
  const [result, setResult] = useState(null);

  const animals = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
  const elements = ['금(金)', '금(金)', '토(土)', '수(水)', '수(水)', '토(土)', '목(木)', '목(木)', '토(土)', '화(火)', '화(火)', '토(土)']; // 대략적인 오행 매핑

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!birthData.year || !birthData.month || !birthData.day) return;

    const year = parseInt(birthData.year);
    const month = parseInt(birthData.month);
    
    // 띠 계산 (신년 기준 간소화)
    const animalIndex = year % 12;
    const animal = animals[animalIndex];

    // 계절별 성향 (월 기준)
    let season = '';
    let personality = '';
    let recommendations = {};

    if (month >= 3 && month <= 5) {
      season = '봄(春)';
      personality = '따뜻하고 생동감이 넘치며, 새로운 시작을 두려워하지 않는 성향입니다.';
      recommendations = {
        job: '기획자, 교육자, 마케터',
        hobby: '식물 키우기, 등산, 독서',
        travel: '꽃이 핀 숲길, 활기찬 도시',
      };
    } else if (month >= 6 && month <= 8) {
      season = '여름(夏)';
      personality = '열정적이고 화려하며, 주변 사람들에게 밝은 에너지를 주는 성향입니다.';
      recommendations = {
        job: '연예인, 영업직, 디자이너',
        hobby: '수영, 댄스, 여행',
        travel: '해변 휴양지, 뜨거운 축제 현장',
      };
    } else if (month >= 9 && month <= 11) {
      season = '가을(秋)';
      personality = '결실을 맺고 정리하는 차분함과 냉철한 판단력을 가진 성향입니다.';
      recommendations = {
        job: '금융 전문가, 법조인, 분석가',
        hobby: '재테크, 골동품 수집, 명상',
        travel: '고즈넉한 고궁, 단풍 명소',
      };
    } else {
      season = '겨울(冬)';
      personality = '지혜롭고 인내심이 강하며, 내면의 힘을 기르는 성향입니다.';
      recommendations = {
        job: '연구원, 작가, 심리 상담가',
        hobby: '글쓰기, 바둑, 영화 감상',
        travel: '조용한 설산, 온천 여행',
      };
    }

    setResult({
      animal,
      season,
      personality,
      recommendations
    });
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 py-12 transition-colors duration-300 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          ← MBTI 테스트로 돌아가기
        </button>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-600">
            🔮 AI 사주 분석
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
            생년월일로 알아보는 당신의 숨겨진 운명과 라이프스타일
          </p>
        </header>

        {!result ? (
          <form onSubmit={handleCalculate} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">태어난 연도 (YYYY)</label>
              <input 
                type="number" 
                placeholder="예: 1995" 
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                value={birthData.year}
                onChange={(e) => setBirthData({...birthData, year: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">월 (MM)</label>
                <input 
                  type="number" 
                  placeholder="예: 8" 
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  value={birthData.month}
                  onChange={(e) => setBirthData({...birthData, month: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">일 (DD)</label>
                <input 
                  type="number" 
                  placeholder="예: 15" 
                  className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  value={birthData.day}
                  onChange={(e) => setBirthData({...birthData, day: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">태어난 시간 (선택)</label>
              <input 
                type="time" 
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                value={birthData.time}
                onChange={(e) => setBirthData({...birthData, time: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-red-600 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
            >
              내 사주 확인하기 ✨
            </button>
          </form>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="text-center mb-10">
              <span className="text-6xl mb-4 block">🧧</span>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {birthData.year}년 {result.season}생 <span className="text-yellow-500">{result.animal}띠</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {result.personality}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl text-center border border-yellow-100 dark:border-yellow-700/30">
                <span className="text-3xl mb-2 block">💼</span>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">추천 직업</h3>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm">{result.recommendations.job}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl text-center border border-red-100 dark:border-red-700/30">
                <span className="text-3xl mb-2 block">🎨</span>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">추천 취미</h3>
                <p className="text-red-700 dark:text-red-400 text-sm">{result.recommendations.hobby}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl text-center border border-blue-100 dark:border-blue-700/30">
                <span className="text-3xl mb-2 block">✈️</span>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">행운의 여행지</h3>
                <p className="text-blue-700 dark:text-blue-400 text-sm">{result.recommendations.travel}</p>
              </div>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full py-4 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold text-lg rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              다시 입력하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SajuPage;
