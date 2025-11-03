interface WelcomeCardProps {
  userName?: string;
}

export const WelcomeCard = ({ userName = "Johnric" }: WelcomeCardProps) => {
  return (
    <div className="bg-primary text-white rounded-4xl p-8 shadow-brand">
      <h2 className="text-dashboard-subtitle mb-4">Hello, {userName}!</h2>
      <p className="text-dashboard-body leading-relaxed">
        Here is your progress for today. You are one step closer to mastering your notes
        and retaining knowledge more effectively! With PaceWise AI-powered learning
        system, your study sessions become smarter each day
      </p>
    </div>
  );
};
