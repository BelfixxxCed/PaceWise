import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface SubjectCardProps {
  subjectId: string;
  subjectName: string;
  dateCreated: string;
  onClick: (subjectId: string) => void;
}

export function SubjectCard({
  subjectId,
  subjectName,
  dateCreated,
  onClick,
}: SubjectCardProps) {
  return (
    <button
      onClick={() => onClick(subjectId)}
      className="group text-left hover:shadow-xl rounded-3xl transition-all duration-200 w-full max-w-[310px] bg-transparent hover:bg-gray-50"
    >
      <div className="border-2 border-[#71D285] rounded-3xl overflow-hidden bg-transparent hover:bg-gray-50 transition-colors">
        <div className="h-12 bg-[#71D285] flex items-center justify-end px-4" />
        <div className="p-6 bg-transparent">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <Image
                height={25}
                width={25}
                src="/reusable_ui_images/note_logo.svg"
                alt="Note icon"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#3E6E48]">
                {subjectName}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {formatDate(dateCreated)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
