import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabase/supabase_admin";

export async function getUserId(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  return { userId: data.user.id };
}
