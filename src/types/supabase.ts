export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          subject_id: string;
          user_id: string;
          date_created: string;
          subject_name: string;
          start_time: string | null;
          start_minutes: string | null;
          start_period: "AM" | "PM" | null;
          end_time: string | null;
          end_minutes: string | null;
          end_period: "AM" | "PM" | null;
        };
        Insert: {
          subject_id?: string;
          user_id: string;
          date_created?: string;
          subject_name: string;
          start_time?: string | null;
          start_minutes?: string | null;
          start_period?: "AM" | "PM" | null;
          end_time?: string | null;
          end_minutes?: string | null;
          end_period?: "AM" | "PM" | null;
        };
        Update: {
          subject_id?: string;
          user_id?: string;
          date_created?: string;
          subject_name?: string;
          start_time?: string | null;
          start_minutes?: string | null;
          start_period?: "AM" | "PM" | null;
          end_time?: string | null;
          end_minutes?: string | null;
          end_period?: "AM" | "PM" | null;
        };
      };
      notes_pages: {
        Row: {
          notes_id: string;
          subject_id: string | null;
          notes_json: any | null;
          date_created: string;
          last_opened: string | null;
          last_closed: string | null;
        };
      };
      questions: {
        Row: {
          question_id: string;
          notes_id: string | null;
          question: string;
          answer: string | null;
          repetition: number | null;
          ease_factor: number | null;
          interval: number | null;
          next_appearance: string | null;
          quiz_question_instance: string | null;
        };
      };
      quizzes: {
        Row: {
          quiz_id: string;
          user_id: string | null;
          subject_id: string | null;
          completion_percentage: number | null;
          mastery: number | null;
          date: string;
        };
      };
      users: {
        Row: {
          user_id: string;
          email: string | null;
          name: string | null;
          quizzes_taken: number | null;
          created_at: string;
        };
      };
    };
  };
}

// Helper types for the frontend
export type SubjectRow = Database["public"]["Tables"]["subjects"]["Row"];
export type SubjectInsert = Database["public"]["Tables"]["subjects"]["Insert"];
export type SubjectUpdate = Database["public"]["Tables"]["subjects"]["Update"];