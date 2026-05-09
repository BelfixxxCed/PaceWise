import { NextResponse } from "next/server";

// QUIZ FEATURE DISABLED
/*
import { getUserId } from "@/lib/auth";
import { supabaseAdmin } from "@/supabase/supabase_admin";

function safeParseArray(s: string): string[] { ... }

export async function GET(req: Request) {
  // ... full implementation commented out
  // fetches latest quiz, quiz results, and question details for a subject
}
*/

export async function GET() {
  return NextResponse.json({ error: "Quiz feature is disabled" }, { status: 503 });
}
