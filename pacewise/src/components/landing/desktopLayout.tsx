import AvatarSection from "./avatarSection";
import ContentCard from "./contentCard";

export default function DesktopLayout() {
  return (
    <div className="flex items-center justify-between gap-16">
      <AvatarSection className="pt-5.5 flex-shrink-0 w-6/13" />
      <div className="flex-1 mb-40">
        <ContentCard variant="desktop" />
      </div>
    </div>
  );
}
