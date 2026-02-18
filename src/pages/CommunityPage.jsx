import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, updateDoc, doc, arrayUnion, increment 
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

  // 시간 포맷팅 안전 함수
  const formatTime = (createdAt) => {
    if (!createdAt) return '방금 전';
    try {
      // Firebase Timestamp인 경우 toDate() 사용, 아니면 일반 Date 처리
      const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return date.toLocaleString();
    } catch (e) {
      return '최근';
    }
  };

  // 1. 유저 상태 관리
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const shortId = currentUser.uid.substring(0, 4).toUpperCase();
        const customId = `${userMbti}-${shortId}`;
        setUserId(customId);
        setUser(currentUser);
        localStorage.setItem('userMbti', userMbti);
      } else {
        setUser(null);
        setUserId('');
      }
    });
    return () => unsubscribe();
  }, [userMbti]);

  // 2. 게시글 동기화
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

  // 3. 로그인 및 글쓰기 액션
  const handleAction = async (task) => {
    if (!user) {
      if (userMbti === 'GUEST' && !localStorage.getItem('userMbti')) {
        alert('성향 기반 아이디 생성을 위해 MBTI 테스트를 먼저 완료해주세요! ✨');
        navigate('/');
        return;
      }
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (e) {
        console.error(e);
        alert('구글 로그인 중 오류가 발생했습니다.');
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
          mbti: userMbti
        });
        setInputText('');
      } catch (e) {
        alert('글 등록 권한이 없습니다. Firebase 규칙을 확인해주세요.');
      }
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 py-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2 tracking-tighter">MBTI BOARD</h1>
          <p className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase">Version 1.7 - Real-time</p>
        </div>

        {/* User Info / Logout */}
        {user && (
          <div className="mb-6 flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <img src={user.photoURL} alt="p" className="w-8 h-8 rounded-full" />
              <span className="font-bold text-sm">{userId}님 접속 중</span>
            </div>
            <button onClick={() => signOut(auth)} className="text-xs text-red-500 font-bold">로그아웃</button>
          </div>
        )}

        {/* ✍️ Write Box */}
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
                  Google로 로그인
                </button>
              </div>
            </div>
          )}
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="이곳에 글을 작성해 보세요..."
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

        {/* 📜 Posts List */}
        <div className="space-y-6">
          <h3 className="text-xl font-black px-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
            최근 피드
          </h3>
          {isLoading ? (
            <div className="text-center py-20 text-gray-400 animate-pulse font-bold">불러오는 중...</div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-medium">아직 게시글이 없습니다. 첫 글을 남겨보세요!</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black px-2 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-md uppercase">{post.mbti}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{formatTime(post.createdAt)}</span>
                </div>
                <p className="font-bold text-xs text-blue-500 mb-2">{post.authorId}</p>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                
                <div className="flex gap-4 border-t border-gray-50 dark:border-gray-800 pt-4">
                  <button onClick={() => updateDoc(doc(db, 'posts', post.id), { likes: increment(1) })} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                    ❤️ {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-500">
                    💬 {post.comments?.length || 0}
                  </button>
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