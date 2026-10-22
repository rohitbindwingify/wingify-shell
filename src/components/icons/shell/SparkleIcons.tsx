/**
 * Shell sparkle marks for Wingz rail — outline (idle) + fill (selected).
 * Paths from VWO sprite `icon--sparkle` / `icon--sparkle-fill`.
 */
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type ShellIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

/** Unselected — `icon--sparkle`. */
export function ShellSparkleIcon({
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
      <path
        d="M84.27,171.73l-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3a7.92,7.92,0,0,1,0,14.86l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="176"
        y1="16"
        x2="176"
        y2="64"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="224"
        y1="72"
        x2="224"
        y2="104"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="152"
        y1="40"
        x2="200"
        y2="40"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <line
        x1="208"
        y1="88"
        x2="240"
        y2="88"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}

/** Selected — `icon--sparkle-fill`. */
export function ShellSparkleFillIcon({
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
      <path d="M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z" />
    </svg>
  );
}
