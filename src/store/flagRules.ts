import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FLAG_RULES, type FlagRule } from '@/data/featureFlagRules';

type RuleStore = {
  rules: FlagRule[];
  save: (rule: FlagRule) => void;
  remove: (id: string) => void;
  move: (id: string, direction: -1 | 1) => void;
};
export const useFlagRulesStore = create<RuleStore>()(persist((set) => ({
  rules: FLAG_RULES,
  save: rule => set(state => ({ rules: state.rules.some(item => item.id === rule.id) ? state.rules.map(item => item.id === rule.id ? rule : item) : [...state.rules, rule] })),
  remove: id => set(state => ({ rules: state.rules.filter(rule => rule.id !== id) })),
  move: (id, direction) => set(state => {
    const rules = [...state.rules];
    const index = rules.findIndex(rule => rule.id === id);
    if (index < 0) return state;
    const rule = rules[index];
    const peers = rules.map((item, i) => ({ item, i })).filter(({ item }) => item.flagId === rule.flagId && item.environment === rule.environment && (item.type === 'Rollout') === (rule.type === 'Rollout'));
    const peer = peers.findIndex(({ i }) => i === index);
    const target = peers[peer + direction]?.i;
    if (target === undefined) return state;
    [rules[index], rules[target]] = [rules[target], rules[index]];
    return { rules };
  }),
}), { name: 'wingify-flag-rules-v1', version: 5, migrate: persisted => {
  const state = persisted as RuleStore;
  const draft = FLAG_RULES.find(rule => rule.id === 'production-draft-rollout')!;
  const rules = state.rules.some(rule => rule.id === draft.id) ? state.rules : [...state.rules, draft];
  return { ...state, rules: rules.map(rule => {
    const seed = FLAG_RULES.find(item => item.id === rule.id);
    return { personalizationSetup: seed?.personalizationSetup, testingSetup: seed?.testingSetup, rolloutSetup: seed?.rolloutSetup, uniqueConversions: seed?.uniqueConversions, audience: seed?.audience, trafficAllocation: seed?.trafficAllocation, rolloutSteps: seed?.rolloutSteps, ...rule };
  }) };
} }));
