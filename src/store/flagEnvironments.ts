import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FlagEnvironmentState = {
  enabled: Record<string, boolean>;
  setEnabled: (key: string, enabled: boolean) => void;
};

// Each flag has independent environment switches. Unset environments default to Off; saved choices persist across switches and reloads.
export const useFlagEnvironmentsStore = create<FlagEnvironmentState>()(
  persist(
    (set) => ({
      enabled: {},
      setEnabled: (key, enabled) => set(state => ({ enabled: { ...state.enabled, [key]: enabled } })),
    }),
    { name: 'wingify-flag-environments-v1' },
  ),
);
