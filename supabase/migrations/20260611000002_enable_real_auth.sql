-- Revert to strict RLS policies for production use
-- Remove the 'Allow mock user all access' policies
DROP POLICY IF EXISTS "Allow mock user all access" ON daily_health;
DROP POLICY IF EXISTS "Allow mock user all access" ON skin_care;
DROP POLICY IF EXISTS "Allow mock user all access" ON push_subscriptions;

-- Delete mock user data to satisfy foreign key constraints
DELETE FROM daily_health WHERE user_id = '00000000-0000-0000-0000-000000000000';
DELETE FROM skin_care WHERE user_id = '00000000-0000-0000-0000-000000000000';
DELETE FROM push_subscriptions WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Re-enable foreign key constraints
ALTER TABLE daily_health ADD CONSTRAINT daily_health_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE skin_care ADD CONSTRAINT skin_care_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE push_subscriptions ADD CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Re-create strict policies
CREATE POLICY "Users can manage their own daily health" ON daily_health
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skin care" ON skin_care
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own push subscriptions" ON push_subscriptions
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
