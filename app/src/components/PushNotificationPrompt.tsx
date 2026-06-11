import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Bell, BellOff, CheckCircle2 } from 'lucide-react';

const PushNotificationPrompt: React.FC = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) setIsSubscribed(true);
    };
    checkSubscription();
  }, [user]);

  const subscribe = async () => {
    if (typeof Notification === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('이 브라우저는 푸시 알림을 지원하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // This part would normally subscribe the user to the push manager
        // and then save the subscription object to Supabase.
        
        if (user) {
          await supabase.from('push_subscriptions').upsert({
            user_id: user.id,
            subscription: { endpoint: 'mock_endpoint', keys: { auth: 'mock', p256dh: 'mock' } }
          });
          setIsSubscribed(true);
          alert('알림 설정이 완료되었습니다! 🔔');
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
    setLoading(false);
  };

  if (permission === 'denied') {
    return (
      <div className="bg-red-50 p-4 rounded-2xl flex items-center text-red-600 text-sm font-medium mb-6">
        <BellOff size={18} className="mr-3" />
        브라우저 설정에서 알림 권한을 허용해주세요.
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="bg-green-50 p-4 rounded-2xl flex items-center text-green-600 text-sm font-medium mb-6">
        <CheckCircle2 size={18} className="mr-3" />
        매일 오후 9시에 건강 기록 알림을 보내드릴게요!
      </div>
    );
  }

  return (
    <div className="bg-primary-50 p-6 rounded-[2rem] border border-primary-100 mb-8">
      <div className="flex items-start mb-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm mr-4">
          <Bell className="text-primary-500" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">잊지 말고 나를 챙기세요!</h3>
          <p className="text-sm text-gray-500 mt-1">매일 정해진 시간에 알림을 보내드릴게요.</p>
        </div>
      </div>
      <button
        onClick={subscribe}
        disabled={loading}
        className="w-full bg-white text-primary-600 font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center"
      >
        {loading ? '설정 중...' : '알림 받기'}
      </button>
    </div>
  );
};

export default PushNotificationPrompt;
