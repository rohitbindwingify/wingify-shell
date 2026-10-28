// @summary Media frame for a nav-intro tour step. Shows the upload at its
// natural aspect (full width, height from the image). Decorative; aria-hidden.
import type { NavIntroMedia } from "@/config/navIntro";
import { cn } from "@/lib/utils";

export default function NavIntroSchematic({
  media,
  className,
}: {
  media: NavIntroMedia;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-muted",
        className
      )}
    >
      <img
        key={media.src}
        src={media.src}
        alt=""
        className="block h-auto w-full animate-in fade-in duration-300 motion-reduce:animate-none"
      />
    </div>
  );
}
