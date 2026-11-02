// @summary Copy + media for the navigation tour modal (intro + feature steps).
// Once a user dismisses a version, it stays dismissed. Only bump NAV_INTRO_VERSION
// when we intentionally want everyone to see the tour again (or call openNavIntro()).

export const NAV_INTRO_VERSION = 12;

export type NavIntroMedia = {
  src: string;
};

export type NavIntroStep = {
  id: string;
  /** Intro uses eyebrow; feature steps use "n / N". */
  kind: "intro" | "feature";
  eyebrow?: string;
  title: string;
  description: string;
  /** Only on intro. */
  footnote?: string;
  media: NavIntroMedia;
};

export const NAV_INTRO_STEPS: NavIntroStep[] = [
  {
    id: "intro",
    kind: "intro",
    eyebrow: "What's new",
    title: "A simpler way to move around",
    description:
      "Your products now sit in one rail on the left, each with its own menu. Nothing was removed; it is all closer together.",
    media: {
      src: "/nav-intro/shell-intro.png",
    },
  },
  {
    id: "breadcrumbs",
    kind: "feature",
    title: "Breadcrumbs that jump",
    description:
      "The trail at the top is new. Use it to switch campaigns, products and pages in place, and to open help for whatever you're on.",
    media: {
      src: "/nav-intro/shell-breadcrumbs.png",
    },
  },
  {
    id: "pin",
    kind: "feature",
    title: "Keep what you use",
    description:
      "Choose which products stay on the sidebar. Hide the rest under Other; show them in sidebar again any time.",
    media: {
      src: "/nav-intro/shell-pin.png",
    },
  },
  {
    id: "settings",
    kind: "feature",
    title: "Settings moved down here",
    description:
      "Account, workspace and configuration now sit at the bottom of the left sidebar, not in the top menus.",
    media: {
      src: "/nav-intro/shell-settings.png",
    },
  },
];
export const NAV_INTRO_FEATURE_COUNT = NAV_INTRO_STEPS.filter(
  (s) => s.kind === "feature"
).length;
