import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) {
        alert(error.message);
      } else {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        setIsSignUp(false); // Switch to login view after successful signup
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert('로그인 실패: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
      <div className="mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-pink-100 p-4 rounded-[2rem] shadow-sm">
            <Heart size={48} className="text-primary-500 fill-primary-500" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">나좀챙겨</h1>
        <p className="text-gray-500 font-medium italic">"나를 사랑하는 가장 쉬운 방법"</p>
      </div>
      
      <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
        {isSignUp && (
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="이름"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 text-white font-bold py-5 rounded-[2rem] shadow-lg shadow-pink-100 hover:bg-primary-600 active:scale-95 transition-all flex items-center justify-center disabled:bg-gray-300"
        >
          {loading ? '처리 중...' : isSignUp ? '시작하기' : '로그인'}
          <ArrowRight size={20} className="ml-2" />
        </button>
      </form>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-8 text-sm font-bold text-gray-400 hover:text-primary-500 transition-colors"
      >
        {isSignUp ? '이미 계정이 있으신가요? 로그인하기' : '처음이신가요? 회원가입하기'}
      </button>
      
      <div className="mt-12 text-xs text-gray-300">
        <p>오늘의 건강과 피부 루틴을 기록하고<br/>나만의 변화를 확인해보세요.</p>
      </div>
    </div>
  );
};

export default Login;
