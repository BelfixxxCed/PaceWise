import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { maybeIncrementStreak } from "@/lib/streak";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function authenticateRequest(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return {
      error: NextResponse.json({ error: "Missing auth token" }, { status: 401 }),
    };
  }

  const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);

  if (authError || !userData?.user) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  return { userId: userData.user.id };
}

export async function POST(req: Request) {
  try {
    const authResult = await authenticateRequest(req);
    if ("error" in authResult) return authResult.error;
    const { userId } = authResult;

    await maybeIncrementStreak(userId);
    
    return NextResponse.json({ message: "Streak updated" }, { status: 200 });
  } catch (err) {
    console.error("API error updating streak:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
