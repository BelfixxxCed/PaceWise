import { supabaseAdmin } from "@/supabase/supabase_admin";

/** Increment streak if today is a new day relative to last_active_date */
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

    const isNewDay =
      !lastActive ||
      lastActive.getUTCFullYear() !== now.getUTCFullYear() ||
      lastActive.getUTCMonth() !== now.getUTCMonth() ||
      lastActive.getUTCDate() !== now.getUTCDate();

    if (isNewDay) {
      await supabaseAdmin
        .from("users")
        .update({
          streak: (user.streak ?? 0) + 1,
          last_active_date: now.toISOString(),
        })
        .eq("user_id", userId);
    }
  } catch (err) {
    console.error("Error updating streak:", err);
  }
}
