import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { DailyHealth, SkinCare } from '../types/database';
import { Calendar, ChevronRight, Droplets, Dumbbell, Scale, Heart, Sparkles } from 'lucide-react';

interface HistoryItem {
  date: string;
  health?: DailyHealth;
  skin?: SkinCare;
}

const History: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      const [healthRes, skinRes] = await Promise.all([
        supabase
          .from('daily_health')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false }),
        supabase
          .from('skin_care')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
      ]);

      const healthData = healthRes.data || [];
      const skinData = skinRes.data || [];

      // Merge by date
      const dateMap: Record<string, HistoryItem> = {};
      
      healthData.forEach(h => {
        if (!dateMap[h.date]) dateMap[h.date] = { date: h.date };
        dateMap[h.date].health = h;
      });

      skinData.forEach(s => {
        if (!dateMap[s.date]) dateMap[s.date] = { date: s.date };
        dateMap[s.date].skin = s;
      });

      const sortedHistory = Object.values(dateMap).sort((a, b) => 
        b.date.localeCompare(a.date)
      );

      setHistory(sortedHistory);
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]">기록 불러오는 중...</div>;
  }

  return (
    <div className="pb-24 pt-4">
      <header className="py-6 px-2">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          나의 <span className="text-primary-500">기록들</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">지금까지의 변화를 확인해보세요.</p>
      </header>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-dashed border-gray-200">
            아직 기록이 없습니다.<br/>오늘의 나를 먼저 챙겨보세요!
          </div>
        ) : (
          history.map((item) => (
            <div key={item.date} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center font-bold text-gray-800">
                  <Calendar size={18} className="text-primary-400 mr-2" />
                  {new Date(item.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>

              <div className="flex flex-wrap gap-2">
                {item.health && (
                  <>
                    {item.health.weight && (
                      <div className="flex items-center bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Scale size={12} className="mr-1" /> {item.health.weight}kg
                      </div>
                    )}
                    {item.health.water_intake > 0 && (
                      <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Droplets size={12} className="mr-1" /> {item.health.water_intake}ml
                      </div>
                    )}
                    {item.health.exercise_done && (
                      <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Dumbbell size={12} className="mr-1" /> 운동
                      </div>
                    )}
                  </>
                )}
                {item.skin && (
                  <>
                    {(item.skin.gua_sha || item.skin.face_yoga || item.skin.scalp || item.skin.ems) && (
                      <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Sparkles size={12} className="mr-1" /> 스킨케어
                      </div>
                    )}
                  </>
                )}
                {item.health?.condition && (
                  <div className="text-lg ml-auto">
                    {item.health.condition === 1 ? '😫' : item.health.condition === 2 ? '😕' : item.health.condition === 3 ? '😐' : item.health.condition === 4 ? '😊' : '🤩'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
