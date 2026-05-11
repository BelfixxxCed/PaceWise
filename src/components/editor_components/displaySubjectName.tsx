"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import supabase from "@/supabase/supabase_client";

export function DisplaySubjectName({ subject_id, className }: { subject_id: string, className?: string }) {
  const [subjectName, set_subjectName] = useState("Loading...");

  const GET_subjectName = async (subject_id: string) => {
    const { data, error } = await supabase
      .from("subjects")
      .select("subject_name")
      .eq("subject_id", subject_id);

    if (error) {
      console.log(
        "There was an error in fetching subject names: ",
        error.message,
      );
      return;
    }

    set_subjectName(data[0].subject_name);
  };

  useEffect(() => {
    GET_subjectName(subject_id);
  }, [subject_id]);

  return (
    <div className={className || "poppins-extrabold text-[#8A8A8A] text-4xl"}>
      {subjectName}
    </div>
  );
}
