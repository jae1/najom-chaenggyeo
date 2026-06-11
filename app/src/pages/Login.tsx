import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react';

const Login: React.FC = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-600 mb-2">나좀챙겨</h1>
        <div className="flex justify-center mb-4">
          <Heart size={48} className="text-primary-400" />
        </div>
        <p className="text-gray-600 italic">"매일매일 나를 아끼는 습관"</p>
      </div>
      
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-sm px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="w-5 h-5 mr-3"
        />
        Google로 시작하기
      </button>
      
      <div className="mt-12 text-sm text-gray-400">
        <p>로그인하여 오늘의 건강과<br/>피부 루틴을 기록해보세요.</p>
      </div>
    </div>
  );
};

export default Login;
