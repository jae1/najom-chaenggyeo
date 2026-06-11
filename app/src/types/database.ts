export interface DailyHealth {
  id: string;
  user_id: string;
  date: string;
  bowel_movement: boolean;
  weight: number | null;
  water_intake: number;
  sleep_hours: number | null;
  exercise_done: boolean;
  exercise_notes: string | null;
  period: boolean;
  condition: 1 | 2 | 3 | 4 | 5 | null;
  created_at: string;
}

export interface SkinCare {
  id: string;
  user_id: string;
  date: string;
  scalp: boolean;
  gua_sha: boolean;
  face_yoga: boolean;
  ems: boolean;
  skin_status: string | null;
  skin_care_notes: string | null;
  created_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  subscription: Record<string, unknown>;
  created_at: string;
}
