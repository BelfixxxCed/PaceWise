import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type QuestionRow = {
  question_id: string;
  subject_id: string;
  question: string;
  answer: string;
  options: string[] | string | null;
  repetition: number | null;
  ease_factor: number | string | null;
  interval: number | null;
  next_appearance: string | null;
};

type NormalizedQuestion = Omit<QuestionRow, "options" | "ease_factor"> & {
  options: string[];
  ease_factor: number;
  subject_name?: string;
};

async function getUserId(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token)
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
  return { userId: data.user.id };
}

function normalizeQuestion(row: any): NormalizedQuestion {
  const opts = Array.isArray(row.options)
    ? row.options
    : typeof row.options === "string"
    ? safeParseArray(row.options)
    : [];

  const efNum =
    typeof row.ease_factor === "number"
      ? row.ease_factor
      : typeof row.ease_factor === "string"
      ? Number(row.ease_factor)
      : 2.5;

  return {
    question_id: row.question_id,
    subject_id: row.subject_id,
    question: row.question,
    answer: row.answer,
    options: opts,
    repetition: Number(row.repetition ?? 0),
    ease_factor: Number.isFinite(efNum) ? efNum : 2.5,
    interval: Number(row.interval ?? 1),
    next_appearance: row.next_appearance ?? null,
    subject_name: row.subjects?.subject_name,
  };
}

function safeParseArray(s: string): string[] {
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subject_id");
  const limitParam = searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam || "10"), 1), 100);
  const nowIso = new Date().toISOString();

  const auth = await getUserId(req);
  if ("error" in auth) return auth.error;
  const { userId } = auth;

  let query = supabaseAdmin
    .from("questions")
    .select(
      `
      question_id,
      subject_id,
      question,
      answer,
      options,
      repetition,
      ease_factor,
      interval,
      next_appearance,
      subjects!inner(user_id, subject_name)
    `
    )
    .eq("subjects.user_id", userId)
    .lte("next_appearance", nowIso)
    .order("next_appearance", { ascending: true })
    .limit(limit);

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
  }

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const normalized = (data ?? []).map(normalizeQuestion);

  return NextResponse.json(
    {
      data: normalized,
      subject_name: normalized[0]?.subject_name ?? null,
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  const auth = await getUserId(req);
  if ("error" in auth) return auth.error;
  const { userId } = auth;

  let body: { question_id?: string; isCorrect?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { question_id, isCorrect } = body;
  if (!question_id || typeof isCorrect !== "boolean") {
    return NextResponse.json(
      { error: "question_id and isCorrect are required" },
      { status: 400 }
    );
  }

  const { data: card, error: fetchErr } = await supabaseAdmin
    .from("questions")
    .select(
      `
      question_id,
      repetition,
      interval,
      ease_factor,
      subjects!inner(user_id)
    `
    )
    .eq("subjects.user_id", userId)
    .eq("question_id", question_id)
    .maybeSingle();

  if (fetchErr)
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!card)
    return NextResponse.json(
      { error: "Question not found or access denied" },
      { status: 404 }
    );

  let repetition = Number(card.repetition ?? 0);
  let interval = Number(card.interval ?? 1);
  let EF =
    typeof card.ease_factor === "number"
      ? card.ease_factor
      : Number(card.ease_factor ?? 2.5);
  if (!Number.isFinite(EF)) EF = 2.5;

  if (isCorrect) {
    repetition += 1;
    if (repetition === 1) interval = 1;
    else if (repetition === 2) interval = 6;
    else interval = Math.max(1, Math.round(interval * EF));
    EF = Math.min(EF + 0.05, 2.6);
  } else {
    repetition = 0;
    interval = 1;
    EF = Math.max(EF - 0.2, 1.3);
  }

  const nextAppearance = new Date();
  nextAppearance.setDate(nextAppearance.getDate() + interval);

  const { error: updateErr } = await supabaseAdmin
    .from("questions")
    .update({
      repetition,
      interval,
      ease_factor: EF,
      next_appearance: nextAppearance.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("question_id", question_id);

  if (updateErr)
    return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json(
    {
      ok: true,
      repetition,
      interval,
      ease_factor: EF,
      next_appearance: nextAppearance.toISOString(),
    },
    { status: 200 }
  );
}
