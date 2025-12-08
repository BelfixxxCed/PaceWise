"use client";

import { useEffect, useState } from "react";
import supabase from "@/supabase/supabase_client";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { ProgressOverview, Course } from "@/components/dashboard/ProgressOverview";
import { TimeStudiedCard } from "@/components/dashboard/TimeStudiedCard";
import { PracticeQuizzesCard } from "@/components/dashboard/PracticeQuizzesCard";
import { LastViewedCourseCard } from "@/components/dashboard/LastViewedCourseCard";
import { getSubjectsProgress } from "@/lib/subjectsProgress";
import { getAvailableQuizzesCount } from "@/lib/practiceQuizzes";
import { initTimeTracking, getCurrentTimeStudied } from "@/lib/timeTracker";
import { getLastViewedNote } from "@/lib/getLastViewedNote";

const Index = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [courses, setCourses] = useState<Course[]>([]);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableQuizzes, setAvailableQuizzes] = useState<number>(0);
  const [isQuizzesLoading, setIsQuizzesLoading] = useState(false);

  const [timeStudied, setTimeStudied] = useState({ hours: 0, minutes: 0 });

  // 🔥 Your last-viewed subject feature
  const [lastViewedSubject, setLastViewedSubject] = useState<string>("Last Viewed Course");
  const [lastViewedSubjectId, setLastViewedSubjectId] = useState<string | null>(null);
  const [isLastViewedLoading, setIsLastViewedLoading] = useState(true);

  // Fetch user authentication and info
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);

          const { data: userData, error } = await supabase
            .from("users")
            .select("name")
            .eq("user_id", user.id)
            .single();

          if (userData && !error) {
            setUserName(userData.name || "User");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    getUser();
  }, []);

  // Initialize time tracking
  useEffect(() => {
    const cleanup = initTimeTracking();

    const displayInterval = setInterval(() => {
      const { hours, minutes } = getCurrentTimeStudied();
      setTimeStudied({ hours, minutes });
    }, 1000);

    return () => {
      cleanup();
      clearInterval(displayInterval);
    };
  }, []);

  // Fetch subject progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;

      try {
        setIsProgressLoading(true);
        setError(null);

        const subjectsData = await getSubjectsProgress();

        const transformedCourses: Course[] = subjectsData.map((subject) => ({
          id: subject.id,
          name: subject.name,
          progress: subject.progress,
        }));

        setCourses(transformedCourses);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setIsProgressLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!userId) return;

      try {
        setIsQuizzesLoading(true);
        const count = await getAvailableQuizzesCount(userId);
        setAvailableQuizzes(count);
      } catch (err) {
        console.error("Error fetching available quizzes:", err);
      } finally {
        setIsQuizzesLoading(false);
      }
    };

    fetchQuizzes();
  }, [userId]);

  // 🔥 Fetch last viewed subject
  useEffect(() => {
    const fetchLastViewed = async () => {
      if (!userId) return;

      try {
        setIsLastViewedLoading(true);
        const lastNote = await getLastViewedNote(userId);

        if (lastNote) {
          setLastViewedSubject(lastNote.subject_name);
          setLastViewedSubjectId(lastNote.subject_id);
        } else {
          setLastViewedSubject("Last Viewed Course");
          setLastViewedSubjectId(null);
        }
      } catch (err) {
        console.error("Error fetching last viewed note:", err);
        setLastViewedSubject("Last Viewed Course");
        setLastViewedSubjectId(null);
      } finally {
        setIsLastViewedLoading(false);
      }
    };

    fetchLastViewed();
  }, [userId]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-dashboard-body text-text-gray">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1400px] ml-12">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <WelcomeCard userName={userName} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                Error loading courses: {error}
              </div>
            )}

            <ProgressOverview
              courses={courses}
              isLoading={isProgressLoading}
            />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <TimeStudiedCard
              hours={timeStudied.hours}
              minutes={timeStudied.minutes}
            />

            <PracticeQuizzesCard
              availableQuizzes={availableQuizzes}
              isLoading={isQuizzesLoading}
            />

            <LastViewedCourseCard
              subjectName={lastViewedSubject}
              subjectId={lastViewedSubjectId}
              isLoading={isLastViewedLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
