import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserId(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
  return { userId: data.user.id };
}

export async function POST(req: Request) {
  const auth = await getUserId(req);
  if ("error" in auth) return auth.error;
  const { userId } = auth;

  let body: { subject_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { subject_id } = body;
  if (!subject_id) {
    return NextResponse.json({ error: "subject_id required" }, { status: 400 });
  }

  const { data: subject, error: subjectErr } = await supabaseAdmin
    .from("subjects")
    .select("subject_id")
    .eq("subject_id", subject_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (subjectErr || !subject) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }

  const { data: quiz, error: quizErr } = await supabaseAdmin
    .from("quizzes")
    .insert([{
      user_id: userId,
      subject_id: subject_id,
      date: new Date().toISOString(),
      completion_percentage: 0,
      mastery: 0,
    }])
    .select()
    .single();

  if (quizErr) {
    return NextResponse.json({ error: quizErr.message }, { status: 500 });
  }

  return NextResponse.json({ quiz_id: quiz.quiz_id }, { status: 200 });
}