// @summary Content for the navigation introduction modal — one screen, no stepper.
// Bump NAV_INTRO_VERSION whenever the copy changes materially; the persisted store
// keys off it, so everyone sees the modal again.
import {
  Compass,
  Layers,
  LayoutGrid,
  Pin,
  type LucideIcon,
} from "@/components/icons/protoLucide";

/** Which region of the shell schematic a point refers to. "shell" lights everything. */
export type NavIntroFocus = "shell" | "rail" | "panel" | "more" | "breadcrumb";

export type NavIntroPoint = {
  id: string;
  /** Lit in the schematic while this point is hovered. */
  focus: NavIntroFocus;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const NAV_INTRO_VERSION = 3;

export const NAV_INTRO_HEADING = {
  eyebrow: "New",
  title: "A simpler way to move around",
  description:
    "Your products now sit in one rail on the left, each with its own menu. Nothing was removed — it is all closer together.",
};

export const NAV_INTRO_POINTS: NavIntroPoint[] = [
  {
    id: "rail",
    focus: "rail",
    icon: LayoutGrid,
    title: "All products in one place",
    description:
      "Experimentation, Personalization, Analytics and the rest sit side by side, one click apart.",
  },
  {
    id: "panel",
    focus: "panel",
    icon: Layers,
    title: "Clearer structure",
    description:
      "Each product's pages group in their own panel. Dock it, or let it fly out and keep your canvas wide.",
  },
  {
    id: "more",
    focus: "more",
    icon: Pin,
    title: "Pin what you use",
    description:
      "Keep the products you work in on the rail. Anything you unpin moves into More.",
  },
  {
    id: "breadcrumb",
    focus: "breadcrumb",
    icon: Compass,
    title: "Breadcrumbs that do more",
    description:
      "The trail at the top jumps you between campaigns, products or features, and opens help for the page you are on.",
  },
];
