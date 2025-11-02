import { Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Backend-friendly interface - matches your database structure
export interface Course {
  id?: string | number;  // Optional: database ID
  name: string;          // Course name/code from database
  progress: number;      // Progress percentage (0-100)
}

interface ProgressOverviewProps {
  courses: Course[];
  isLoading?: boolean;
}

export const ProgressOverview = ({ courses, isLoading = false }: ProgressOverviewProps) => {
  return (
  <div className="bg-white rounded-4xl p-10 border border-brand-green shadow-brand">
      <h3 className="text-dashboard-subtitle text-text-gray mb-6">Progress Overview</h3>
      
      {isLoading ? (
        <div className="text-dashboard-body text-text-gray text-center py-8">
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="text-dashboard-body text-text-gray text-center py-8">
          No courses found
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
            <span className="text-dashboard-body text-text-gray">Course Name</span>
            <span className="text-dashboard-body text-text-gray text-right">Status</span>
          </div>

          {courses.map((course, index) => (
            <div key={course.id || course.name || index} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-dashboard-body font-semibold">{course.name}</span>
                  <span className="text-dashboard-body font-semibold">{course.progress}%</span>
                </div>
              </div>
              {/* Progress bar aligned with course name */}
              <div className="flex items-center gap-3">
                <div className="w-10 shrink-0" /> {/* Spacer for icon width */}
                <Progress value={course.progress} className="h-2 flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
