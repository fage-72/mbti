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
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. 유저 상태 관리
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const shortId = currentUser.uid.substring(0, 4).toUpperCase();
        setUserId(`${userMbti}-${shortId}`);
        setUser(currentUser);
      } else {
        setUser(null);
        setUserId('');
      }
    });
    return () => unsubscribe();
  }, [userMbti]);

  // 2. 게시글 동기화
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. 로그인/글쓰기 로직
  const handleAction = async (task) => {
    if (!user) {
      if (userMbti === 'GUEST') {
        alert('테스트를 먼저 완료해야 커뮤니티 활동이 가능합니다! 🏃‍♂️');
        navigate('/');
        return;
      }
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (e) {
        alert('로그인이 필요합니다.');
      }
      return;
    }
    if (task === 'submit' && inputText.trim()) {
      await addDoc(collection(db, 'posts'), {
        authorId: userId,
        content: inputText,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
        mbti: userMbti
      });
      setInputText('');
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 py-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        
        {/* Header with Version */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">MBTI BOARD</h1>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Version 1.6 - Real-time active</p>
        </div>

        {/* Global Back Button */}
        <button onClick={() => navigate(-1)} className="mb-6 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-sm font-bold">← 이전으로</button>

        {/* ✍️ Write Box - ALWAYS VISIBLE but prompts login */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900/30 mb-10 overflow-hidden relative">
          {!user && (
            <div className="absolute inset-0 z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center">
              <button 
                onClick={() => handleAction('login')}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:scale-105 transition-all"
              >
                로그인하고 글쓰기 ✍️
              </button>
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

        {/* 📜 Posts List */}
        <div className="space-y-6">
          <h3 className="text-xl font-black px-2">최신 피드</h3>
          {isLoading ? (
            <p className="text-center py-10 text-gray-400">불러오는 중...</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-md uppercase">{post.mbti}</span>
                  <span className="text-[10px] text-gray-400">{post.createdAt?.toDate().toLocaleString() || '방금 전'}</span>
                </div>
                <p className="font-bold text-sm text-blue-500 mb-2">{post.authorId}</p>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 whitespace-pre-wrap">{post.content}</p>
                
                {/* 좋아요/댓글 */}
                <div className="flex gap-4 border-t border-gray-50 dark:border-gray-800 pt-4">
                  <button onClick={() => updateDoc(doc(db, 'posts', post.id), { likes: increment(1) })} className="text-xs font-bold text-gray-400">❤️ {post.likes}</button>
                  <span className="text-xs font-bold text-gray-400">💬 {post.comments?.length || 0}</span>
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
