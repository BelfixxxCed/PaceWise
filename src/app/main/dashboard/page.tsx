"use client";

import { useEffect, useState } from "react";
import supabase from "@/supabase/supabase_client";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { ProgressOverview, Course } from "@/components/dashboard/ProgressOverview";
import { TimeStudiedCard } from "@/components/dashboard/TimeStudiedCard";
import { PracticeQuizzesCard } from "@/components/dashboard/PracticeQuizzesCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { getSubjectsProgress } from "@/lib/subjectsProgress";
import { getAvailableQuizzesCount } from "@/lib/practiceQuizzes";
import { initTimeTracking, getCurrentTimeStudied } from "@/lib/timeTracker";

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

  // Fetch user authentication and info
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          // Fetch user details from users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('name')
            .eq('user_id', user.id)
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
    // Initialize tracking and get cleanup function
    const cleanup = initTimeTracking();

    // Update display every second for smooth counting
    const displayInterval = setInterval(() => {
      const { hours, minutes } = getCurrentTimeStudied();
      setTimeStudied({ hours, minutes });
    }, 1000);

    // Cleanup on unmount
    return () => {
      cleanup();
      clearInterval(displayInterval);
    };
  }, []);

  // Fetch subject progress when userId is available
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;

      try {
        setIsProgressLoading(true);
        setError(null);
        
        const subjectsData = await getSubjectsProgress(userId);
        
        // Transform to Course interface
        const transformedCourses: Course[] = subjectsData.map(subject => ({
          id: subject.id,
          name: subject.name,
          progress: subject.progress
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

  // Fetch available quizzes count when userId is available
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

  // Last viewed course - use first course if available
  const lastViewedCourse = {
    code: courses.length > 0 ? courses[0].name : "No Courses",
    name: "Last Viewed Course",
    lastNote: "Tap to view your last note"
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-dashboard-body text-text-gray">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div>
        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1400px] ml-12">
            {/* Left column - Main content */}
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
            
            {/* Right column - Stats and cards */}
            <div className="space-y-6">
              <TimeStudiedCard 
                hours={timeStudied.hours} 
                minutes={timeStudied.minutes}
              />
              <PracticeQuizzesCard 
                availableQuizzes={availableQuizzes}
                isLoading={isQuizzesLoading}
              />
              <CourseCard 
                courseCode={lastViewedCourse.code}
                courseName={lastViewedCourse.name}
                subtitle={lastViewedCourse.lastNote}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;