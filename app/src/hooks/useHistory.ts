import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { DailyHealth, SkinCare } from '../types/database';

export interface HistoryItem {
  date: string;
  health?: DailyHealth;
  skin?: SkinCare;
}

export const useHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchHistory();
  }, [user]);

  return { history, loading, refetch: fetchHistory };
};
