import { BookOpen } from "lucide-react";

interface PracticeQuizzesCardProps {
  availableQuizzes: number;
  isLoading?: boolean;
}

export const PracticeQuizzesCard = ({ 
  availableQuizzes, 
  isLoading = false 
}: PracticeQuizzesCardProps) => {
  return (
    <div className="bg-white rounded-4xl p-6 border border-brand-green shadow-brand">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-dashboard-subtitle text-text-gray mb-2">
            Practice Quizzes
          </h3>
          {isLoading ? (
            <p className="text-dashboard-body text-text-gray">Loading...</p>
          ) : (
            <>
              <p className="text-dashboard-heading mb-1">
                <span className="font-bold">{availableQuizzes}</span>{' '}
                {availableQuizzes === 1 ? 'quiz' : 'quizzes'} available
              </p>
    
            </>
          )}
        </div>
      </div>
    </div>
  );
};