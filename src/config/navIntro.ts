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

/** Which region of the annotated shell a callout marks. */
export type NavIntroFocus = "rail" | "panel" | "more" | "breadcrumb";

export type NavIntroTone = "amber" | "ocean" | "green" | "berry";

export type NavIntroPoint = {
  id: string;
  focus: NavIntroFocus;
  tone: NavIntroTone;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const NAV_INTRO_VERSION = 5;

export const NAV_INTRO_HEADING = {
  eyebrow: "New",
  title: "A simpler way to move around",
  description: "Products, pages, and settings are closer together in one place.",
};

export const NAV_INTRO_POINTS: NavIntroPoint[] = [
  {
    id: "breadcrumb",
    focus: "breadcrumb",
    tone: "amber",
    icon: Compass,
    title: "Breadcrumbs that do more",
    description: "Jump across products and open page help from the trail.",
  },
  {
    id: "rail",
    focus: "rail",
    tone: "ocean",
    icon: LayoutGrid,
    title: "All products in one place",
    description: "Switch products from a single left rail.",
  },
  {
    id: "more",
    focus: "more",
    tone: "green",
    icon: Pin,
    title: "Pin what you use",
    description: "Keep favorites on the rail; the rest go in More.",
  },
  {
    id: "panel",
    focus: "panel",
    tone: "berry",
    icon: Layers,
    title: "Clearer structure",
    description: "Related pages stay grouped by product.",
  },
];
