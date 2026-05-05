import { supabaseAdmin } from "@/supabase/supabase_admin";

/** Increment streak if today is a new day relative to last_active_date. Resets to 1 if more than 1 day has passed. */
export async function maybeIncrementStreak(userId: string) {
  try {
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("streak, last_active_date")
      .eq("user_id", userId)
      .single();

    if (!user) return;

    const now = new Date();
    const lastActive = user.last_active_date ? new Date(user.last_active_date) : null;

    const nowDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const lastActiveDay = lastActive
      ? Date.UTC(lastActive.getUTCFullYear(), lastActive.getUTCMonth(), lastActive.getUTCDate())
      : null;

    const DAY_IN_MS = 24 * 60 * 60 * 1000;

    let newStreak = user.streak ?? 0;
    let shouldUpdate = false;

    if (!lastActiveDay) {
      newStreak = 1;
      shouldUpdate = true;
    } else {
      const diffDays = Math.floor((nowDay - lastActiveDay) / DAY_IN_MS);
      if (diffDays === 1) {
        newStreak += 1;
        shouldUpdate = true;
      } else if (diffDays > 1) {
        newStreak = 1;
        shouldUpdate = true;
      } else {
        // diffDays === 0, same day, do nothing
        shouldUpdate = false;
      }
    }

    if (shouldUpdate) {
      await supabaseAdmin
        .from("users")
        .update({
          streak: newStreak,
          last_active_date: now.toISOString(),
        })
        .eq("user_id", userId);
    }
  } catch (err) {
    console.error("Error updating streak:", err);
  }
}
