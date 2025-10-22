import Image from "next/image";

interface AvatarSectionProps {
  className?: string;
  variant?: "landing" | "signin";
}

export default function AvatarSection({
  className,
  variant = "landing",
}: AvatarSectionProps) {
  const isLanding = variant === "landing";

  return (
    <div className={className}>
      <Image
        src={isLanding ? "/welcome-avatar.png" : "/signin-avatar.png"}
        alt="PaceWise mascot"
        width={500}
        height={600}
        className="w-full max-h-[650px] object-contain"
        priority
      />
    </div>
  );
}
