/* Change summary: saved "/insights" (Behavior Analytics) and "/pulse" (User Feedback) pins now map to the merged "/analytics" suite. */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_PINNED_PATHS, PINNABLE_PATHS } from "../config/navigation";

/** At least this many pinnable products must stay on the main rail (outside Other). */
export const MIN_PINNED_PRODUCTS = 2;

export function canUnpinPath(pinnedPaths: string[], path: string): boolean {
  if (!PINNABLE_PATHS.includes(path) || !pinnedPaths.includes(path)) {
    return false;
  }
  return pinnedPaths.length > MIN_PINNED_PRODUCTS;
}

function clampPinned(paths: string[]): string[] {
  const ordered = PINNABLE_PATHS.filter((p) => paths.includes(p));
  if (ordered.length >= MIN_PINNED_PRODUCTS) return ordered;
  const extras = PINNABLE_PATHS.filter((p) => !ordered.includes(p));
  return [...ordered, ...extras].slice(0, MIN_PINNED_PRODUCTS);
}

type UIState = {
  /** docked = persistent embedded sub-nav panel; undocked = hover flyout */
  isDocked: boolean;
  /** Only pinnable paths may ever appear here. */
  pinnedPaths: string[];
  toggleDock: () => void;
  setDocked: (docked: boolean) => void;
  unpin: (path: string) => void;
  pin: (path: string) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDocked: false,
      pinnedPaths: [...DEFAULT_PINNED_PATHS],
      toggleDock: () => set((s) => ({ isDocked: !s.isDocked })),
      setDocked: (docked) => set({ isDocked: docked }),
      unpin: (path) =>
        set((s) => {
          if (!canUnpinPath(s.pinnedPaths, path)) return s;
          return {
            pinnedPaths: s.pinnedPaths.filter((p) => p !== path),
          };
        }),
      pin: (path) =>
        set((s) =>
          !PINNABLE_PATHS.includes(path) || s.pinnedPaths.includes(path)
            ? s
            : // keep NAV order regardless of pin order
              {
                pinnedPaths: PINNABLE_PATHS.filter(
                  (p) => s.pinnedPaths.includes(p) || p === path
                ),
              }
        ),
    }),
    {
      // v4: smaller default pin set + Hide from / Show in sidebar copy.
      name: "wingify-ui-v4",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<UIState>;
        return {
          ...current,
          ...p,
          pinnedPaths: clampPinned(
            (Array.isArray(p.pinnedPaths) ? p.pinnedPaths : current.pinnedPaths).map(
              (path) => {
                if (path === "/web-experiment") return "/experimentation";
                if (path === "/wandz") return "/wingz";
                // Behavior Analytics pin carries over to the merged Analytics suite.
                if (path === "/insights") return "/analytics";
                // User Feedback pin also carries over to the Analytics suite.
                if (path === "/pulse") return "/analytics";
                return path;
              }
            )
          ),
        };
      },
    }
  )
);
