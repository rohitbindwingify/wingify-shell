import { cn } from "@/lib/utils";
import avatarLight from "@/assets/icons/avatar-light.png";

type ProfileAvatarSize = "sm" | "md" | "lg";

/** Placeholder + photo share the same footprint; ~2px above size-5 / 6 / 7. */
const SIZE: Record<ProfileAvatarSize, string> = {
  sm: "size-[22px]",
  md: "size-[26px]",
  lg: "size-[30px]",
};

/**
 * Current-user mark. Uploaded photo when `src` is set; otherwise the
 * Avatar Light placeholder. Pass `onDark` inside the collapsed active pill.
 * Pass `showUnreadDot` for the green unread-notifications indicator.
 */
export default function ProfileAvatar({
  initials,
  src,
  size = "md",
  onDark: _onDark = false,
  showUnreadDot = false,
  className,
}: {
  /** Used for accessible label when no photo. */
  initials: string;
  /** Profile photo URL — omit / null / empty → placeholder icon. */
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
          hasPhoto && "ring-1 ring-inset ring-border"
        )}
      >
        <img
          src={hasPhoto ? src! : avatarLight}
          alt=""
          className="size-full object-cover"
        />
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
