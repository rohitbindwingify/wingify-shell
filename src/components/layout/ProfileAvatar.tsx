import { cn } from "@/lib/utils";

type ProfileAvatarSize = "sm" | "md" | "lg";

/** Initials + photo share the same footprint; ~2px above size-5 / 6 / 7. */
const SIZE: Record<ProfileAvatarSize, string> = {
  sm: "size-[22px]",
  md: "size-[26px]",
  lg: "size-[30px]",
};

const TEXT: Record<ProfileAvatarSize, string> = {
  sm: "text-[9px]",
  md: "text-[10px]",
  lg: "text-[11px]",
};

/**
 * Current-user mark. Uploaded photo when `src` is set; otherwise username
 * initials. Pass `onDark` inside the collapsed active pill.
 * Pass `showUnreadDot` for the green unread-notifications indicator.
 */
export default function ProfileAvatar({
  initials,
  src,
  size = "md",
  onDark = false,
  showUnreadDot = false,
  className,
}: {
  initials: string;
  /** Profile photo URL — omit / null / empty → initials monogram. */
  src?: string | null;
  size?: ProfileAvatarSize;
  onDark?: boolean;
  showUnreadDot?: boolean;
  className?: string;
}) {
  const hasPhoto = Boolean(src?.trim());

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        role="img"
        aria-label={initials}
        className={cn(
          "inline-flex items-center justify-center overflow-hidden rounded-full",
          SIZE[size],
          hasPhoto
            ? "ring-1 ring-inset ring-border"
            : onDark
              ? "bg-rail-active-foreground/15 font-medium text-rail-active-foreground"
              : "bg-muted font-medium text-foreground",
          !hasPhoto && TEXT[size]
        )}
      >
        {hasPhoto ? (
          <img src={src!} alt="" className="size-full object-cover" />
        ) : (
          <span aria-hidden className="leading-none tracking-tight">
            {initials}
          </span>
        )}
      </span>
      {showUnreadDot ? (
        <span
          className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[var(--status-running-fg)] ring-2 ring-panel"
          aria-hidden
        />
      ) : null}
    </span>
  );
}
