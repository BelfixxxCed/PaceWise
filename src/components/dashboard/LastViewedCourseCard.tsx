// Location: src/components/dashboard/LastViewedCourseCard.tsx

import { useRouter } from 'next/navigation';

interface LastViewedCourseCardProps {
  subjectName: string;
  subjectId: string | null;
  isLoading?: boolean;
}

export const LastViewedCourseCard = ({ 
  subjectName,
  subjectId,
  isLoading = false
}: LastViewedCourseCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (isLoading) return;
    
    // If no subject ID (user has no notes), redirect to schedule page to add subject
    if (!subjectId) {
      router.push('/main/schedule#:~:text=%3A00%20AM-,Add%20Subject,-from');
      return;
    }

    // Redirect to the notes page with the subject_id
    router.push(`/main/notes/notes_with_content?subject_id=${subjectId}`);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className="w-full bg-primary text-white rounded-4xl p-8 shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="text-center">
        <h3 className="text-dashboard-subtitle mb-2">
          {isLoading ? (
            'Loading...'
          ) : subjectId ? (
            <>
              <span className="font-bold">Last Viewed Note:</span>{' '}
              <span className="font-normal">{subjectName}</span>
            </>
          ) : (
            <span className="font-bold">Last Viewed Note</span>
          )}
        </h3>
        <p className="text-dashboard-body opacity-90 italic">
          {isLoading 
            ? 'Loading your last note...' 
            : subjectId 
              ? 'Tap to view your last note' 
              : 'Tap to add subject to create a note'
          }
        </p>
      </div>
    </button>
  );
};