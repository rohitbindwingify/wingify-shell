import FlagEnvironmentSelect from '@/components/feature-flags/FlagEnvironmentSelect';
import { Badge } from '@/components/ui/badge';
import './FeatureFlagReports.css';
import { ArrowUpRight, Target, FlaskConical } from '@/components/icons/protoLucide';
import FlagGroupedResults from "./FlagGroupedResults";
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReportsPage from '@/pages/reports/ReportsPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
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
  const reportName = selectedRule?.name ?? (type === 'Rollout' ? 'Rollout Report' : type === 'Personalization' ? 'Personalisation Report' : 'Experimentation Report');
  const reportIcon = (kind: FlagRule['type']) => kind === 'Rollout' ? <ArrowUpRight className="size-4 shrink-0" /> : kind === 'Testing' ? <FlaskConical className="size-4 shrink-0" /> : <Target className="size-4 shrink-0" />;
  const statusLabel = (items: FlagRule[]) => {
    const states = items.map(rule => ruleStatus(rule, environmentEnabled));
    const label = states.includes('Active') ? 'Running' : states.includes('Paused') || states.includes('Inactive') ? 'Paused' : states.includes('Scheduled') ? 'Scheduled' : states.includes('Completed') ? 'Completed' : states.length ? 'Draft' : 'No data';
    return <span className={`flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-normal ${label === 'Running' ? 'text-[var(--success-fg)]' : 'text-muted-foreground'}`}><span aria-hidden="true" className="size-1.5 rounded-full bg-current" />{label}</span>;
  };
  const optionClass = "pr-3 [&>span:first-child]:hidden [&>span:last-child]:min-w-0 [&>span:last-child]:w-full data-[state=checked]:bg-[var(--semantic-bg-selected-hover)]";
  const controls = <div className="flex w-full min-w-0 items-center gap-1">
    <FlagEnvironmentSelect value={environment} onValueChange={value => update('environment', value)} isEnabled={isEnvironmentEnabled} label="Report environment" reportStyle />
    <Select value={selection} onValueChange={value => update('rule', value)}>
      <SelectTrigger aria-label={`Report rule: ${reportName}`} className="h-8 w-auto min-w-[156px] max-w-[260px] shrink-0 gap-2 rounded-sm border-0 bg-transparent px-3 py-1.5 text-sm shadow-none [&>span]:min-w-0 [&>span]:truncate [&>span]:text-left">
        <span aria-hidden="true">{reportIcon(type)}</span><SelectValue><span title={reportName}>{reportName}</span></SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[370px] max-w-[calc(100vw-32px)]">
        {(['Rollout', 'Personalization'] as const).map(item => <SelectItem key={item} value={item} textValue={item === 'Rollout' ? 'Rollout Report' : 'Personalisation Report'} className={optionClass}><span className="flex w-full items-center justify-between gap-3"><span className="flex min-w-0 items-center gap-2">{reportIcon(item)}<span>{item === 'Rollout' ? 'Rollout Report' : 'Personalisation Report'}</span></span>{statusLabel(rules.filter(rule => rule.type === item))}</span></SelectItem>)}
        <SelectSeparator />
        <SelectGroup><SelectLabel className="px-3 py-2 text-xs font-normal text-muted-foreground">Experimentation (AB/MVT) Reports</SelectLabel>
          {rules.filter(rule => rule.type === 'Testing').map(rule => <SelectItem key={rule.id} value={`rule:${rule.id}`} textValue={rule.name} className={optionClass}><span className="flex w-full items-center justify-between gap-3"><span className="flex min-w-0 items-center gap-2">{reportIcon(rule.type)}<span className="truncate" title={rule.name}>{rule.name}</span></span>{statusLabel([rule])}</span></SelectItem>)}
          {!rules.some(rule => rule.type === 'Testing') && <div className="px-3 py-2 text-xs text-muted-foreground">No experimentation reports</div>}
        </SelectGroup>
      </SelectContent>
    </Select>

  </div>;

  const reportHeader = <Badge tone={status === 'Collecting data' ? 'green' : status === 'Tracking paused' ? 'amber' : 'neutral'} className="shrink-0 gap-1.5"><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{status}</Badge>;
  return <ReportsPage reportHeader={reportHeader} featureFlagReport campaignOverride={campaign} leadingControls={controls} resultsTable={type !== 'Testing' ? <FlagGroupedResults rules={selected} type={type} /> : undefined} emptyMessage={(type === 'Testing' ? visitors === 0 : selected.length === 0) ? 'No report data for this selection yet. Reports appear after a rule receives user activity.' : undefined} />;
}
