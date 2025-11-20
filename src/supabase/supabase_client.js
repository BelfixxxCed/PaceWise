// Location: src/supabase/supabase_client.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client (no TypeScript generics)
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

// CRUD helper functions for subjects
export const subjectsApi = {
  // Get all subjects for a user
  async getAll(userId) {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", userId)
      .order("date_created", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single subject by ID
  async getById(subjectId) {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("subject_id", subjectId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new subject
  async create(subject) {
    const { data, error } = await supabase
      .from("subjects")
      .insert([subject])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a subject
  async update(subjectId, updates) {
    const { data, error } = await supabase
      .from("subjects")
      .update(updates)
      .eq("subject_id", subjectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a subject
  async delete(subjectId) {
    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("subject_id", subjectId);

    if (error) throw error;
    return true;
  },

  // Search subjects by name
  async search(userId, searchTerm) {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", userId)
      .ilike("subject_name", `%${searchTerm}%`)
      .order("date_created", { ascending: false });

    if (error) throw error;
    return data;
  },
};
