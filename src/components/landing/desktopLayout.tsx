import AvatarSection from "./avatarSection";
import ContentCard from "./contentCard";

export default function DesktopLayout() {
  return (
    <div className="flex items-center justify-between gap-6 mr-25">
      <AvatarSection variant="landing" className="flex-shrink-0 w-1/2 pt-10" />
      <div className="flex-1 mb-40 items-center mr-10 w-1/2 flex ">
        <ContentCard variant="desktop" />
      </div>
    </div>
  );
}
