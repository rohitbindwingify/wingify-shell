/**
 * Shell user-sound marks for Pulse rail — outline (idle) + fill (selected).
 * Paths from VWO sprite `icon--user-sound` / `icon--user-sound-fill` (256 viewBox).
 */
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type ShellIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

/** Unselected — `icon--user-sound`. */
export function ShellUserSoundIcon({
  className,
  size = 16,
  strokeWidth: _strokeWidth,
  ...props
}: ShellIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
      {...props}
    >
      <circle
        cx="108"
        cy="108"
        r="60"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M24,208c20.55-24.45,49.56-40,84-40s63.45,15.55,84,40"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M200,68.74a100.33,100.33,0,0,1,0,78.52"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M229.36,56a132.39,132.39,0,0,1,0,104"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}

/** Selected — `icon--user-sound-fill`. */
export function ShellUserSoundFillIcon({
  className,
  size = 16,
  strokeWidth: _strokeWidth,
  ...props
}: ShellIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
      {...props}
    >
      <path d="M198.13,202.85A8,8,0,0,1,192,216H24a8,8,0,0,1-6.12-13.15c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,172.44,183.18,185.07,198.13,202.85ZM196.86,61.39a8,8,0,0,0-4.22,10.5,92.26,92.26,0,0,1,0,72.22,8,8,0,1,0,14.72,6.29,108.36,108.36,0,0,0,0-84.8A8,8,0,0,0,196.86,61.39Zm39.85-8.54a8,8,0,1,0-14.7,6.3,124.43,124.43,0,0,1,0,97.7,8,8,0,1,0,14.7,6.3,140.34,140.34,0,0,0,0-110.3Z" />
    </svg>
  );
}
