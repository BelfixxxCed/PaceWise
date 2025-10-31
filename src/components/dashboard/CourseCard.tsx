interface CourseCardProps {
  courseName: string;
  courseCode: string;
  subtitle: string;
}

export const CourseCard = ({ 
  courseName,
  courseCode,
  subtitle
}: CourseCardProps) => {
  return (
    <div className="bg-primary text-white rounded-4xl p-8 shadow-brand cursor-pointer hover:opacity-90 transition-opacity">
      <h3 className="text-dashboard-subtitle mb-2 text-center">
        {courseCode}: {courseName}
      </h3>
      <p className="text-dashboard-body text-center opacity-90 italic">
        {subtitle}
      </p>
    </div>
  );
};
