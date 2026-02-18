import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, updateDoc, doc, arrayUnion 
} from 'firebase/firestore';

const CommunityPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userMbti = location.state?.mbti || localStorage.getItem('userMbti') || 'GUEST';
  
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [posts, setPosts] = useState([]);
  const [inputText, setInputText] = useState('');
  const [commentInputs, setCommentInputs] = useState({}); // { postId: 'text' }

  // 1. 유저 상태 감지 (Firebase Auth)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Use stored MBTI or default to GUEST if somehow missing
        const currentMbti = userMbti !== 'GUEST' ? userMbti : (localStorage.getItem('userMbti') || 'GUEST');
        const customId = `${currentMbti}-${currentUser.displayName?.split(' ')[0] || '익명'}`;
        setUserId(customId);
        setUser(currentUser);
      } else {
        setUser(null);
        setUserId('');
      }
    });
    return () => unsubscribe();
  }, [userMbti]);

  // 2. 게시글 실시간 불러오기
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  // 3. 구글 로그인
  const handleGoogleLogin = async () => {
    if (userMbti === 'GUEST' && !localStorage.getItem('userMbti')) {
      alert('본인의 성향(MBTI) 기반 아이디 생성을 위해 테스트를 먼저 진행해주세요! ✨');
      navigate('/');
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
      alert('로그인에 실패했습니다. 팝업 차단 여부를 확인해주세요.');
    }
  };

  // 4. 글쓰기 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

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
    } catch (error) {
      console.error("Add Post Error:", error);
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
      console.error("Comment Error:", error);
    }
  };

  // 6. 좋아요
  const handleLike = async (postId, currentLikes) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: currentLikes + 1
      });
    } catch (error) {
      console.error("Like Error:", error);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 py-8 transition-colors duration-300 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">←</button>
          <div className="text-center">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">COMMUNITY</h1>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">Real-time MBTI Board</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Auth Section */}
        {!user ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-xl text-center border border-gray-100 dark:border-gray-800 mb-10">
            <h2 className="text-2xl font-bold mb-4">커뮤니티 로그인</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">안전한 소통을 위해 구글 로그인이 필요합니다.</p>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50 transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-6 h-6" />
              Google로 시작하기
            </button>
          </div>
        ) : (
          <div className="mb-10 flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
            <img src={user.photoURL} alt="profile" className="w-14 h-14 rounded-2xl shadow-lg" />
            <div className="flex-grow">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">LOGGED IN AS</p>
              <h3 className="text-xl font-black text-gray-800 dark:text-white leading-none">{userId}</h3>
            </div>
            <button onClick={() => signOut(auth)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-all">로그아웃</button>
          </div>
        )}

        {/* Board Content */}
        <div className={`space-y-8 ${!user ? 'opacity-40 pointer-events-none blur-[2px]' : ''}`}>
          
          {/* Write Section */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`${userId}님, 무슨 생각을 하고 계신가요?`}
              className="w-full h-24 bg-gray-50 dark:bg-gray-950 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white resize-none border border-gray-100 dark:border-gray-800"
            />
            <button type="submit" className="w-full mt-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm">글 등록하기</button>
          </form>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-md border border-gray-50 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 uppercase">{post.mbti}</span>
                  <span className="text-[10px] text-gray-400">{post.createdAt?.toDate().toLocaleString() || '방금 전'}</span>
                </div>
                <p className="font-bold text-sm text-blue-500 mb-1">{post.authorId}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">{post.content}</p>
                
                {/* Actions */}
                <div className="flex gap-6 border-t border-gray-50 dark:border-gray-800 pt-4 mb-6">
                  <button onClick={() => handleLike(post.id, post.likes)} className="text-xs font-bold text-gray-400 hover:text-red-500">❤️ {post.likes}</button>
                  <span className="text-xs font-bold text-gray-400">💬 {post.comments?.length || 0}</span>
                </div>

                {/* Comment List */}
                <div className="space-y-3 mb-4">
                  {post.comments?.map((comment, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl text-sm">
                      <p className="font-bold text-xs text-blue-400 mb-1">{comment.author}</p>
                      <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    placeholder="댓글을 남겨주세요..."
                    className="flex-grow bg-gray-50 dark:bg-gray-950 rounded-lg px-4 py-2 text-sm outline-none border border-gray-100 dark:border-gray-800"
                  />
                  <button onClick={() => handleCommentSubmit(post.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold">등록</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
