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

  // 1. 접속 지역 정보 가져오기
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

  // 2. 모바일 리다이렉트 결과 처리
  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect Login Error", error);
    });
  }, []);

  // 3. 유저 상태 관리 및 ID 생성
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

  // 4. 게시글 동기화
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (task) => {
    if (!user) {
      if (userMbti === 'GUEST' && !localStorage.getItem('userMbti')) {
        alert('테스트를 먼저 완료해주세요! ✨');
        navigate('/');
        return;
      }
      try {
        // 모바일 기기 감지
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          await signInWithRedirect(auth, googleProvider);
        } else {
          await signInWithPopup(auth, googleProvider);
        }
      } catch (e) {
        alert('로그인에 실패했습니다. 브라우저의 팝업 차단 설정을 확인해주세요.');
      }
      return;
    }

    if (task === 'submit' && inputText.trim()) {
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
        alert('글 등록 권한이 없습니다.');
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
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 py-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2 tracking-tighter italic">MBTI WORLD</h1>
          <p className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase">Version 1.9 - Mobile Optimized</p>
        </div>

        {user && (
          <div className="mb-6 flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {region.substring(0, 1)}
              </div>
              <div>
                <span className="font-black text-sm block leading-tight">{userId}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Connected from {region}</span>
              </div>
            </div>
            <button onClick={() => signOut(auth)} className="text-xs text-red-500 font-bold hover:underline">로그아웃</button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900/30 mb-10 overflow-hidden relative">
          {!user && (
            <div className="absolute inset-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4">로그인 후 자유롭게 소통해보세요!</p>
                <button 
                  onClick={() => handleAction('login')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5 bg-white rounded-full p-0.5" />
                  Google로 시작하기
                </button>
              </div>
            </div>
          )}
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="여기에 글을 작성해보세요!"
            className="w-full h-24 bg-gray-50 dark:bg-gray-950 rounded-2xl p-4 outline-none dark:text-white resize-none border border-gray-100 dark:border-gray-800"
          />
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => handleAction('submit')}
              className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-black text-sm"
            >
              등록하기
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black px-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
            실시간 피드
          </h3>
          {isLoading ? (
            <div className="text-center py-20 text-gray-400 animate-pulse font-bold tracking-widest">CONNECTING...</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 animate-fade-in hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-black px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-md uppercase">{post.mbti}</span>
                    <span className="text-[10px] font-black px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md uppercase">{post.region || 'Online'}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">{formatTime(post.createdAt)}</span>
                </div>
                <p className="font-black text-xs text-blue-500 mb-2">{post.authorId}</p>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                
                <div className="flex gap-4 border-t border-gray-50 dark:border-gray-800 pt-4">
                  <button onClick={() => updateDoc(doc(db, 'posts', post.id), { likes: increment(1) })} className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-red-500 transition-colors">
                    ❤️ {post.likes}
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-black text-gray-400">
                    💬 {post.comments?.length || 0}
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