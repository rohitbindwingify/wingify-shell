import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DetailPreferences = {
  configuration: Record<string, Record<string, string>>;
  holdout: Record<string, boolean>;
  analysis: Record<string, boolean>;
  linkedHoldouts: Record<string, string[]>;
  saveHoldouts: (key: string, ids: string[]) => void;
  saveConfiguration: (flagId: string, values: Record<string, string>) => void;
  setHoldout: (key: string, value: boolean) => void;
  setAnalysis: (key: string, value: boolean) => void;
};
export const useFlagDetailPreferences = create<DetailPreferences>()(persist(set => ({
  configuration: {}, holdout: {}, analysis: {}, linkedHoldouts: {},
  saveHoldouts: (key, ids) => set(state => ({ linkedHoldouts: { ...state.linkedHoldouts, [key]: ids }, holdout: { ...state.holdout, [key]: ids.length > 0 } })),
  saveConfiguration: (flagId, values) => set(state => ({ configuration: { ...state.configuration, [flagId]: values } })),
  setHoldout: (key, value) => set(state => ({ holdout: { ...state.holdout, [key]: value } })),
  setAnalysis: (key, value) => set(state => ({ analysis: { ...state.analysis, [key]: value } })),
}), { name: 'wingify-flag-detail-preferences-v1' }));
