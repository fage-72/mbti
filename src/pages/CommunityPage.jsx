import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CommunityPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // MBTI from previous result or stored session
  const userMbti = location.state?.mbti || localStorage.getItem('userMbti') || 'GUEST';
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [inputText, setInputText] = useState('');
  const [posts, setPosts] = useState([]);

  // 1. 초기화: 로그인 상태 및 게시글 불러오기
  useEffect(() => {
    // 유저 ID 처리
    const savedId = localStorage.getItem('communityUserId');
    if (savedId) {
      setUserId(savedId);
      setIsLoggedIn(true);
    }

    // 게시글 불러오기 (Local Storage + 초기 데이터)
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // 초기 기본 게시글들
      const initialPosts = [
        { id: Date.now() - 10000, author: 'ENTP-1024', content: '여기 사주 분석 진짜 용하네요 ㅋㅋㅋ', likes: 12, time: '1시간 전', category: 'ENTP' },
        { id: Date.now() - 20000, author: 'INFJ-5501', content: '조용히 눈팅만 하다가 글 남겨봅니다. 다들 반가워요.', likes: 8, time: '3시간 전', category: 'INFJ' },
        { id: Date.now() - 30000, author: 'ISTJ-0001', content: '계획대로 하루를 마친 ISTJ 있나요?', likes: 25, time: '5시간 전', category: 'ISTJ' },
      ];
      setPosts(initialPosts);
      localStorage.setItem('communityPosts', JSON.stringify(initialPosts));
    }
  }, []);

  // 2. 로그인 처리 (ID 자동 생성)
  const handleLogin = () => {
    if (userMbti === 'GUEST') {
        alert('MBTI 테스트를 먼저 완료해주세요!');
        navigate('/');
        return;
    }

    // ID 생성 규칙: MBTI + 가입 순서 번호 (여기선 방문 횟수로 시뮬레이션)
    let visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    localStorage.setItem('visitCount', visitCount.toString());
    
    const paddedNum = visitCount.toString().padStart(4, '0');
    const newId = `${userMbti}-${paddedNum}`;
    
    setUserId(newId);
    setIsLoggedIn(true);
    localStorage.setItem('communityUserId', newId);
    localStorage.setItem('userMbti', userMbti);
  };

  // 3. 글쓰기 기능
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: userId,
      content: inputText,
      likes: 0,
      time: '방금 전',
      category: userMbti
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
    setInputText('');
  };

  // 4. 좋아요 기능
  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 py-8 transition-colors duration-300 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            ←
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              COMMUNITY
            </h1>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">MBTI & Fortune Board</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Status & Login */}
        {!isLoggedIn ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl text-center border border-gray-100 dark:border-gray-800 mb-10 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">대화에 참여해보세요</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              테스트 결과인 <strong className="text-blue-500">{userMbti}</strong> 유형으로<br/>
              자동 아이디가 생성됩니다.
            </p>
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
            >
              {userMbti}로 간편 로그인
            </button>
          </div>
        ) : (
          <div className="mb-10 flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white text-xl font-black">
              {userId.substring(0, 1)}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">WELCOME BACK</p>
              <h3 className="text-xl font-black text-gray-800 dark:text-white leading-none">{userId}님</h3>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('communityUserId');
                setIsLoggedIn(false);
              }}
              className="px-4 py-2 text-xs font-bold text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              로그아웃
            </button>
          </div>
        )}

        {/* Board Content */}
        <div className={`space-y-6 ${!isLoggedIn ? 'opacity-40 pointer-events-none blur-[2px]' : ''}`}>
          
          {/* Write Section */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${userId}님, 오늘은 어떤가요?`}
              className="w-full h-24 bg-gray-50 dark:bg-gray-950 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white resize-none border border-gray-100 dark:border-gray-800"
              disabled={!isLoggedIn}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400 font-medium">글을 등록하면 모든 사용자가 볼 수 있습니다.</span>
              <button 
                type="submit"
                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm hover:scale-105 transition-all"
              >
                등록하기
              </button>
            </div>
          </form>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-md border border-gray-50 dark:border-gray-800 transition-all hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tighter ${
                      post.category.startsWith('I') 
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300' 
                        : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300'
                    }`}>
                      {post.category}
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{post.author}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{post.time}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed font-medium">
                  {post.content}
                </p>
                <div className="flex gap-6 border-t border-gray-50 dark:border-gray-800 pt-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ❤️ {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors">
                    💬 댓글 달기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-12 text-center text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
          MBTI News Board v1.0
        </p>
      </div>
    </div>
  );
};

export default CommunityPage;