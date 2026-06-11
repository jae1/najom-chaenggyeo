import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Droplets, Dumbbell, Scale, Moon, Smile } from 'lucide-react';

const DailyHealthForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    weight: '',
    water_intake: 0,
    sleep_hours: '',
    exercise_done: false,
    bowel_movement: false,
    period: false,
    condition: 3,
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const { data: existingData, error } = await supabase
        .from('daily_health')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (existingData) {
        setData({
          weight: existingData.weight?.toString() || '',
          water_intake: existingData.water_intake || 0,
          sleep_hours: existingData.sleep_hours?.toString() || '',
          exercise_done: existingData.exercise_done || false,
          bowel_movement: existingData.bowel_movement || false,
          period: existingData.period || false,
          condition: existingData.condition || 3,
        });
      }
    };
    fetchData();
  }, [user, today]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    
    // Explicitly using upsert with the unique constraint in mind
    const { error } = await supabase.from('daily_health').upsert({
      user_id: user.id,
      date: today,
      weight: data.weight ? parseFloat(data.weight) : null,
      water_intake: data.water_intake,
      sleep_hours: data.sleep_hours ? parseFloat(data.sleep_hours) : null,
      exercise_done: data.exercise_done,
      bowel_movement: data.bowel_movement,
      period: data.period,
      condition: data.condition,
    }, { onConflict: 'user_id,date' });

    setLoading(false);
    if (error) alert('저장 실패: ' + error.message);
    else alert('오늘의 건강 기록이 업데이트되었습니다! ✨');
  };

  const handleReset = async () => {
    if (!window.confirm('오늘의 건강 기록을 삭제할까요?')) return;
    if (!user) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('daily_health')
      .delete()
      .eq('user_id', user.id)
      .eq('date', today);
    
    if (!error) {
      setData({
        weight: '',
        water_intake: 0,
        sleep_hours: '',
        exercise_done: false,
        bowel_movement: false,
        period: false,
        condition: 3,
      });
      alert('오늘의 기록이 초기화되었습니다.');
    } else {
      alert('초기화 실패: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-pink-50 p-4 rounded-xl">
        <div className="flex items-center">
          <Scale className="text-pink-500 mr-3" size={20} />
          <span className="font-medium">몸무게</span>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={data.weight}
            onChange={(e) => setData({ ...data, weight: e.target.value })}
            placeholder="0.0"
            className="w-16 bg-transparent border-b border-pink-200 text-right focus:outline-none focus:border-pink-500 mr-1"
          />
          <span className="text-sm text-gray-500">kg</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Droplets className="text-blue-500 mr-3" size={20} />
            <span className="font-medium">물 섭취량</span>
          </div>
          <span className="font-bold text-blue-600">{data.water_intake} ml</span>
        </div>
        <input
          type="range"
          min="0"
          max="3000"
          step="100"
          value={data.water_intake}
          onChange={(e) => setData({ ...data, water_intake: parseInt(e.target.value) })}
          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-blue-400 mt-2 font-medium">
          <span>0ml</span>
          <span>1.5L</span>
          <span>3L</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setData({ ...data, exercise_done: !data.exercise_done })}
          className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
            data.exercise_done ? 'bg-green-100 border-2 border-green-500 shadow-sm' : 'bg-gray-50 border-2 border-transparent'
          }`}
        >
          <Dumbbell className={data.exercise_done ? 'text-green-600' : 'text-gray-400'} />
          <span className={`text-sm mt-2 font-medium ${data.exercise_done ? 'text-green-700' : 'text-gray-500'}`}>운동 완료</span>
        </button>

        <button
          onClick={() => setData({ ...data, bowel_movement: !data.bowel_movement })}
          className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
            data.bowel_movement ? 'bg-yellow-100 border-2 border-yellow-500 shadow-sm' : 'bg-gray-50 border-2 border-transparent'
          }`}
        >
          <Smile className={data.bowel_movement ? 'text-yellow-600' : 'text-gray-400'} />
          <span className={`text-sm mt-2 font-medium ${data.bowel_movement ? 'text-yellow-700' : 'text-gray-500'}`}>쾌변!</span>
        </button>
      </div>

      <div className="bg-purple-50 p-4 rounded-xl">
        <div className="flex items-center mb-3">
          <Moon className="text-purple-500 mr-3" size={20} />
          <span className="font-medium">오늘의 컨디션</span>
        </div>
        <div className="flex justify-between px-2">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => setData({ ...data, condition: val })}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                data.condition === val ? 'bg-purple-500 text-white shadow-md scale-110' : 'bg-white text-gray-400'
              }`}
            >
              {val === 1 ? '😫' : val === 2 ? '😕' : val === 3 ? '😐' : val === 4 ? '😊' : '🤩'}
            </button>
          ))}
        </div>
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
          className="w-2/3 bg-primary-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-100 hover:bg-primary-600 active:scale-95 transition-all disabled:bg-gray-300"
        >
          {loading ? '저장 중...' : '오늘의 건강 기록하기'}
        </button>
      </div>
    </div>
  );
};

export default DailyHealthForm;
