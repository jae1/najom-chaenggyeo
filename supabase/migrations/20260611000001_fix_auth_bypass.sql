-- Remove foreign key constraints temporarily for development bypass
ALTER TABLE daily_health DROP CONSTRAINT IF EXISTS daily_health_user_id_fkey;
ALTER TABLE skin_care DROP CONSTRAINT IF EXISTS skin_care_user_id_fkey;
ALTER TABLE push_subscriptions DROP CONSTRAINT IF EXISTS push_subscriptions_user_id_fkey;

-- Drop old policies
DROP POLICY IF EXISTS "Users can manage their own daily health" ON daily_health;
DROP POLICY IF EXISTS "Users can manage their own skin care" ON skin_care;
DROP POLICY IF EXISTS "Users can manage their own push subscriptions" ON push_subscriptions;

-- Create wide-open policies for the mock user
CREATE POLICY "Allow mock user all access" ON daily_health
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow mock user all access" ON skin_care
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow mock user all access" ON push_subscriptions
    FOR ALL USING (true) WITH CHECK (true);
