"use client";

import { useEffect, useState } from "react";
import supabase from "@/supabase/supabase_client";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { TimeStudiedCard } from "@/components/dashboard/TimeStudiedCard";
import { PracticeQuizzesCard } from "@/components/dashboard/PracticeQuizzesCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { useSubjectProgress } from "@/hooks/useSubjectProgress";

const Index = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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

  // Fetch subject progress using the custom hook
  const { courses, isLoading: isProgressLoading, error } = useSubjectProgress(userId);

  // TODO: Replace with actual backend data for time studied
  const timeStudied = { hours: 1, minutes: 30 };
  
  // TODO: Replace with actual backend data for available quizzes
  const availableQuizzes = 5;
  
  // TODO: Replace with actual backend data for last viewed course
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
              <TimeStudiedCard hours={timeStudied.hours} minutes={timeStudied.minutes} />
              <PracticeQuizzesCard availableQuizzes={availableQuizzes} />
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