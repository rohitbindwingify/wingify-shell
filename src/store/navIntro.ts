import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NAV_INTRO_VERSION } from "@/config/navIntro";

type NavIntroState = {
  seenVersion: number | null;
  /** Set when the tour is opened again by hand (Help, settings) after being seen. */
  replayRequested: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  markSeen: () => void;
  replay: () => void;
  clearReplay: () => void;
};

export const useNavIntroStore = create<NavIntroState>()(
  persist(
    (set) => ({
      seenVersion: null,
      replayRequested: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      markSeen: () => set({ seenVersion: NAV_INTRO_VERSION, replayRequested: false }),
      replay: () => set({ replayRequested: true }),
      clearReplay: () => set({ replayRequested: false }),
    }),
    {
      name: "wingify-nav-intro-v1",
      partialize: (s) => ({ seenVersion: s.seenVersion }),
      onRehydrateStorage: () => (state, error) => {
        if (!error) state?.setHasHydrated(true);
      },
    }
  )
);

useNavIntroStore.persist.onFinishHydration(() => {
  useNavIntroStore.getState().setHasHydrated(true);
});

export function shouldShowNavIntro(seenVersion: number | null): boolean {
  return seenVersion !== NAV_INTRO_VERSION;
}

/** Re-open the tour from anywhere (e.g. a Help menu row). */
export function openNavIntro(): void {
  useNavIntroStore.getState().replay();
}
