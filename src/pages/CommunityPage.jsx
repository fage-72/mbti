import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { 
  signInWithPopup, signInWithRedirect, onAuthStateChanged, 
  signOut, getRedirectResult 
} from 'firebase/auth';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, updateDoc, doc, runTransaction, increment 
} from 'firebase/firestore';

const CommunityPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userMbti = location.state?.mbti || localStorage.getItem('userMbti') || 'GUEST';
  
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [posts, setPosts] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState('Unknown');

  // 1. 접속 지역 정보 가져오기 (IP 기반)
  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setRegion(data.city || data.region || 'Remote');
      } catch (e) {
        setRegion('Online');
      }
    };
    fetchRegion();
  }, []);

  // 2. 모바일 리다이렉트 로그인 결과 처리
  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect Login Error", error);
      if (error.code === 'auth/web-storage-unsupported' || error.code === 'auth/operation-not-supported-in-this-environment') {
        alert('현재 브라우저 환경에서 로그인이 차단되었습니다. 크롬/사파리 등 일반 브라우저에서 접속하거나 "다른 브라우저로 열기"를 선택해주세요! 🚀');
      }
    });
  }, []);

  // 3. 유저 상태 관리 및 고유 ID 생성 (MBTI-지역-순번)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('userMbti', userMbti);

        const savedCustomId = localStorage.getItem(`customId_${currentUser.uid}`);
        if (savedCustomId) {
          setUserId(savedCustomId);
        } else {
          const counterKey = `${userMbti}-${region}`;
          const counterRef = doc(db, 'counters', counterKey);

          try {
            const newCount = await runTransaction(db, async (transaction) => {
              const counterDoc = await transaction.get(counterRef);
              if (!counterDoc.exists()) {
                transaction.set(counterRef, { count: 589 });
                return 589;
              } else {
                const count = counterDoc.data().count + 1;
                transaction.update(counterRef, { count: count });
                return count;
              }
            });

            const paddedNum = newCount.toString().padStart(4, '0');
            const finalId = `${userMbti}-${region}-${paddedNum}`;
            setUserId(finalId);
            localStorage.setItem(`customId_${currentUser.uid}`, finalId);
          } catch (e) {
            console.error("ID Gen Error", e);
            setUserId(`${userMbti}-${region}-NEW`);
          }
        }
      } else {
        setUser(null);
        setUserId('');
      }
    });
    return () => unsubscribe();
  }, [userMbti, region]);

  // 4. 게시글 실시간 동기화 (Firestore)
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 5. 로그인 및 글쓰기 액션 통합
  const handleAction = async (type) => {
    if (!user) {
      if (userMbti === 'GUEST' && !localStorage.getItem('userMbti')) {
        alert('성향 기반 아이디 생성을 위해 MBTI 테스트를 먼저 완료해주세요! ✨');
        navigate('/');
        return;
      }
      
      try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isInApp = /KAKAO|NAVER|Instagram|FBAN|FBAV/i.test(navigator.userAgent);

        if (isInApp) {
          alert('인앱 브라우저(카톡/네이버 등)에서는 로그인이 제한될 수 있습니다. 문제가 발생하면 일반 브라우저로 접속해주세요! 💡');
        }

        if (isMobile) {
          await signInWithRedirect(auth, googleProvider);
        } else {
          await signInWithPopup(auth, googleProvider);
        }
      } catch (e) {
        alert('로그인에 실패했습니다. 일반 브라우저 환경인지 확인해주세요.');
      }
      return;
    }

    if (type === 'submit' && inputText.trim()) {
      try {
        await addDoc(collection(db, 'posts'), {
          authorId: userId,
          content: inputText,
          likes: 0,
          comments: [],
          createdAt: serverTimestamp(),
          mbti: userMbti,
          region: region
        });
        setInputText('');
      } catch (e) {
        alert('글 등록 권한이 없습니다. Firebase 설정을 확인해주세요.');
      }
    }
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return '방금 전';
    try {
      const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return date.toLocaleString();
    } catch (e) { return '최근'; }
  };

  return (
    <div className="min-h-dvh bg-[#FFF9F9] dark:bg-[#2D2424] text-[#554444] dark:text-[#FFE5E5] p-6 py-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#FF9AA2] mb-3 italic drop-shadow-sm">포근한 광장</h1>
          <p className="text-xs font-black text-pastel-blue tracking-[0.4em] uppercase">Warm & Cute Community</p>
        </div>

        {/* User Info / Logout */}
        {user && (
          <div className="mb-8 flex justify-between items-center bg-white/80 dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border-2 border-white dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pastel-blue flex items-center justify-center text-white font-black text-xl border-2 border-white">
                {region.substring(0, 1)}
              </div>
              <div>
                <span className="font-black text-sm block leading-tight text-gray-600 dark:text-gray-200">{userId}</span>
                <span className="text-[10px] text-pastel-blue font-black uppercase tracking-widest">Connected from {region} 📍</span>
              </div>
            </div>
            <button onClick={() => signOut(auth)} className="text-xs text-pastel-pink font-black hover:underline px-4 py-2 bg-[#FFF0F3] rounded-full">로그아웃</button>
          </div>
        )}

        {/* Write Box */}
        <div className="bg-white/90 dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border-4 border-white dark:border-gray-700 mb-12 overflow-hidden relative group transition-all hover:shadow-xl">
          {!user && (
            <div className="absolute inset-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-8 text-center">
              <div className="flex flex-col items-center">
                <p className="text-lg font-black text-gray-500 dark:text-gray-300 mb-6 italic">친구들과 포근한 이야기를 나눠보세요! ✨</p>
                <button 
                  onClick={() => handleAction('login')}
                  className="px-10 py-4 bg-pastel-blue text-white rounded-full font-black shadow-lg hover:scale-105 transition-all flex items-center gap-3 border-4 border-white"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-6 h-6 bg-white rounded-full p-1" />
                  Google 로그인
                </button>
              </div>
            </div>
          )}
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="포근한 이야기를 들려주세요... 🧸"
            className="w-full h-32 bg-[#F0F7F9] dark:bg-gray-950 rounded-[1.8rem] p-6 outline-none dark:text-white resize-none border-2 border-transparent focus:border-pastel-blue transition-all font-medium text-lg placeholder:text-gray-300"
          />
          <div className="flex justify-end mt-6">
            <button 
              onClick={() => handleAction('submit')}
              className="px-8 py-3 bg-pastel-pink text-white rounded-full font-black text-lg border-4 border-white shadow-md hover:scale-105 transition-all"
            >
              글 남기기 💌
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-8">
          <h3 className="text-2xl font-black px-4 flex items-center gap-3 text-[#FF9AA2]">
            <span className="w-2 h-6 bg-pastel-pink rounded-full"></span>
            이야기 꾸러미
          </h3>
          {isLoading ? (
            <div className="text-center py-24 text-pastel-blue animate-pulse font-black tracking-widest text-xl">포근하게 연결 중... ☁️</div>
          ) : posts.length === 0 ? (
            <div className="py-24 text-center text-gray-400 font-black italic text-lg">아직 빈 주머니에요. 첫 소식을 담아보세요! 🎈</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white/90 dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border-4 border-white dark:border-gray-700 animate-fade-in hover:border-pastel-blue dark:hover:border-blue-700 transition-all group">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-3">
                    <span className="text-[11px] font-black px-3 py-1 bg-pastel-blue/20 text-pastel-blue rounded-full uppercase tracking-widest border border-pastel-blue/10">{post.mbti}</span>
                    <span className="text-[11px] font-black px-3 py-1 bg-pastel-pink/20 text-pastel-pink rounded-full uppercase tracking-widest border border-pastel-pink/10">{post.region || 'Online'}</span>
                  </div>
                  <span className="text-[10px] text-gray-300 font-black">{formatTime(post.createdAt)}</span>
                </div>
                <p className="font-black text-xs text-pastel-blue mb-3 px-1">{post.authorId} 🐾</p>
                <p className="text-gray-600 dark:text-gray-300 text-xl mb-8 whitespace-pre-wrap leading-relaxed font-medium px-1">{post.content}</p>
                
                <div className="flex gap-6 border-t-2 border-[#F0F7F9] dark:border-gray-700 pt-6">
                  <button onClick={() => updateDoc(doc(db, 'posts', post.id), { likes: increment(1) })} className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-pastel-pink transition-colors">
                    <span className="text-xl">❤️</span> {post.likes}
                  </button>
                  <span className="flex items-center gap-2 text-sm font-black text-gray-400">
                    <span className="text-xl">💬</span> {post.comments?.length || 0}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
