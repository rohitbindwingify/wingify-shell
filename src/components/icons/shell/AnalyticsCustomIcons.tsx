/**
 * Shell analytics marks for Journey Analytics rail — outline (idle) + fill (selected).
 * Paths from VWO sprite `icon--vwo-analytics-custom` / `-fill`.
 */
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type ShellIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

/** Unselected — `icon--vwo-analytics-custom`. */
export function ShellAnalyticsCustomIcon({
  className,
  size = 16,
  strokeWidth: _strokeWidth,
  ...props
}: ShellIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
      {...props}
    >
      <path
        d="M9 26H5C4.73478 26 4.48043 25.8946 4.29289 25.7071C4.10536 25.5196 4 25.2652 4 25V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H27C27.2652 6 27.5196 6.10536 27.7071 6.29289C27.8946 6.48043 28 6.73478 28 7V13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12H28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 10C7.55228 10 8 9.55228 8 9C8 8.44772 7.55228 8 7 8C6.44772 8 6 8.44772 6 9C6 9.55228 6.44772 10 7 10Z" />
      <path d="M10 10C10.5523 10 11 9.55228 11 9C11 8.44772 10.5523 8 10 8C9.44772 8 9 8.44772 9 9C9 9.55228 9.44772 10 10 10Z" />
      <path
        d="M17 20H13C12.4477 20 12 20.4477 12 21V25C12 25.5523 12.4477 26 13 26H17C17.5523 26 18 25.5523 18 25V21C18 20.4477 17.5523 20 17 20Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M26 16H22C21.4477 16 21 16.4477 21 17V25C21 25.5523 21.4477 26 22 26H26C26.5523 26 27 25.5523 27 25V17C27 16.4477 26.5523 16 26 16Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Selected — `icon--vwo-analytics-custom-fill`. */
export function ShellAnalyticsCustomFillIcon({
  className,
  size = 16,
  strokeWidth: _strokeWidth,
  ...props
}: ShellIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
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
        d="M5 5H27C28.1046 5 29 5.89542 29 7V25C29 26.1046 28.1046 27 27 27H5C3.89542 27 3 26.1046 3 25V7C3 5.89542 3.89542 5 5 5ZM5 7H27V11H5V7ZM14 20H19V25H14V20ZM21 15H26V25H21V15Z"
      />
      <path d="M7 10C7.55228 10 8 9.55228 8 9C8 8.44772 7.55228 8 7 8C6.44772 8 6 8.44772 6 9C6 9.55228 6.44772 10 7 10Z" />
      <path d="M10 10C10.5523 10 11 9.55228 11 9C11 8.44772 10.5523 8 10 8C9.44772 8 9 8.44772 9 9C9 9.55228 9.44772 10 10 10Z" />
    </svg>
  );
}
