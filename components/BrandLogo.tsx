import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  logoHeightClassName?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "",
  imageClassName = "",
  textClassName = "",
  logoHeightClassName = "h-8",
  priority = false,
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <Image
        src="/logo.png"
        alt="workenvo"
        width={2521}
        height={1427}
        priority={priority}
        className={`w-auto object-contain ${logoHeightClassName} ${imageClassName}`.trim()}
      />
      <span
        className={`text-[#16855B] lowercase leading-none ${textClassName}`.trim()}
        style={{ fontFamily: "var(--font-brand), var(--font-sans), sans-serif" }}
      >
        <span className="font-medium">work</span>
        <span className="font-bold">envo</span>
      </span>
    </div>
  );
}
