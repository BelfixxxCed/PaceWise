import AvatarSection from "../landing/avatarSection";
import ContentCard from "./contentCard";

export default function DesktopLayout() {
  return (
    <div className="flex items-center justify-between gap-6 mr-20">
      <div className="flex-1 items-center w-1/2 flex ">
        <ContentCard variant="desktop" />
      </div>
      <AvatarSection variant="signin" className="flex-shrink-0 w-1/2 flex" />
    </div>
  );
}
