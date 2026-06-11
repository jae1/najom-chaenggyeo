-- Create daily_health table
CREATE TABLE IF NOT EXISTS daily_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    bowel_movement BOOLEAN DEFAULT false,
    weight DECIMAL(5,2),
    water_intake INTEGER DEFAULT 0, -- in ml
    sleep_hours DECIMAL(4,2),
    exercise_done BOOLEAN DEFAULT false,
    exercise_notes TEXT,
    period BOOLEAN DEFAULT false,
    condition INTEGER CHECK (condition >= 1 AND condition <= 5), -- 1: Bad, 5: Great
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create skin_care table
CREATE TABLE IF NOT EXISTS skin_care (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    scalp BOOLEAN DEFAULT false,
    gua_sha BOOLEAN DEFAULT false,
    face_yoga BOOLEAN DEFAULT false,
    ems BOOLEAN DEFAULT false,
    skin_status TEXT,
    skin_care_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE daily_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies (including mock user bypass)
CREATE POLICY "Users can manage their own daily health" ON daily_health
    FOR ALL USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000');

CREATE POLICY "Users can manage their own skin care" ON skin_care
    FOR ALL USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000');

CREATE POLICY "Users can manage their own push subscriptions" ON push_subscriptions
    FOR ALL USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000000');
