import Image from "next/image";

interface AvatarSectionProps {
  className?: string;
}

export default function AvatarSection({ className }: AvatarSectionProps) {
  return (
    <div className={className}>
      <Image
        src="/welcome-avatar.png"
        alt="PaceWise mascot"
        width={500}
        height={600}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}
