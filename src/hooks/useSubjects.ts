import { useState, useEffect } from "react";
import { getAllSubjects } from "@/components/schedule/schedule_supabase_query";
import supabase from "@/supabase/supabase_client";

type Subject = {
  subject_id: string;
  user_id: string;
  date_created: string;
  subject_name: string;
};

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: BroadcastChannel | null = null;

    async function fetchSubjects() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const data = await getAllSubjects(user.id);
        const mapped = data.map((s) => ({
          subject_id: s.subject_id,
          user_id: s.user_id,
          date_created: s.date_created ?? new Date().toISOString(),
          subject_name: s.subject_name,
        }));
        setSubjects(mapped);
        setLoading(false);
      } catch {
        console.error("Failed to fetch subjects");
        setLoading(false);
      }
    }

    fetchSubjects();

    try {
      channel = new BroadcastChannel("subjects");
      channel.onmessage = (ev) => {
        if (ev.data?.type === "created") {
          fetchSubjects();
        }
      };
    } catch {
      // BroadcastChannel not available
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  return { subjects, loading };
}
