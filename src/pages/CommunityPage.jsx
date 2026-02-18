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
  const [dbError, setDbError] = useState(null);

  // 1. 유저 상태 감지 및 ID 생성
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // ID 생성: MBTI + 구글 고유 ID 뒷 4자리 (순서별 번호 대용으로 고유성 보장)
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

  // 2. 게시글 실시간 동기화 (Firestore)
  useEffect(() => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
        setIsLoading(false);
      }, (err) => {
        console.error("Firestore Error:", err);
        setDbError("데이터를 불러올 수 없습니다. Firebase 규칙 설정을 확인해주세요.");
        setIsLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setDbError("연결 오류가 발생했습니다.");
      setIsLoading(false);
    }
  }, []);

  // 3. 로그인 처리
  const handleGoogleLogin = async () => {
    if (userMbti === 'GUEST' && !localStorage.getItem('userMbti')) {
      alert('성향 기반 아이디 생성을 위해 MBTI 테스트를 먼저 완료해주세요! ✨');
      navigate('/');
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다. (팝업 차단 등)');
    }
  };

  // 4. 새 게시글 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    try {
      await addDoc(collection(db, 'posts'), {
        authorId: userId,
        authorPhoto: user.photoURL,
        content: inputText,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
        mbti: userMbti
      });
      setInputText('');
    } catch (error) {
      alert('글 등록 권한이 없습니다. (DB 규칙 확인 필요)');
    }
  };

  // 5. 댓글 등록
  const handleCommentSubmit = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim() || !user) return;

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          author: userId,
          content: commentText,
          createdAt: new Date().toISOString()
        })
      });
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (error) {
      alert('댓글 등록에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-all text-xl">⬅️</button>
          <div className="text-center">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500">MBTI SQUARE</h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase">Real-time Discussion</p>
          </div>
          <div className="w-10"></div>
        </header>

        {/* Auth Banner */}
        {!user ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-blue-100 dark:border-blue-900/30 mb-10 text-center animate-fade-in">
            <h2 className="text-xl font-bold mb-3">익명으로 소통을 시작하세요</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">구글 로그인 시 당신의 MBTI가 포함된 고유 아이디가 생성됩니다.</p>
            <button
              onClick={handleGoogleLogin}
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 mx-auto hover:shadow-lg transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
              Google로 로그인하여 참여하기
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-3xl mb-10 border border-blue-100 dark:border-blue-800/50">
            <img src={user.photoURL} alt="p" className="w-12 h-12 rounded-2xl shadow-md border-2 border-white dark:border-gray-700" />
            <div className="flex-grow">
              <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-tighter">Verified Member</span>
              <h3 className="text-lg font-black leading-none">{userId}님</h3>
            </div>
            <button onClick={() => signOut(auth)} className="text-xs font-bold text-gray-400 hover:text-red-400">로그아웃</button>
          </div>
        )}

        {/* Error Message */}
        {dbError && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm mb-8 text-center border border-red-100 dark:border-red-900/30 font-medium">
            ⚠️ {dbError}
          </div>
        )}

        {/* Main Feed */}
        <div className="space-y-10">
          {/* Write Box - Only for logged in */}
          {user && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 animate-slide-up">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="나와 같은 MBTI 사람들에게 하고 싶은 말이 있나요?"
                className="w-full h-32 bg-gray-50 dark:bg-gray-950 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all dark:text-white resize-none border border-gray-100 dark:border-gray-800 text-lg"
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleSubmit}
                  className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  게시글 등록
                </button>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-6">
            <h2 className="text-xl font-black flex items-center gap-2 px-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              최근 게시글
            </h2>
            
            {isLoading ? (
              <div className="text-center py-20 text-gray-400 animate-pulse font-bold">게시글을 불러오는 중...</div>
            ) : posts.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl text-center border border-dashed border-gray-200 dark:border-gray-800 text-gray-400">
                첫 번째 글의 주인공이 되어보세요! ✍️
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden transition-all hover:shadow-lg group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg shadow-inner">
                          {post.mbti?.substring(0, 1) === 'I' ? '💜' : '🧡'}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-800 dark:text-gray-100 leading-tight">{post.authorId}</h4>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{post.createdAt?.toDate().toLocaleString() || '방금 전'}</span>
                        </div>
                      </div>
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-black px-2 py-1 rounded-md">{post.mbti}</span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Like & Comment Count */}
                    <div className="flex gap-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                      <button 
                        onClick={() => updateDoc(doc(db, 'posts', post.id), { likes: increment(1) })}
                        className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-red-500 transition-colors"
                      >
                        ❤️ {post.likes}
                      </button>
                      <span className="flex items-center gap-2 text-xs font-black text-gray-400">
                        💬 {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Comment Section (Simple) */}
                  <div className="bg-gray-50 dark:bg-gray-950 p-6 space-y-4">
                    <div className="space-y-3">
                      {post.comments?.map((comment, i) => (
                        <div key={i} className="flex gap-3 animate-fade-in">
                          <div className="w-1 h-auto bg-blue-500/20 rounded-full"></div>
                          <div className="flex-grow">
                            <p className="text-[11px] font-black text-blue-500 mb-0.5">{comment.author}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {user && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <input 
                          type="text" 
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          placeholder="따뜻한 댓글을 남겨주세요..."
                          className="flex-grow bg-white dark:bg-gray-900 rounded-xl px-4 py-2 text-sm outline-none border border-gray-200 dark:border-gray-800 focus:border-blue-500 transition-all"
                        />
                        <button 
                          onClick={() => handleCommentSubmit(post.id)}
                          className="px-4 py-2 bg-gray-800 dark:bg-blue-600 text-white rounded-xl text-xs font-black hover:scale-105 transition-all"
                        >
                          등록
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="mt-20 text-center text-[10px] text-gray-400 font-bold tracking-[0.5em] uppercase">
          MBTI Square Board v1.5
        </p>
      </div>
    </div>
  );
};

export default CommunityPage;