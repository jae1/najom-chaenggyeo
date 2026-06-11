import { useAuth } from '../hooks/useAuth';
import { User, LogOut, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="pb-24 pt-4 px-2">
      <header className="py-6">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          내 <span className="text-primary-500">정보</span>
        </h1>
      </header>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 mb-6">
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-500 mr-5">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.user_metadata?.full_name || '게스트 사용자'}</h2>
            <p className="text-gray-500 text-sm">{user?.email || 'guest@example.com'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center text-gray-700">
              <ShieldCheck size={20} className="mr-3 text-green-500" />
              <span className="font-medium">계정 상태</span>
            </div>
            <span className="text-sm font-bold text-green-600">활성 (임시)</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 mb-8 text-center">
        <h3 className="text-lg font-bold text-gray-800 italic">"나를 아끼는 습관, 나좀챙겨"</h3>
      </div>

      <button
        onClick={async () => {
          if (window.confirm('로그아웃 하시겠습니까?')) {
            await signOut();
            // Optional: window.location.href = '/' to cleanly reset routing state
          }
        }}
        className="w-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold py-5 rounded-[2rem] hover:bg-gray-200 transition-all active:scale-95"
      >
        <LogOut size={20} className="mr-2" />
        로그아웃
      </button>

      <div className="mt-12 text-center">
        <p className="text-xs text-gray-300 font-medium tracking-widest uppercase">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Profile;
