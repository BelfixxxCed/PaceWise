import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    console.error("Authentication error:", authError);
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  return { userId: userData.user.id };
}

import { maybeIncrementStreak } from "@/lib/streak";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ error: "Missing request body" }, { status: 400 });
    }

    let body: { subject_id?: string | null; notes_id?: string | null; notes_json?: unknown };
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { subject_id = null, notes_id = null, notes_json = null } = body;
    if (!notes_json) {
      return NextResponse.json({ error: "Missing notes_json" }, { status: 400 });
    }

    const authResult = await authenticateRequest(req);
    if ("error" in authResult) return authResult.error;
    const { userId } = authResult;

    const now = new Date().toISOString();

    // Update an existing specific note by notes_id
    if (notes_id) {
      const { data, error } = await supabaseAdmin
        .from("notes_pages")
        .update({ notes_json, updated_at: now })
        .eq("notes_id", notes_id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      await maybeIncrementStreak(userId);
      return NextResponse.json({ message: "Updated", data }, { status: 200 });
    }

    // Create a new note for a subject
    if (subject_id) {
      const { data, error } = await supabaseAdmin
        .from("notes_pages")
        .insert([{ subject_id, notes_json, user_id: userId, updated_at: now }])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      await maybeIncrementStreak(userId);
      return NextResponse.json({ message: "Saved", data }, { status: 200 });
    }

    return NextResponse.json({ error: "Provide either notes_id or subject_id" }, { status: 400 });
  } catch (err) {
    console.error("API error saving notes:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const notes_id = searchParams.get("notes_id");
    const subject_id = searchParams.get("subject_id");

    const authResult = await authenticateRequest(req);
    if ("error" in authResult) return authResult.error;
    const { userId } = authResult;

    // Fetch a single note by notes_id
    if (notes_id) {
      const { data, error } = await supabaseAdmin
        .from("notes_pages")
        .select("*")
        .eq("notes_id", notes_id)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Supabase fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data: data ?? null }, { status: 200 });
    }

    // Fetch all notes for a subject (multiple pages support)
    if (subject_id) {
      const { data, error } = await supabaseAdmin
        .from("notes_pages")
        .select("*")
        .eq("user_id", userId)
        .eq("subject_id", subject_id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data: data ?? [] }, { status: 200 });
    }

    return NextResponse.json({ error: "Provide either notes_id or subject_id" }, { status: 400 });
  } catch (err) {
    console.error("API error fetching notes:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const notes_id = searchParams.get("notes_id");

    if (!notes_id) {
      return NextResponse.json({ error: "Missing notes_id" }, { status: 400 });
    }

    const authResult = await authenticateRequest(req);
    if ("error" in authResult) return authResult.error;
    const { userId } = authResult;

    const { error } = await supabaseAdmin
      .from("notes_pages")
      .delete()
      .eq("notes_id", notes_id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error("API error deleting note:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
