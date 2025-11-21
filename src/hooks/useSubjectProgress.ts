import { useState, useEffect } from 'react';
import supabase from '@/supabase/supabase_client';

interface SubjectProgress {
  id: string;
  name: string;
  progress: number;
}

export const useSubjectProgress = (userId: string | null) => {
  const [courses, setCourses] = useState<SubjectProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjectProgress = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Step 1: Get all subjects for the user
        const { data: subjects, error: subjectsError } = await supabase
          .from('subjects')
          .select('subject_id, subject_name')
          .eq('user_id', userId);

        if (subjectsError) throw subjectsError;

        if (!subjects || subjects.length === 0) {
          setCourses([]);
          setIsLoading(false);
          return;
        }

        // Step 2: Calculate progress for each subject
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison

        const coursesWithProgress = await Promise.all(
          subjects.map(async (subject) => {
            try {
              // Get all notes for this subject
              const { data: notes, error: notesError } = await supabase
                .from('notes_pages')
                .select('notes_id')
                .eq('subject_id', subject.subject_id);

              if (notesError) throw notesError;

              if (!notes || notes.length === 0) {
                return {
                  id: subject.subject_id,
                  name: subject.subject_name,
                  progress: 0,
                };
              }

              // Get all note IDs
              const noteIds = notes.map((note) => note.notes_id);

              // Get all questions for these notes
              const { data: questions, error: questionsError } = await supabase
                .from('questions')
                .select('question_id, next_appearance')
                .in('notes_id', noteIds);

              if (questionsError) throw questionsError;

              if (!questions || questions.length === 0) {
                return {
                  id: subject.subject_id,
                  name: subject.subject_name,
                  progress: 0,
                };
              }

              // Calculate progress
              let totalQuestions = 0;
              let pastDueQuestions = 0;

              questions.forEach((question) => {
                totalQuestions += 1;

                if (question.next_appearance) {
                  const dueDate = new Date(question.next_appearance);
                  dueDate.setHours(0, 0, 0, 0);
                  
                  // If due_date < today, it's past due (completed)
                  if (dueDate < today) {
                    pastDueQuestions += 1;
                  }
                }
              });

              // Calculate completion percentage
              const completionPercentage =
                totalQuestions > 0
                  ? Math.round((pastDueQuestions / totalQuestions) * 100)
                  : 0;

              return {
                id: subject.subject_id,
                name: subject.subject_name,
                progress: completionPercentage,
              };
            } catch (err) {
              console.error(`Error calculating progress for ${subject.subject_name}:`, err);
              return {
                id: subject.subject_id,
                name: subject.subject_name,
                progress: 0,
              };
            }
          })
        );

        setCourses(coursesWithProgress);
      } catch (err) {
        console.error('Error fetching subject progress:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectProgress();
  }, [userId]);

  return { courses, isLoading, error };
};