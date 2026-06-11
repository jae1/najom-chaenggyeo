import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Scissors, Zap, Heart } from 'lucide-react';

const SkinCareForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    scalp: false,
    gua_sha: false,
    face_yoga: false,
    ems: false,
    skin_status: '',
    skin_care_notes: '',
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const { data: existingData, error } = await supabase
        .from('skin_care')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (existingData) {
        setData({
          scalp: existingData.scalp || false,
          gua_sha: existingData.gua_sha || false,
          face_yoga: existingData.face_yoga || false,
          ems: existingData.ems || false,
          skin_status: existingData.skin_status || '',
          skin_care_notes: existingData.skin_care_notes || '',
        });
      }
    };
    fetchData();
  }, [user, today]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('skin_care').upsert({
      user_id: user.id,
      date: today,
      scalp: data.scalp,
      gua_sha: data.gua_sha,
      face_yoga: data.face_yoga,
      ems: data.ems,
      skin_status: data.skin_status,
      skin_care_notes: data.skin_care_notes,
    }, { onConflict: 'user_id,date' });
    
    setLoading(false);
    if (error) alert('저장 실패: ' + error.message);
    else alert('오늘의 피부 루틴이 업데이트되었습니다! ✨');
  };

  const handleReset = async () => {
    if (!window.confirm('오늘의 피부 루틴 기록을 삭제할까요?')) return;
    if (!user) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('skin_care')
      .delete()
      .eq('user_id', user.id)
      .eq('date', today);
    
    if (!error) {
      setData({
        scalp: false,
        gua_sha: false,
        face_yoga: false,
        ems: false,
        skin_status: '',
        skin_care_notes: '',
      });
      alert('오늘의 피부 기록이 초기화되었습니다.');
    } else {
      alert('초기화 실패: ' + error.message);
    }
    setLoading(false);
  };

  const routines = [
    { key: 'scalp', label: '두피 케어', icon: <Scissors className="text-orange-500" />, color: 'bg-orange-50' },
    { key: 'gua_sha', label: '괄사', icon: <Heart className="text-pink-500" />, color: 'bg-pink-50' },
    { key: 'face_yoga', label: '페이스 요가', icon: <Sparkles className="text-blue-500" />, color: 'bg-blue-50' },
    { key: 'ems', label: 'EMS', icon: <Zap className="text-yellow-500" />, color: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {routines.map((item) => (
          <button
            key={item.key}
            onClick={() => setData({ ...data, [item.key]: !data[item.key] })}
            className={`flex items-center p-4 rounded-xl transition-all ${
              data[item.key] ? `${item.color} border-2 border-current shadow-sm` : 'bg-gray-50 border-2 border-transparent'
            }`}
          >
            <div className="mr-3">{item.icon}</div>
            <span className={`text-sm font-medium ${data[item.key] ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">오늘의 피부 상태 / 메모</label>
        <textarea
          value={data.skin_care_notes}
          onChange={(e) => setData({ ...data, skin_care_notes: e.target.value })}
          placeholder="오늘 피부는 어땠나요?"
          className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[100px]"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-1/3 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          초기화
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-2/3 bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-95 transition-all disabled:bg-gray-300"
        >
          {loading ? '저장 중...' : '오늘의 루틴 완료하기'}
        </button>
      </div>
    </div>
  );
};

export default SkinCareForm;
