import { FEATURE_FLAGS } from './featureFlags';

export const FLAG_HOLDOUTS = [
  { id: 'buying-journey', name: 'Buying Journey Features', type: 'Global', active: true, traffic: 5, audience: 'All visitors', metric: 'Revenue per visitor', linkedFlagIds: FEATURE_FLAGS.slice(1, 10).map(flag => flag.id) },
  { id: 'amj-q1', name: 'AMJ Q1 Features', type: 'Global', active: true, traffic: 5, audience: 'All visitors', metric: 'Conversion rate', linkedFlagIds: FEATURE_FLAGS.slice(1, 10).map(flag => flag.id) },
  ...['3', '4', 'A', 'ABC', 'ABE'].map((name, index) => ({ id: `selective-${name}`, name: `Holdout ${name}`, type: 'Selective', active: false, traffic: 10, audience: 'Custom Segment', metric: 'Conversion rate', linkedFlagIds: [FEATURE_FLAGS[index + 1].id] })),
];

export function initialFlagHoldouts(key: string): string[] {
  return key === '30:Staging' ? ['buying-journey', 'amj-q1'] : [];
}
