/**
 * Shell hard-drives marks for Data360 rail — outline (idle) + fill (selected).
 * Paths from VWO sprite `icon--hard-drives` / `icon--hard-drives-fill`.
 */
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type ShellIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

/** Unselected — `icon--hard-drives`. */
export function ShellHardDrivesIcon({
  className,
  size = 16,
  strokeWidth: _strokeWidth,
  ...props
}: ShellIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.25"
        d="M15 3.75H5a2.5 2.5 0 1 0 0 5h10a2.5 2.5 0 1 0 0-5Zm0 7.5H5a2.5 2.5 0 0 0 0 5h10a2.5 2.5 0 1 0 0-5Z"
      />
      <path d="M5 7.03a.78.78 0 1 0 0-1.56.78.78 0 0 0 0 1.56m0 7.5a.78.78 0 1 0 0-1.56.78.78 0 0 0 0 1.56" />
    </svg>
  );
}

/** Selected — `icon--hard-drives-fill`. */
export function ShellHardDrivesFillIcon({
  className,
  size = 16,
  strokeWidth: _strokeWidth,
  ...props
}: ShellIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3.13h10a3.12 3.12 0 1 1 0 6.25H5a3.12 3.12 0 1 1 0-6.26m.94 3.12a.94.94 0 1 0-1.88 0 .94.94 0 0 0 1.88 0M5 10.63h10a3.12 3.12 0 1 1 0 6.24H5a3.12 3.12 0 1 1 0-6.25m.94 3.12a.94.94 0 1 0-1.88 0 .94.94 0 0 0 1.88 0"
      />
    </svg>
  );
}
