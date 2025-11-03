import Image from "next/image";

interface PracticeQuizzesCardProps {
  availableQuizzes: number;
}

export const PracticeQuizzesCard = ({ availableQuizzes }: PracticeQuizzesCardProps) => {
  return (
  <div className="bg-white rounded-4xl p-6 border border-brand-green shadow-brand">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full flex items-center justify-center">
            <Image
              src="/reusable_ui_images/Alarm.svg"
              alt="Alert icon"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
      
        </div>
        <div>
          <p className="text-dashboard-subtitle mb-1">Practice Quizzes</p>
          <p className="text-dashboard-body text-text-gray">
            {availableQuizzes} new quizzes available
          </p>
        </div>
      </div>
    </div>
  );
};
