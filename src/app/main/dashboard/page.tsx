// DashboardSidebar and DashboardHeader removed - content now flows full width
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { ProgressOverview, Course } from "@/components/dashboard/ProgressOverview";
import { TimeStudiedCard } from "@/components/dashboard/TimeStudiedCard";
import { PracticeQuizzesCard } from "@/components/dashboard/PracticeQuizzesCard";
import { CourseCard } from "@/components/dashboard/CourseCard";

const Index = () => {
  // TODO: Replace with actual backend data fetch
  // Example: const { data: courses, isLoading } = useQuery(['courses'], fetchCourses);
  const courses: Course[] = [
    { id: 1, name: "Amat 132", progress: 83 },
    { id: 2, name: "Cmsc 128", progress: 43 },
    { id: 3, name: "Mgt 101", progress: 92 },
    { id: 4, name: "Ethics", progress: 80 },
  ];

  // TODO: Replace with actual backend data
  const timeStudied = { hours: 1, minutes: 30 };
  const availableQuizzes = 5;
  const lastViewedCourse = {
    code: "Amat 132",
    name: "Intro to Statistics",
    lastNote: "Tap to view your last note"
  };

  return (
    <div className="min-h-screen bg-background">
    <div>
      {/* Header removed - keep page title inside main content if needed */}
        
        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1400px] ml-12">
            {/* Left column - Main content */}
            <div className="lg:col-span-2 space-y-6">
              <WelcomeCard userName="Johnric" />
              <ProgressOverview courses={courses} />
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
