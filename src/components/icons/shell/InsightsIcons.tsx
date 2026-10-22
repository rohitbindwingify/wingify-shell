/**
 * Shell insights marks for Insights rail — outline (idle) + fill (selected).
 * Paths from VWO sprite `icon--vwo-insights` / `icon--vwo-insights-fill`.
 */
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type ShellIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

/** Unselected — `icon--vwo-insights` (viewBox 32). */
export function ShellInsightsIcon({
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
      <path d="M14.7489 13.5679L14.9313 13.6125L27.0917 17.5107C28.1239 17.8421 28.2604 19.2472 27.3108 19.7708L22.0346 22.678L19.7902 26.836C19.2827 27.7755 17.9028 27.6733 17.5393 26.6693L13.3918 15.2112C13.0641 14.306 13.8444 13.4173 14.7489 13.5679ZM18.8282 24.5444L20.4307 21.5781L20.5252 21.4298C20.6305 21.2878 20.7656 21.1693 20.9216 21.0833L24.9562 18.8573L15.6939 15.8884L18.8282 24.5444Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.2885 25.1546C14.2474 25.0531 14.1489 24.9866 14.0393 24.9866H6.52432C6.22741 24.9866 5.98672 24.7459 5.98672 24.449V6.99697C5.98672 6.70007 6.22741 6.45938 6.52432 6.45938H23.3254C23.6223 6.45938 23.863 6.70007 23.863 6.99697V13.4296C23.863 13.5456 23.9374 13.6485 24.0475 13.6849L25.4458 14.1465C25.6197 14.204 25.7989 14.0744 25.7989 13.8913V6.1365C25.7989 5.24578 25.0766 4.52344 24.1858 4.52344H5.66384L5.49847 4.53131C4.68528 4.61398 4.05078 5.3015 4.05078 6.1365V25.3095C4.05078 26.1445 4.68528 26.832 5.49847 26.9147L5.66384 26.9226H14.6051C14.7958 26.9226 14.9258 26.7296 14.8543 26.5529L14.2885 25.1546Z"
      />
    </svg>
  );
}

/** Selected — `icon--vwo-insights-fill` (viewBox 27). */
export function ShellInsightsFillIcon({
  className,
  size = 16,
  strokeWidth: _strokeWidth,
  ...props
}: ShellIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 27 27"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
      {...props}
    >
      <path d="M12.1884 11.0054L12.3708 11.05L24.5311 14.9482C25.5634 15.2796 25.6998 16.6847 24.7503 17.2083L19.4741 20.1155L17.2297 24.2735C16.7222 25.213 15.3422 25.1108 14.9787 24.1068L10.8312 12.6487C10.5036 11.7435 11.2838 10.8548 12.1884 11.0054Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.728 22.5921C11.6869 22.4906 11.5883 22.4241 11.4788 22.4241H3.96377C3.66686 22.4241 3.42617 22.1834 3.42617 21.8865V4.43447C3.42617 4.13757 3.66686 3.89688 3.96377 3.89688H20.7648C21.0617 3.89688 21.3024 4.13757 21.3024 4.43447V10.8671C21.3024 10.9831 21.3768 11.086 21.487 11.1224L22.8853 11.584C23.0592 11.6415 23.2384 11.5119 23.2384 11.3288V3.574C23.2384 2.68328 22.516 1.96094 21.6253 1.96094H3.1033L2.93792 1.96881C2.12474 2.05148 1.49023 2.739 1.49023 3.574V22.747C1.49023 23.582 2.12474 24.2695 2.93792 24.3522L3.1033 24.3601H12.0446C12.2352 24.3601 12.3653 24.1671 12.2938 23.9904L11.728 22.5921Z"
      />
    </svg>
  );
}
