import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SajuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userMbti = location.state?.mbti || null; // Passed from Result page

  const [birthData, setBirthData] = useState({
    year: '',
    month: '',
    day: '',
    time: ''
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    // If accessed directly without MBTI, maybe redirect or just show generic
    if (!userMbti) {
      // Optional: Logic to ask for MBTI if missing, but for now we'll handle it gracefully
    }
  }, [userMbti]);

  const animals = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!birthData.year || !birthData.month || !birthData.day) return;

    const year = parseInt(birthData.year);
    const month = parseInt(birthData.month);
    
    // 띠 계산
    const animalIndex = year % 12;
    const animal = animals[animalIndex];

    // 계절별 성향 및 MBTI 매칭
    let season = '';
    let personality = '';
    let recommendations = {};
    let matchScore = 0;
    let matchDesc = '';

    // Simple matching logic
    // Spring/Summer (Yang) matches well with E, N, P
    // Autumn/Winter (Yin) matches well with I, S, J
    // But opposites attract too (Balance)

    if (month >= 3 && month <= 5) {
      season = '봄(春)';
      personality = '따뜻하고 생동감이 넘치며, 새로운 시작을 두려워하지 않는 성향입니다.';
      recommendations = { job: '기획자, 교육자, 마케터', hobby: '식물 키우기, 등산', travel: '꽃이 핀 숲길' };
      
      if (userMbti) {
        if (userMbti.includes('E') || userMbti.includes('N')) {
          matchScore = 95;
          matchDesc = `당신의 ${userMbti} 성향과 봄의 기운이 만나 에너지가 폭발합니다! 창의적이고 활기찬 당신은 어디서나 환영받는 리더가 될 운명입니다.`;
        } else {
          matchScore = 85;
          matchDesc = `차분한 ${userMbti} 성향에 봄의 따뜻함이 더해져 완벽한 밸런스를 이룹니다. 내면의 깊이와 외면의 부드러움이 조화를 이루는 외유내강형입니다.`;
        }
      }
    } else if (month >= 6 && month <= 8) {
      season = '여름(夏)';
      personality = '열정적이고 화려하며, 주변 사람들에게 밝은 에너지를 주는 성향입니다.';
      recommendations = { job: '연예인, 영업직, 디자이너', hobby: '수영, 댄스, 여행', travel: '해변 휴양지' };

      if (userMbti) {
        if (userMbti.includes('E') || userMbti.includes('P')) {
          matchScore = 98;
          matchDesc = `뜨거운 여름 태생과 자유로운 ${userMbti}가 만났습니다. 불꽃 같은 추진력으로 무엇이든 해내는 스타일! 단, 가끔은 휴식이 필요합니다.`;
        } else {
          matchScore = 80;
          matchDesc = `냉철한 ${userMbti} 성향이 여름의 뜨거움을 잘 조절해줍니다. 이성과 감성을 모두 갖춘 매력적인 반전 매력의 소유자입니다.`;
        }
      }
    } else if (month >= 9 && month <= 11) {
      season = '가을(秋)';
      personality = '결실을 맺고 정리하는 차분함과 냉철한 판단력을 가진 성향입니다.';
      recommendations = { job: '금융 전문가, 법조인, 분석가', hobby: '재테크, 골동품 수집', travel: '고즈넉한 고궁' };

      if (userMbti) {
        if (userMbti.includes('J') || userMbti.includes('T')) {
          matchScore = 96;
          matchDesc = `가을의 결실과 ${userMbti}의 치밀함이 만나 엄청난 성과를 만들어냅니다. 목표를 세우면 반드시 이루어내는 성공 가도가 보입니다.`;
        } else {
          matchScore = 88;
          matchDesc = `자유로운 ${userMbti} 영혼에 가을의 신중함이 더해졌습니다. 창의적인 아이디어를 현실로 만들어내는 능력이 탁월합니다.`;
        }
      }
    } else {
      season = '겨울(冬)';
      personality = '지혜롭고 인내심이 강하며, 내면의 힘을 기르는 성향입니다.';
      recommendations = { job: '연구원, 작가, 심리 상담가', hobby: '글쓰기, 명상', travel: '조용한 설산' };

      if (userMbti) {
        if (userMbti.includes('I') || userMbti.includes('T')) {
          matchScore = 97;
          matchDesc = `겨울의 깊은 지혜와 ${userMbti}의 통찰력이 만났습니다. 남들이 보지 못하는 본질을 꿰뚫어 보는 현자의 기운이 느껴집니다.`;
        } else {
          matchScore = 82;
          matchDesc = `활동적인 ${userMbti} 성향이 겨울의 차가움을 녹여줍니다. 주변 사람들에게 따뜻한 위로와 즐거움을 동시에 주는 분위기 메이커입니다.`;
        }
      }
    }

    setResult({
      animal,
      season,
      personality,
      recommendations,
      matchScore,
      matchDesc
    });
  };

  return (
    <div className="min-h-dvh bg-[#FFF9F9] dark:bg-[#2D2424] text-[#554444] dark:text-[#FFE5E5] p-6 py-12 transition-colors duration-300 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-2 bg-white dark:bg-gray-800 border-2 border-pastel-blue/20 rounded-full shadow-sm hover:bg-pastel-blue/10 transition-colors flex items-center gap-2 text-sm font-black text-pastel-blue"
        >
          🧸 이전으로
        </button>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#FF9AA2]">
            🔮 포근한 사주 분석
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            별들이 들려주는 당신의 이야기
            {userMbti && <span className="block mt-2 text-pastel-blue dark:text-blue-300 font-black">X {userMbti} 특별 궁합</span>}
          </p>
        </header>

        {!result ? (
          <form onSubmit={handleCalculate} className="bg-white/80 dark:bg-gray-800/80 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-white dark:border-gray-700 backdrop-blur-sm space-y-10">
            <div className="space-y-8">
              <div className="group">
                <label className="block text-sm font-black mb-3 text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">태어난 연도 (YYYY)</label>
                <input 
                  type="number" 
                  placeholder="예: 1995" 
                  className="w-full p-6 rounded-[1.8rem] bg-[#F0F7F9] dark:bg-gray-900/50 border-2 border-transparent focus:border-pastel-blue outline-none transition-all text-2xl font-black text-gray-600 dark:text-white placeholder:text-gray-300"
                  value={birthData.year}
                  onChange={(e) => setBirthData({...birthData, year: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-sm font-black mb-3 text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">월 (MM)</label>
                  <input 
                    type="number" 
                    placeholder="8" 
                    className="w-full p-6 rounded-[1.8rem] bg-[#FFF0F3] dark:bg-gray-900/50 border-2 border-transparent focus:border-pastel-pink outline-none transition-all text-2xl font-black text-gray-600 dark:text-white placeholder:text-gray-300"
                    value={birthData.month}
                    onChange={(e) => setBirthData({...birthData, month: e.target.value})}
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-black mb-3 text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">일 (DD)</label>
                  <input 
                    type="number" 
                    placeholder="15" 
                    className="w-full p-6 rounded-[1.8rem] bg-[#FFFDF0] dark:bg-gray-900/50 border-2 border-transparent focus:border-yellow-200 outline-none transition-all text-2xl font-black text-gray-600 dark:text-white placeholder:text-gray-300"
                    value={birthData.day}
                    onChange={(e) => setBirthData({...birthData, day: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-6 bg-pastel-pink text-white font-black text-2xl rounded-full shadow-[0_10px_25px_rgba(255,154,162,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-4 border-4 border-white"
            >
              내 운명의 별 확인하기 ✨
            </button>
          </form>
        ) : (
          <div className="space-y-10 animate-fade-in">
            {/* 사주 결과 카드 */}
            <div className="bg-white/90 dark:bg-gray-800 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-white dark:border-gray-700">
              <div className="text-center mb-12">
                <span className="text-7xl mb-6 block animate-bounce-slow">🧧</span>
                <h2 className="text-3xl font-black mb-4 text-[#FF9AA2]">
                  {birthData.year}년 {result.season}생 <span className="text-pastel-blue">{result.animal}띠</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed font-medium">
                  {result.personality}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#F0F7F9] dark:bg-blue-900/20 p-8 rounded-[2rem] text-center border-4 border-white shadow-sm">
                  <span className="text-4xl mb-4 block">💼</span>
                  <h3 className="font-black text-pastel-blue mb-2">추천 직업</h3>
                  <p className="text-gray-500 text-sm font-bold">{result.recommendations.job}</p>
                </div>
                <div className="bg-[#FFF0F3] dark:bg-red-900/20 p-8 rounded-[2rem] text-center border-4 border-white shadow-sm">
                  <span className="text-4xl mb-4 block">🎨</span>
                  <h3 className="font-black text-pastel-pink mb-2">추천 취미</h3>
                  <p className="text-gray-500 text-sm font-bold">{result.recommendations.hobby}</p>
                </div>
                <div className="bg-[#FFFDF0] dark:bg-yellow-900/20 p-8 rounded-[2rem] text-center border-4 border-white shadow-sm">
                  <span className="text-4xl mb-4 block">✈️</span>
                  <h3 className="font-black text-yellow-500 mb-2">행운의 여행</h3>
                  <p className="text-gray-500 text-sm font-bold">{result.recommendations.travel}</p>
                </div>
              </div>
            </div>

            {/* MBTI 궁합 카드 */}
            {userMbti && (
              <div className="bg-pastel-blue rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(174,198,207,0.3)] text-white relative overflow-hidden border-4 border-white">
                <h3 className="text-3xl font-black mb-8 flex items-center gap-3 relative z-10">
                  <span>💞</span> 사주 X MBTI 케미
                </h3>
                
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="flex-shrink-0 text-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="15" fill="transparent" />
                        <circle 
                          cx="80" cy="80" r="70" 
                          stroke="white" strokeWidth="15" 
                          fill="transparent" 
                          strokeDasharray={439.82} 
                          strokeDashoffset={439.82 - (439.82 * result.matchScore) / 100}
                          className="transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <span className="absolute text-4xl font-black">{result.matchScore}점</span>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="bg-white/20 rounded-[2rem] p-8 backdrop-blur-sm border-2 border-white/30">
                      <h4 className="text-2xl font-black mb-4 text-white">
                        {userMbti}와 {result.season}의 조화
                      </h4>
                      <p className="text-xl leading-relaxed text-blue-50 font-medium">
                        "{result.matchDesc}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={() => setResult(null)}
              className="w-full py-5 bg-white dark:bg-gray-800 border-4 border-white rounded-full text-gray-400 font-black text-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              다시 확인하기 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SajuPage;