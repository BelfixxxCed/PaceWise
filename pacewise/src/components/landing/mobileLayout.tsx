import AvatarSection from "./avatarSection";
import ContentCard from "./contentCard";

export default function MobileLayout() {
  return (
    <div className="flex flex-col items-center gap-8">
      <AvatarSection className="w-full max-w-sm" />
      <div className="w-full px-4">
        <ContentCard variant="mobile" />
      </div>
    </div>
  );
}
