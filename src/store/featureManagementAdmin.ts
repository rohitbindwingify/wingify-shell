import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ExclusiveGroup = { id: number; name: string; campaigns: number; modified: string; creator: string };
export type ManagedEnvironment = { id: number; name: string; sdkKey: string; webhook: boolean; webhookUrl?: string; webhookSecret?: string; openAccess: boolean; sdkEnabled: boolean; refreshedAt?: string };
type AdminState = {
  groups: ExclusiveGroup[];
  environments: ManagedEnvironment[];
  saveGroup: (group: ExclusiveGroup) => void;
  removeGroup: (id: number) => void;
  saveEnvironment: (environment: ManagedEnvironment) => void;
  removeEnvironment: (id: number) => void;
};
export const useFeatureManagementAdmin = create<AdminState>()(persist((set) => ({
  groups: [
    { id: 12, name: 'All Feature Flag Creation flow', campaigns: 12, modified: '2026-01-13T18:19:00', creator: 'John Doe' },
    { id: 676, name: 'MEG 2', campaigns: 24, modified: '2026-01-13T18:19:00', creator: 'Jane Doe' },
    { id: 3598, name: 'MEG 3', campaigns: 23, modified: '2026-01-13T18:19:00', creator: 'John Cena' },
    { id: 4683, name: 'MEG 4', campaigns: 13, modified: '2026-01-13T18:19:00', creator: 'John Bradly' },
  ],
  environments: ['Production', 'Dev', 'Staging'].map((name, index) => ({ id: 12343 + index, name, sdkKey: `5d3589e0e16793d767bf583e9ea5ece${index}d`, webhook: true, openAccess: true, sdkEnabled: true })),
  saveGroup: (group) => set(s => ({ groups: s.groups.some(g => g.id === group.id) ? s.groups.map(g => g.id === group.id ? group : g) : [...s.groups, group] })),
  removeGroup: (id) => set(s => ({ groups: s.groups.filter(g => g.id !== id) })),
  saveEnvironment: (environment) => set(s => ({ environments: s.environments.some(e => e.id === environment.id) ? s.environments.map(e => e.id === environment.id ? environment : e) : [...s.environments, environment] })),
  removeEnvironment: (id) => set(s => ({ environments: s.environments.filter(e => e.id !== id) })),
}), { name: 'wingify-feature-management-admin-v1' }));
