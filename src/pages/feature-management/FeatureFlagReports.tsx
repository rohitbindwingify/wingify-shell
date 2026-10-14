import FlagEnvironmentSelect from '@/components/feature-flags/FlagEnvironmentSelect';
import { Badge } from '@/components/ui/badge';
import './FeatureFlagReports.css';
import { ArrowRight, UserRound } from '@/components/icons/protoLucide';
import FlagGroupedResults from "./FlagGroupedResults";
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReportsPage from '@/pages/reports/ReportsPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CAMPAIGNS, type Campaign } from '@/data/campaigns';
import { FLAG_ENVIRONMENTS, ruleStatus, type FlagRule } from '@/data/featureFlagRules';
import { useFlagEnvironmentsStore } from '@/store/flagEnvironments';
import { useFlagRulesStore } from '@/store/flagRules';
import { useVisibleFeatureFlags } from '@/store/flagRows';

const TYPES: FlagRule['type'][] = ['Rollout', 'Testing', 'Personalization'];
export default function FeatureFlagReports({ flagId }: { flagId: string }) {
  const [params, setParams] = useSearchParams();
  const allRules = useFlagRulesStore(state => state.rules);
  const flag = useVisibleFeatureFlags().find(item => item.id === flagId);
  const environment = FLAG_ENVIRONMENTS.find(item => item === params.get('environment')) ?? 'Production';
  const enabledEnvironments = useFlagEnvironmentsStore(state => state.enabled);
  const isEnvironmentEnabled = (name: string) => enabledEnvironments[`${flagId}:${name}`] ?? false;
  const environmentEnabled = isEnvironmentEnabled(environment);
  const rules = allRules.filter(rule => rule.flagId === flagId && rule.environment === environment);
  const linkedRule = rules.find(rule => rule.id === params.get('rule'));
  const type = linkedRule?.type ?? TYPES.find(item => item === params.get('ruleType')) ?? 'Rollout';
  const selectedRule = type === 'Testing' ? linkedRule ?? rules.find(rule => rule.type === 'Testing') : undefined;
  const selection = selectedRule ? `rule:${selectedRule.id}` : type;
  const selected = type === 'Testing' ? (selectedRule ? [selectedRule] : []) : rules.filter(rule => rule.type === type);
  const visitors = selected.reduce((total, rule) => total + rule.visitors, 0);
  const reportKey = `flag-${flagId}-${environment}-${selection}`;
  // The prototype reuses the Web Testing sample report model and interactions.
  // Rule/environment context and visitor totals are scoped to this selection.
  const campaign = useMemo<Campaign>(() => {
    const template = CAMPAIGNS.find(item => item.status === 'Running' && item.scenario === 'progress') ?? CAMPAIGNS[0];
    return { ...template, id: reportKey, name: `${flag?.name ?? 'Feature flag'} · ${environment} · ${selectedRule?.name ?? type}`, visitors, uniqueConversions: Math.round(visitors * 0.03), status: 'Running', scenario: 'progress', decision: 'No decision', vitals: 'healthy' };
  }, [reportKey, flag?.name, environment, selectedRule?.name, type, visitors]);
  function update(field: 'environment' | 'rule', value: string) {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (field === 'environment') { next.set('environment', value); next.delete('rule'); next.set('ruleType', 'Rollout'); }
      else if (value.startsWith('rule:')) { next.set('rule', value.slice(5)); next.delete('ruleType'); }
      else { next.set('ruleType', value); next.delete('rule'); }
      return next;
    });
  }
  const isLive = (items: FlagRule[]) => items.some(rule => ruleStatus(rule, environmentEnabled) === 'Active');
  const trackingStatus = (items: FlagRule[]) => isLive(items) ? 'Collecting data' : items.some(rule => rule.visitors > 0) ? 'Tracking paused' : 'No data';
  const status = trackingStatus(selected);
  const statusLabel = (items: FlagRule[]) => {
    const label = trackingStatus(items);
    return <span className={`shrink-0 whitespace-nowrap text-xs font-medium ${label === 'Collecting data' ? 'text-[var(--success-fg)]' : label === 'Tracking paused' ? 'text-[var(--warning-fg)]' : 'text-muted-foreground'}`}>{label}</span>;
  };
  const controls = <div className="flex w-full min-w-0 items-center gap-1">
    <FlagEnvironmentSelect value={environment} onValueChange={value => update('environment', value)} isEnabled={isEnvironmentEnabled} label="Report environment" />
    <Select value={selection} onValueChange={value => update('rule', value)}>
      <SelectTrigger aria-label={`Report rule: ${selectedRule?.name ?? type}, ${status}`} className="h-8 w-[156px] min-w-[156px] max-w-[156px] shrink-0 gap-1 rounded-sm border-0 px-3 py-1.5 bg-transparent text-sm shadow-none [&>span]:min-w-0 [&>span]:flex-1 [&>span]:truncate [&>span]:text-left">
        <div className="shrink-0 text-muted-foreground" aria-hidden="true">{type === 'Rollout' ? <ArrowRight className="size-4" /> : type === 'Testing' ? <img src="/feature-flags/report-layout/testing.svg" alt="" /> : <UserRound className="size-4" />}</div>
        <SelectValue><span className="flex min-w-0 items-center gap-2"><span className="min-w-0 flex-1 truncate" title={selectedRule ? `Testing · ${selectedRule.name}` : type}>{selectedRule ? `Testing · ${selectedRule.name}` : type}</span></span></SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[320px]">
        {TYPES.filter(item => item !== 'Testing').map(item => <SelectItem key={item} value={item} textValue={item} className="pr-2 [&>span:first-child]:hidden [&>span:last-child]:min-w-0 [&>span:last-child]:w-full data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"><span className="flex w-full items-center justify-between gap-3">{item}{statusLabel(rules.filter(rule => rule.type === item))}</span></SelectItem>)}
        {rules.filter(rule => rule.type === 'Testing').map(rule => <SelectItem key={rule.id} value={`rule:${rule.id}`} textValue={`Testing · ${rule.name}`} className="pr-2 [&>span:first-child]:hidden [&>span:last-child]:min-w-0 [&>span:last-child]:w-full data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"><span className="flex w-full items-center justify-between gap-3"><span className="max-w-[140px] truncate" title={`Testing · ${rule.name}`}>Testing · {rule.name}</span>{statusLabel([rule])}</span></SelectItem>)}
      </SelectContent>
    </Select>

  </div>;

  const reportHeader = <Badge tone={status === 'Collecting data' ? 'green' : status === 'Tracking paused' ? 'amber' : 'neutral'} className="shrink-0 gap-1.5"><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{status}</Badge>;
  return <ReportsPage reportHeader={reportHeader} featureFlagReport campaignOverride={campaign} leadingControls={controls} resultsTable={type !== 'Testing' ? <FlagGroupedResults rules={selected} type={type} /> : undefined} emptyMessage={(type === 'Testing' ? visitors === 0 : selected.length === 0) ? 'No report data for this selection yet. Reports appear after a rule receives user activity.' : undefined} />;
}
