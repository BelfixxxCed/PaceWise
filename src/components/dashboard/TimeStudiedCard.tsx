import Image from "next/image";

interface TimeStudiedCardProps {
  hours: number;
  minutes: number;
  isLoading?: boolean;
}

export const TimeStudiedCard = ({ hours, minutes, isLoading = false }: TimeStudiedCardProps) => {
  return (
    <div className="bg-white rounded-4xl p-6 border border-brand-green shadow-brand">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center">
          <Image
            src="/reusable_ui_images/clock.svg"
            alt="Clock icon"
            width={70}
            height={70}
            className="w-14 h-14 object-contain"
          />
        </div>
        <div>
          <p className="text-dashboard-body text-text-gray mb-1">Time studied</p>
          {isLoading ? (
            <p className="text-dashboard-subtitle text-text-gray">Loading...</p>
          ) : (
            <p className="text-dashboard-subtitle">
              {hours}hr & {minutes} min{minutes !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};