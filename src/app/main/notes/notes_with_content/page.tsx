import React from "react";
import Notes_component from "./../../../../components/editor_components/editor";

// app/main/notes/notes_with_content/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ subject_id?: string }>;
}) {
  const params = await searchParams;
  const subjectId = params?.subject_id ?? "none";

  return (
    <div className="m-2 border-2 p-5 rounded-4xl my-5 mx-35 border-[#71D285]">
      <input
        placeholder="Page Title"
        className="mb-5 poppins-extrabold text-4xl border-0 text-[#8A8A8A]"
      />
      <div>
        <Notes_component subjectId={subjectId} />
      </div>
    </div>
  );
}
