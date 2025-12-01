// Location: src/components/schedule/schedule_supabase_query.tsx
// This file handles all Supabase queries for the schedule feature

import supabase from "@/supabase/supabase_client";

export interface DBSubject {
  subject_id: string;
  user_id: string;
  subject_name: string;
  start_time: string | null;
  start_minutes: string | null;
  start_period: "AM" | "PM" | null;
  end_time: string | null;
  end_minutes: string | null;
  end_period: "AM" | "PM" | null;
  date_created?: string;
}

export interface ComponentSubject {
  id: string;
  title: string;
  startTime: string;
  startMinutes: string;
  startPeriod: "AM" | "PM";
  endTime: string;
  endMinutes: string;
  endPeriod: "AM" | "PM";
}

export interface NewSubjectInput {
  title: string;
  startTime: string;
  startMinutes: string;
  startPeriod: "AM" | "PM";
  endTime: string;
  endMinutes: string;
  endPeriod: "AM" | "PM";
}

// ----------------------
// Supabase Queries
// ----------------------

/**
 * Get all subjects for a specific user
 */
export async function getAllSubjects(userId: string): Promise<DBSubject[]> {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("user_id", userId)
    .order("date_created", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Get a single subject by ID
 */
export async function getSubjectById(subjectId: string): Promise<DBSubject> {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("subject_id", subjectId)
    .single();

  if (error) throw error;
  return data as DBSubject;
}

/**
 * Create a new subject
 */
export async function createSubject(
  subject: Partial<DBSubject>
): Promise<DBSubject> {
  const { data, error } = await supabase
    .from("subjects")
    .insert([subject])
    .select()
    .single();

  if (error) throw error;
  return data as DBSubject;
}

/**
 * Update an existing subject
 */
export async function updateSubject(
  subjectId: string,
  updates: Partial<DBSubject>
): Promise<DBSubject> {
  const { data, error } = await supabase
    .from("subjects")
    .update(updates)
    .eq("subject_id", subjectId)
    .select()
    .single();

  if (error) throw error;
  return data as DBSubject;
}

/**
 * Delete a subject
 */
export async function deleteSubject(subjectId: string): Promise<boolean> {
  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("subject_id", subjectId);

  if (error) throw error;
  return true;
}

/**
 * Search subjects by name for a specific user
 */
export async function searchSubjects(
  userId: string,
  searchTerm: string
): Promise<DBSubject[]> {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("user_id", userId)
    .ilike("subject_name", `%${searchTerm}%`)
    .order("date_created", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ----------------------
// Transform Functions
// ----------------------

/**
 * Transform database subject to component format
 */
export function transformSubjectFromDB(dbSubject: DBSubject): ComponentSubject {
  return {
    id: dbSubject.subject_id,
    title: dbSubject.subject_name,
    startTime: dbSubject.start_time || "01",
    startMinutes: dbSubject.start_minutes || "00",
    startPeriod: dbSubject.start_period || "PM",
    endTime: dbSubject.end_time || "02",
    endMinutes: dbSubject.end_minutes || "00",
    endPeriod: dbSubject.end_period || "PM",
  };
}

/**
 * Transform component subject to database format
 */
export function transformSubjectToDB(
  componentSubject: NewSubjectInput,
  userId: string
): Partial<DBSubject> {
  return {
    user_id: userId,
    subject_name: componentSubject.title,
    start_time: componentSubject.startTime,
    start_minutes: componentSubject.startMinutes,
    start_period: componentSubject.startPeriod,
    end_time: componentSubject.endTime,
    end_minutes: componentSubject.endMinutes,
    end_period: componentSubject.endPeriod,
  };
}