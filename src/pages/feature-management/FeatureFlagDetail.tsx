import FlagHoldoutSheet from './FlagHoldoutSheet';
import { FLAG_HOLDOUTS, initialFlagHoldouts } from '@/data/flagHoldouts';
import FlagEnvironmentSelect from '@/components/feature-flags/FlagEnvironmentSelect';
import CreateRolloutRuleSheet from './CreateRolloutRuleSheet';
import AnimatedRuleContent from './AnimatedRuleContent';
import './FeatureFlagRules.css';
import RolloutRuleSetup from './RolloutRuleSetup';
import ExperimentRuleSetup from './ExperimentRuleSetup';
import { ComingSoonIllustration } from '@/components/empty/ComingSoonState';
import FeatureFlagReports from "./FeatureFlagReports";
import { useFlagDetailPreferences } from '@/store/flagDetailPreferences';
import { Fragment, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Search, Copy, Plus, Pencil, Trash2, ChevronDown, ChevronUp, ArrowRight, FlaskConical, UserRound, GripVertical, MoreHorizontal, Info } from '@/components/icons/protoLucide';
import { FLAG_ENVIRONMENTS, ruleStatus, ruleStatusHint, ruleStatusLabel, hasRuleReport, isGradualRollout, type FlagEnvironment, type FlagRule, type RuleStatus } from '@/data/featureFlagRules';
import { useFlagRulesStore } from '@/store/flagRules';
import { useFlagEnvironmentsStore } from '@/store/flagEnvironments';
import { useVisibleFeatureFlags } from '@/store/flagRows';

const tones: Record<RuleStatus, BadgeTone> = { Active: 'green', Inactive: 'amber', Draft: 'neutral', Paused: 'amber', Scheduled: 'berry', Completed: 'neutral' };
const accent = 'text-[var(--link)]';

export default function FeatureFlagDetail() {
  const { entityId = '' } = useParams();
  const flag = useVisibleFeatureFlags().find(item => item.id === entityId);
  if (!flag) return <div className="p-10"><h1 className="text-xl font-semibold">Feature flag not found</h1><Button asChild variant="link"><Link to="/feature-management/feature-flags">Back to Feature Flags</Link></Button></div>;
  return <FlagDetailContent flagId={entityId} />;
}

function FlagDetailContent({ flagId }: { flagId: string }) {
  const { pathname } = useLocation();
  const section = pathname.endsWith('/reports') ? 'reports' : pathname.endsWith('/rules') ? 'rules' : 'configuration';
  return <div key={`${flagId}:${section}`} className={`flex h-full min-h-0 flex-1 flex-col ${section !== 'configuration' ? 'flag-page-transition' : ''}`}>
    {section === 'reports' ? <FeatureFlagReports flagId={flagId} /> : <FlagWorkspace key={flagId} flagId={flagId} />}
  </div>;
}

function FlagWorkspace({ flagId }: { flagId: string }) {
  const { pathname } = useLocation();
  const [query, setQuery] = useSearchParams();
  const { rules: allRules, save, remove, move } = useFlagRulesStore();
  const { enabled, setEnabled } = useFlagEnvironmentsStore();
  const rules = allRules.filter(rule => rule.flagId === flagId);
  const base = `/feature-management/feature-flags/c/${flagId}`;
  const envParam = query.get('environment');
  const environment: FlagEnvironment = FLAG_ENVIRONMENTS.find(env => env === envParam) ?? 'Production';
  const key = `${flagId}:${environment}`;
  const isEnvironmentEnabled = (name: string) => enabled[`${flagId}:${name}`] ?? false;
  const isOn = isEnvironmentEnabled(environment);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const setCategory = (group: string) => setCollapsedGroups(previous => ({ ...previous, [group]: false }));
  const [debuggerOpen, setDebuggerOpen] = useState(false);
  const [openSetup, setOpenSetup] = useState<Record<string, boolean>>({});
  const [creatingRollout, setCreatingRollout] = useState(false);
  const [editing, setEditing] = useState<FlagRule | null>(null);
  const [deleting, setDeleting] = useState<FlagRule | null>(null);
  const [copying, setCopying] = useState(false);
  const [sourceId, setSourceId] = useState('');
  const [pendingFlow, setPendingFlow] = useState<{ title: string; description: string } | null>(null);
  const [notice, setNotice] = useState<{ message: string } | null>(null);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  const { linkedHoldouts, saveHoldouts } = useFlagDetailPreferences();
  const selectedHoldoutIds = linkedHoldouts[key] ?? initialFlagHoldouts(key);
  const selectedHoldouts = FLAG_HOLDOUTS.filter(item => selectedHoldoutIds.includes(item.id));
  const showHoldoutSummary = selectedHoldouts.length > 0;
  const [holdoutOpen, setHoldoutOpen] = useState(false);
  const [holdoutsExpanded, setHoldoutsExpanded] = useState(false);
  const environmentRules = rules.filter(rule => rule.environment === environment);
  const rollout = environmentRules.filter(rule => rule.type === 'Rollout');
  const experiments = environmentRules.filter(rule => rule.type !== 'Rollout');
  const section = pathname.endsWith('/configuration') ? 'configuration' : pathname.endsWith('/reports') ? 'reports' : 'rules';

  if (pathname === base || pathname === `${base}/`) return <Navigate replace to={`${base}/${rules.length ? 'rules' : 'configuration'}`} />;

  function openFlow(title: string) {
    const descriptions: Record<string, string> = {
      'Create rollout rule': 'Define who receives this feature and control how much traffic is included in the rollout.',
      'AB test rule': 'Compare variations of this feature to learn which experience performs best.',
      'Personalize rule': 'Deliver a tailored feature experience to visitors who match your audience conditions.',
      'Multivariate rule': 'Test combinations of feature variations to find the best-performing experience.',
      'Add to holdout': 'Keep a group of visitors outside this feature to measure its overall impact.',
      'Remove from holdout': 'Remove this feature from the holdout group.',
    };
    setPendingFlow({ title, description: descriptions[title] });
  }
  function createRule() {
    setCreatingRollout(true);
  }
  function toggleRule(rule: FlagRule, next: boolean) {
    save({ ...rule, enabled: next, hasStarted: rule.hasStarted || (next && isOn && (!rule.scheduledFor || Date.parse(rule.scheduledFor) <= Date.now())), completed: next ? false : rule.completed, pauseReason: next ? undefined : 'Paused manually by a user.' });
  }
  async function copyText(text: string) {
    try { await navigator.clipboard.writeText(text); setNotice({ message: 'Copied to clipboard' }); }
    catch { setNotice({ message: 'Couldn’t copy. Please select and copy the text manually.' }); }
  }

  if (section === 'configuration') return <section className="flex min-h-[480px] w-full flex-1 flex-col items-center justify-center px-6 py-16 text-center">
    <ComingSoonIllustration className="mb-6 h-auto w-full max-w-[280px]" />
    <h1 className="text-2xl font-semibold">Flag configuration is being built</h1>
    <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Soon, you’ll be able to edit this flag’s variables, variations, and metrics here, shared across all environments.</p>
  </section>;

  return <TooltipProvider><div className="flag-rule-workspace flex min-h-0 flex-1 overflow-hidden">
    <div className="flag-rule-main flex min-h-0 min-w-0 flex-1 flex-col bg-canvas">
      <div className="z-10 flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2"><div><div className="flex items-center gap-3"><FlagEnvironmentSelect value={environment} onValueChange={env => setQuery({ environment: env })} isEnabled={isEnvironmentEnabled} /><Switch checked={isOn} aria-label={`${environment} flag enabled`} onCheckedChange={next => {
        setEnabled(key, next);
        if (next) environmentRules.filter(rule => rule.enabled && !rule.completed && (!rule.scheduledFor || Date.parse(rule.scheduledFor) <= Date.now())).forEach(rule => save({ ...rule, hasStarted: true }));
      }} /></div></div>{!debuggerOpen && <div className="flex items-center gap-3"><DropdownMenu><DropdownMenuTrigger asChild><Button className="h-8 gap-1 rounded-sm px-3 font-normal"><img src="/feature-flags/layout/create.svg" alt="" />Create rule</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={createRule}>Rollout rule</DropdownMenuItem><DropdownMenuItem onSelect={() => openFlow('AB test rule')}>AB test rule</DropdownMenuItem><DropdownMenuItem onSelect={() => openFlow('Personalize rule')}>Personalize rule</DropdownMenuItem><DropdownMenuItem onSelect={() => openFlow('Multivariate rule')}>Multivariate rule</DropdownMenuItem></DropdownMenuContent></DropdownMenu>{!showHoldoutSummary && <Tooltip delayDuration={250} disableHoverableContent><TooltipTrigger asChild><Button variant="outline" size="icon" className="size-8 rounded-sm" aria-label="Add to Holdout" onClick={() => setHoldoutOpen(true)}><img src="/feature-flags/layout/holdout.svg" alt="" /></Button></TooltipTrigger><TooltipContent side="bottom" sideOffset={8} className="pointer-events-none max-w-64 text-center leading-5">Add flag to holdout group to measure its true impact</TooltipContent></Tooltip>}<Tooltip delayDuration={250} disableHoverableContent><TooltipTrigger asChild><span className="inline-flex" tabIndex={!rules.length ? 0 : undefined} aria-label={!rules.length ? "Copy rules" : undefined}><Button variant="outline" size="icon" className="size-8 rounded-sm" aria-label="Copy rule" disabled={!rules.length} onClick={() => { setSourceId(''); setCopying(true); }}><img src="/feature-flags/layout/copy.svg" alt="" /></Button></span></TooltipTrigger><TooltipContent side="bottom" sideOffset={8} className="pointer-events-none max-w-64 text-center leading-5">Copy rules from other environments</TooltipContent></Tooltip><Tooltip delayDuration={250} disableHoverableContent><TooltipTrigger asChild><Button variant="outline" size="icon" className="size-8 rounded-sm" aria-label="Debugger" onClick={() => setDebuggerOpen(true)}><img src="/feature-flags/layout/debugger.svg" alt="" /></Button></TooltipTrigger><TooltipContent side="bottom" sideOffset={8} className="pointer-events-none max-w-64 text-center leading-5">Test your rule evaluation before going live</TooltipContent></Tooltip></div>}</div>
      <div className="flag-rule-scroll min-h-0 flex-1 overflow-y-auto bg-canvas py-4 [scrollbar-gutter:stable_both-edges]">
      <div className="mx-auto w-[80%] min-w-0 max-w-[1000px]">
      {notice && <Card role="status" aria-live="polite" aria-atomic="true" className="fixed bottom-6 right-6 z-50 max-w-sm shadow-lg"><CardContent className="px-4 py-3 text-sm">{notice.message}</CardContent></Card>}
      {section === 'reports' ? <><h2 className="mb-2 text-lg font-semibold">Rule reports</h2><p className="mb-6 text-sm text-muted-foreground">Results for rules with user activity in {environment}. Sample data.</p>{environmentRules.filter(rule => hasRuleReport(rule,isOn)).length ? environmentRules.filter(rule => hasRuleReport(rule,isOn)).map(rule => <Card key={rule.id} className={`mb-4 ${query.get('rule') === rule.id ? 'ring-1 ring-border' : ''}`}><CardContent className="flex items-center justify-between gap-4 p-6"><div><Tooltip><TooltipTrigger asChild><span tabIndex={0} aria-label={rule.type === 'Rollout' ? 'Rollout' : rule.type === 'Testing' ? 'AB test' : 'Personalise'}>{rule.type === 'Rollout' ? <ArrowRight className="size-4" /> : rule.type === 'Testing' ? <FlaskConical className="size-4" /> : <UserRound className="size-4" />}</span></TooltipTrigger><TooltipContent>{rule.type === 'Rollout' ? 'Rollout' : rule.type === 'Testing' ? 'AB test' : 'Personalise'}</TooltipContent></Tooltip><h3 className="font-medium">{rule.name}</h3><p className="mt-1 text-sm text-muted-foreground">{rule.type} · {ruleStatus(rule,isOn)}</p></div><div><p className="text-xs text-muted-foreground">Visitors</p><p className="mt-1 font-semibold">{rule.visitors.toLocaleString('en-US')}</p></div><div><p className="text-xs text-muted-foreground">Primary metric</p><p className={`mt-1 font-semibold ${accent}`}>{rule.metric ?? 'No results yet'}</p></div></CardContent></Card>) : <Card><CardContent className="p-10 text-center text-muted-foreground">No reports yet. Reports appear after a rule receives user activity.</CardContent></Card>}</> : <>
      <div key={debuggerOpen ? 'debugger' : 'rules'} className="flag-section-transition">
      {debuggerOpen && <div className="mb-4 flex items-center justify-between"><h2 className="text-[18px] font-normal">Debugger</h2><Button variant="ghost" size="icon" aria-label="Close debugger" onClick={() => setDebuggerOpen(false)}><X className="size-4" /></Button></div>}
      {debuggerOpen ? <section aria-labelledby="debugger-coming-soon" className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
        <ComingSoonIllustration className="mb-6 h-auto w-full max-w-[280px]" />
        <h2 id="debugger-coming-soon" className="text-xl font-semibold">Debugger is being built</h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Soon, you’ll be able to check how your rules evaluate visitors and understand which experience they receive.</p>
      </section> : <div className="space-y-4">

      {showHoldoutSummary && <section className="rounded-sm border border-border bg-card p-4" aria-label="Flag holdouts">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2><Button variant="ghost" className="h-auto gap-2 p-0 text-base font-normal hover:bg-transparent" aria-expanded={holdoutsExpanded} aria-controls="flag-holdouts" onClick={() => setHoldoutsExpanded(value => !value)}>
            <ChevronDown className={`size-4 transition-transform motion-reduce:transition-none ${holdoutsExpanded ? '' : '-rotate-90'}`} />
            Holdout ({selectedHoldouts.length})
          </Button></h2>
          <Button variant="link" className="h-auto gap-1 p-0 font-normal" onClick={() => setHoldoutOpen(true)}>Manage Holdouts<ArrowRight className="size-4" /></Button>
        </div>
        <AnimatedRuleContent open={holdoutsExpanded} id="flag-holdouts">
          <div className="mt-4 overflow-x-auto rounded-sm border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-canvas text-muted-foreground"><tr>
                <th scope="col" className="px-3 py-2 font-medium">Name</th>
                <th scope="col" className="w-36 whitespace-nowrap px-3 py-2 font-medium">Traffic allocation</th>
                <th scope="col" className="w-48 whitespace-nowrap px-3 py-2 font-medium">Associated feature flags</th>
              </tr></thead>
              <tbody>{selectedHoldouts.map(item => <tr key={item.id}>
                <td className="px-3 py-2">{item.name}</td><td className="px-3 py-2">{item.traffic}%</td><td className="px-3 py-2">{new Set([...item.linkedFlagIds, flagId]).size}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </AnimatedRuleContent>
      </section>}
      {showHoldoutSummary ? <div className="!mt-3 [&+section]:!mt-3 flex w-full items-center justify-center gap-2 rounded bg-[color-mix(in_srgb,var(--semantic-bg-canvas),var(--semantic-bg-selected-hover)_50%)] px-4 py-3 text-center text-[14px] font-normal text-muted-foreground">
        <ArrowRight className="size-4 shrink-0 rotate-90" aria-hidden="true" />
        <p>Rest of the visitors will be evaluated for the following rules</p>
        <ArrowRight className="size-4 shrink-0 rotate-90" aria-hidden="true" />
      </div> : <p className="mb-4 text-sm text-muted-foreground">All visitors will be evaluated for the rules in the following order.</p>}
      {(['rollout', 'experiments'] as const).map(category => {
        const visible = category === 'rollout' ? rollout : experiments;
        const expanded = !collapsedGroups[category];
        return <Fragment key={category}>
          {category === 'experiments' && <div className="!mt-3 [&+section]:!mt-3 flex w-full items-center justify-center gap-2 rounded bg-info-bg/40 px-4 py-3 text-center text-[14px] font-normal text-muted-foreground">
            <ArrowRight className="size-4 shrink-0 rotate-90" aria-hidden="true" />
            <p>Users qualifying for rollout rules are evaluated for the following rules.</p>
            <ArrowRight className="size-4 shrink-0 rotate-90" aria-hidden="true" />
          </div>}
          <section className="rounded border border-[var(--border-strong)] bg-canvas p-4">
          <h2><Button variant="ghost" className="h-auto gap-2 p-0 text-base font-semibold text-muted-foreground hover:bg-transparent" aria-expanded={expanded} aria-controls={'group-' + category} onClick={() => setCollapsedGroups(previous => ({ ...previous, [category]: expanded }))}><img src="/feature-flags/layout/section.svg" alt="" className={'shrink-0 transition-transform duration-200 motion-reduce:transition-none ' + (expanded ? 'rotate-90' : '')} />{category === 'rollout' ? 'Rollout Rules' : 'Experimentation & Personalisation'} ({visible.length})</Button></h2>
          <AnimatedRuleContent open={expanded} id={'group-' + category}><div className="ml-7 pt-2">
      <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"><span>Visitors who qualify will receive{' '}<strong className="font-medium text-foreground">{category === 'experiments' ? 'variants served' : 'default values'}</strong></span><Info className="size-4 shrink-0" aria-label={category === 'experiments' ? 'Qualifying visitors receive variants served' : 'Qualifying visitors receive default values'} /></p>
      {visible.map((rule,index) => <div key={rule.id} className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border border-border text-xs text-muted-foreground" aria-label={"Rule order " + (index + 1)}>{index + 1}</span><Card className="flag-rule-card mb-3 min-w-0 flex-1 rounded-sm" onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }} onDrop={event => { event.preventDefault(); const source = visible.findIndex(item => item.id === event.dataTransfer.getData('text/plain')); if (source < 0 || source === index) return; const direction = source < index ? 1 : -1; for (let step = 0; step < Math.abs(index-source); step++) move(visible[source].id,direction); }}><CardContent className="px-4 pb-3 pt-4"><div className="flex items-start gap-4"><Button variant="ghost" size="icon" className="flag-rule-reorder size-5 shrink-0" aria-label={`Reorder ${rule.name}. Use Up or Down arrow keys.`} draggable onDragStart={event => { event.dataTransfer.setData('text/plain',rule.id); event.dataTransfer.effectAllowed = 'move'; }} title="Drag to reorder, or use Up and Down arrow keys" onKeyDown={event => { if (event.key === 'ArrowUp' && index > 0) { event.preventDefault(); move(rule.id,-1); } if (event.key === 'ArrowDown' && index < visible.length-1) { event.preventDefault(); move(rule.id,1); } }}><GripVertical className="size-5" /></Button><Switch className="flag-rule-small-switch mt-1" checked={rule.enabled} aria-label={`Enable ${rule.name}`} onCheckedChange={next => toggleRule(rule,next)} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Tooltip><TooltipTrigger asChild><span tabIndex={0} aria-label={rule.type === 'Rollout' ? 'Rollout' : rule.type === 'Testing' ? 'AB test' : 'Personalise'}>{rule.type === 'Rollout' ? <ArrowRight className="size-4" /> : rule.type === 'Testing' ? <FlaskConical className="size-4" /> : <UserRound className="size-4" />}</span></TooltipTrigger><TooltipContent>{rule.type === 'Rollout' ? 'Rollout' : rule.type === 'Testing' ? 'AB test' : 'Personalise'}</TooltipContent></Tooltip><h3 className="font-medium">{rule.name}</h3><Button size="icon" variant="ghost" className="size-6" aria-label={`Copy ${rule.name} ID`} onClick={() => copyText(rule.id)}><Copy className="size-3.5" /></Button></div></div><Tooltip><TooltipTrigger asChild><span tabIndex={0}><Badge tone={tones[ruleStatus(rule,isOn)]}>{ruleStatusLabel(rule,isOn)}</Badge></span></TooltipTrigger><TooltipContent>{ruleStatusHint(rule,isOn)}</TooltipContent></Tooltip>{hasRuleReport(rule,isOn) && <div className="shrink-0 border-l border-border pl-3"><Button asChild variant="tertiary" className="h-7 gap-0.5 rounded-sm border-0 px-1.5 py-1 text-sm font-normal leading-5"><Link to={`${base}/reports?environment=${environment}&rule=${rule.id}`} aria-label={`View reports for ${rule.name}`}><img src="/feature-flags/reports.svg" alt="" className="shrink-0" />Reports</Link></Button></div>}{ruleStatus(rule,isOn) === 'Draft' ? <><Button variant="ghost" size="icon" className="size-7" aria-label={`Edit ${rule.name}`} onClick={() => setEditing({ ...rule })}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" className="size-7" aria-label={`Delete ${rule.name}`} onClick={() => setDeleting(rule)}><Trash2 className="size-4" /></Button></> : <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-7" aria-label={`More actions for ${rule.name}`}><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => setEditing({ ...rule })}><Pencil className="mr-2 size-4" />Edit rule</DropdownMenuItem><DropdownMenuItem onSelect={() => setDeleting(rule)}><Trash2 className="mr-2 size-4" />Delete rule</DropdownMenuItem></DropdownMenuContent></DropdownMenu>}</div>
      <div className="flag-rule-summary mt-3 flex min-h-6 items-center justify-between gap-4">
      <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
        {hasRuleReport(rule,isOn) && rule.visitors > 0 && <span className={`inline-flex flex-wrap items-center gap-3 ${!openSetup[rule.id] ? 'border-r border-border pr-4' : ''}`}><span><strong className="font-semibold text-foreground" title={rule.visitors.toLocaleString('en-US')}>{new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(rule.visitors)}</strong> Visitors</span><span><strong className="font-semibold text-foreground" title={rule.uniqueConversions?.toLocaleString('en-US')}>{rule.uniqueConversions === undefined ? '—' : new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(rule.uniqueConversions)}</strong> Unique Conversions</span></span>}
        {!openSetup[rule.id] && <span className="inline-flex flex-wrap items-center gap-x-1"><span>{rule.audience ?? 'All visitors'}</span><span aria-hidden="true">·</span><span><strong className="font-medium text-foreground">{rule.trafficAllocation ?? 100}%</strong> Traffic{isGradualRollout(rule) && ' (gradual rollout)'}</span></span>}
        {openSetup[rule.id] && !(hasRuleReport(rule,isOn) && rule.visitors > 0) && <p className="text-sm font-semibold text-muted-foreground">Rule setup</p>}
      </div>
        <div className="flag-rule-actions ml-auto flex shrink-0 items-center"><Button variant="link" className={accent} aria-expanded={!!openSetup[rule.id]} onClick={() => setOpenSetup(previous => ({ ...previous, [rule.id]: !previous[rule.id] }))}>{openSetup[rule.id] ? 'Hide setup' : 'Show setup'}{openSetup[rule.id] ? <ChevronUp className="ml-1 size-4" /> : <ChevronDown className="ml-1 size-4" />}</Button></div>
      </div>
      <AnimatedRuleContent open={!!openSetup[rule.id]}>
        {rule.type === 'Rollout' ? <RolloutRuleSetup rule={rule} onCopy={copyText} /> : <ExperimentRuleSetup rule={rule} onCopy={copyText} />}
      </AnimatedRuleContent>
      </CardContent></Card></div>)}
      {!visible.length && <div className="rounded border border-border bg-card p-8 text-center text-sm"><div className="flex flex-col items-center gap-4"><div className="relative size-20 p-1.5" aria-hidden="true"><img src="/feature-flags/no-rules.svg" alt="" width={72} height={72} /><Search className="absolute left-[30px] top-[26px] size-5 text-[var(--accent)]" strokeWidth={5} /></div><div className="max-w-[352px] space-y-1"><h2 className="font-semibold">No rule added</h2><p className="text-muted-foreground">Please add at least one rule to launch your feature</p></div></div><div className="mt-6 flex justify-center gap-3"><Tooltip><TooltipTrigger asChild><span className="inline-flex" tabIndex={rules.length === 0 ? 0 : undefined}><Button variant="outline" className="h-8 rounded-sm px-3 font-normal" disabled={rules.length === 0} onClick={() => { setSourceId(''); setCopying(true); }}><Copy className="mr-1 size-4" />Copy rule</Button></span></TooltipTrigger><TooltipContent>Import rules from other environments in this flag</TooltipContent></Tooltip><Button className="h-8 rounded-sm px-3 font-normal" onClick={() => category === "rollout" ? createRule() : openFlow("AB test rule")}><Plus className="mr-1 size-4" />Create rule</Button></div></div>}
      <p className="mt-3 flex items-center gap-1 text-sm">{category === 'experiments' ? 'Everyone else sees' : 'Everyone else receives'} <strong className="font-medium">{category === 'experiments' ? 'Qualified rollout experience' : 'native app experience'}</strong><img src="/feature-flags/layout/info.svg" alt="" /></p>
          </div></AnimatedRuleContent>
        </section></Fragment>;
      })}
      </div>}
      </div>
      </>}
      </div>
      </div>
    </div>
    {holdoutOpen && <FlagHoldoutSheet key={key} flagId={flagId} environment={environment} selectedIds={selectedHoldoutIds} onClose={() => setHoldoutOpen(false)} onSave={ids => { saveHoldouts(key, ids); setHoldoutOpen(false); setNotice({ message: 'Holdouts saved' }); }} />}
    <Sheet open={!!pendingFlow} onOpenChange={open => { if (!open) setPendingFlow(null); }}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-6 py-5 pr-12 text-left"><SheetTitle>{pendingFlow?.title}</SheetTitle></SheetHeader>
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-8 py-12 text-center">
          <ComingSoonIllustration className="mb-6 h-auto w-full max-w-[240px]" />
          <h2 className="text-xl font-semibold">Flow is being built</h2>
          <SheetDescription className="mt-3 max-w-sm leading-6">{pendingFlow?.description} This flow will be available here soon.</SheetDescription>
        </div>
      </SheetContent>
    </Sheet>
    {creatingRollout && <CreateRolloutRuleSheet flagId={flagId} environment={environment} existing={rules} onClose={() => setCreatingRollout(false)} onCreate={rule => { save(rule); setCategory('rollout'); setCreatingRollout(false); }} />}
    {editing?.type === 'Rollout' && <CreateRolloutRuleSheet key={editing.id} flagId={flagId} environment={environment} existing={rules} initialRule={editing} environmentOn={isOn} onClose={() => setEditing(null)} onCreate={rule => { save(rule); setEditing(null); }} />}
    <Dialog open={!!editing && editing.type !== 'Rollout'} onOpenChange={open => { if (!open) setEditing(null); }}><DialogContent><DialogHeader><DialogTitle>{allRules.some(rule => rule.id === editing?.id) ? 'Edit rule' : 'Create rule'}</DialogTitle><DialogDescription>{environment} · New rules start as Draft.</DialogDescription></DialogHeader>{editing && <form className="space-y-4" onSubmit={event => { event.preventDefault(); if (!editing.name.trim()) return; save({ ...editing, name: editing.name.trim() }); setCategory(editing.type === 'Rollout' ? 'rollout' : 'experiments'); setEditing(null); }}><div className="space-y-2"><Label htmlFor="rule-name">Rule name</Label><Input id="rule-name" required value={editing.name} onChange={event => setEditing({ ...editing, name: event.target.value })} /></div><div className="space-y-2"><Label>Rule type</Label><Select value={editing.type} onValueChange={value => setEditing({ ...editing, type: value as FlagRule['type'] })}><SelectTrigger aria-label="Rule type"><SelectValue /></SelectTrigger><SelectContent>{['Rollout','Testing','Personalization'].map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div><Button type="submit" disabled={!editing.name.trim()}>Save rule</Button></form>}</DialogContent></Dialog>
    <Dialog open={!!deleting} onOpenChange={open => { if (!open) setDeleting(null); }}><DialogContent><DialogHeader><DialogTitle>Delete {deleting?.name}?</DialogTitle><DialogDescription>This removes the rule and its sample results from this prototype.</DialogDescription></DialogHeader><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button><Button onClick={() => { if (deleting) remove(deleting.id); setDeleting(null); }}>Delete rule</Button></div></DialogContent></Dialog>
    <Dialog open={copying} onOpenChange={setCopying}><DialogContent><DialogHeader><DialogTitle>Copy rule to {environment}</DialogTitle><DialogDescription>The copy starts as a draft with no visitor or report data.</DialogDescription></DialogHeader><Select value={sourceId} onValueChange={setSourceId}><SelectTrigger aria-label="Rule to copy"><SelectValue placeholder="Choose a rule" /></SelectTrigger><SelectContent>{rules.map(rule => <SelectItem key={rule.id} value={rule.id}>{rule.name} · {rule.environment}</SelectItem>)}</SelectContent></Select><Button disabled={!sourceId} onClick={() => { const source = rules.find(rule => rule.id === sourceId); if (!source) return; save({ ...source, id: crypto.randomUUID(), environment, name: `${source.name} (copy)`, enabled: false, hasStarted: false, visitors: 0, uniqueConversions: undefined, metric: null, scheduledFor: undefined, completed: false, pauseReason: undefined }); setCategory(source.type === 'Rollout' ? 'rollout' : 'experiments'); setCopying(false); }}>Copy rule</Button></DialogContent></Dialog>
  </div></TooltipProvider>;
}
