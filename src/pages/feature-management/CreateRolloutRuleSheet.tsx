import AnimatedRuleContent from './AnimatedRuleContent';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ChevronDown, ChevronRight, Check, Plus } from '@/components/icons/protoLucide';
import { STANDARD_SEGMENTS, MY_SEGMENTS } from '@/config/segments';
import { ruleStatusLabel, type FlagEnvironment, type FlagRule } from '@/data/featureFlagRules';

export default function CreateRolloutRuleSheet({ flagId, environment, existing, initialRule, environmentOn = true, onClose, onCreate }: {
  flagId: string; environment: FlagEnvironment; existing: FlagRule[]; initialRule?: FlagRule; environmentOn?: boolean;
  onClose: () => void; onCreate: (rule: FlagRule) => void;
}) {
  const savedCondition = initialRule?.rolloutSetup?.audienceCondition;
  const savedSegment = [...STANDARD_SEGMENTS.flatMap(group => group.attributes), ...MY_SEGMENTS].find(item => item.label === initialRule?.audience);
  const savedDate = initialRule?.scheduledFor ? new Date(initialRule.scheduledFor) : null;
  const localDate = savedDate ? new Date(savedDate.getTime() - savedDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
  const [name, setName] = useState(initialRule?.name ?? '');
  const [key, setKey] = useState(initialRule?.key ?? initialRule?.id ?? '');
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [audienceTab, setAudienceTab] = useState(savedCondition && !savedSegment ? 'Custom segments' : MY_SEGMENTS.some(item => item.id === savedSegment?.id) ? 'My Segments' : 'Standard Segments');
  const custom = audienceTab === 'Custom segments';
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState(savedSegment ?? STANDARD_SEGMENTS[0].attributes[0]);
  const [attribute, setAttribute] = useState(savedCondition?.attribute ?? 'Country');
  const [operator, setOperator] = useState(savedCondition?.operator ?? 'is equal to');
  const [value, setValue] = useState(savedCondition?.value ?? '');
  const [traffic, setTraffic] = useState(initialRule?.trafficAllocation ?? (initialRule ? 100 : 30));
  const [timeEnabled, setTimeEnabled] = useState((initialRule?.rolloutSteps?.length ?? 0) > 1);
  const [steps, setSteps] = useState(initialRule?.rolloutSteps?.slice(1).length ? initialRule.rolloutSteps.slice(1) : [{ afterDays: 2, trafficAllocation: 100 }]);
  const [metricEnabled, setMetricEnabled] = useState(Boolean(initialRule?.rolloutSetup?.metricConditions?.length));
  const [metricConditions, setMetricConditions] = useState(initialRule?.rolloutSetup?.metricConditions ?? [{ metric: 'Add to cart clicks', conversionRate: 5, visitors: 500, trafficAllocation: 100 }]);
  const [descriptionOpen, setDescriptionOpen] = useState(Boolean(initialRule?.description));
  const [description, setDescription] = useState(initialRule?.description ?? '');
  const [advanced, setAdvanced] = useState(false);
  const [schedule, setSchedule] = useState(Boolean(initialRule?.scheduledFor));
  const [date, setDate] = useState(localDate);
  const [salt, setSalt] = useState(initialRule?.rolloutSetup?.salt ?? '');
  const [error, setError] = useState('');
  const audience = custom ? 'Custom segment' : segment.label;
  return <Sheet open onOpenChange={open => { if (!open) onClose(); }}>
    <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
      <SheetHeader className="shrink-0 border-b px-6 py-5"><SheetTitle>{initialRule ? `Edit ${initialRule.name}` : 'Create Rollout Rule'}</SheetTitle><SheetDescription className={initialRule ? undefined : "sr-only"}>{initialRule ? ruleStatusLabel(initialRule, environmentOn) : "Configure the audience and allocation. The rule stays in Draft until you turn it on."}</SheetDescription></SheetHeader>
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={event => {
        event.preventDefault();
        if (existing.some(rule => rule.id !== initialRule?.id && rule.environment === environment && rule.key === key.trim())) { setError('A rule with this key already exists in this environment.'); return; }
        if (timeEnabled && steps.some((step, i) => step.afterDays <= (i ? steps[i - 1].afterDays : 0))) { setError('Rollout steps must have increasing days after launch.'); return; }
        onCreate({
          id: crypto.randomUUID(), flagId, environment, type: 'Rollout', enabled: false, hasStarted: false, visitors: 0, metric: null,
          ...initialRule, name: name.trim(), key: initialRule ? initialRule.key : key.trim(), description: description.trim(),
          audience, trafficAllocation: traffic, scheduledFor: schedule ? (date === localDate && initialRule?.scheduledFor ? initialRule.scheduledFor : new Date(date).toISOString()) : undefined,
          rolloutSteps: timeEnabled ? [{ afterDays: 0, trafficAllocation: traffic }, ...steps] : undefined,
          rolloutSetup: {
            ...initialRule?.rolloutSetup,
            audienceCondition: custom ? { attribute, operator, value: value.trim() } : segment.condition ? { attribute: segment.condition.subject, operator: segment.condition.operator, value: segment.condition.value } : undefined,
            salt: salt.trim() || undefined,
            metricConditions: metricEnabled ? metricConditions : undefined,
          },
        });
      }}>
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6 text-sm">
          <div className="space-y-2"><div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="rollout-name">Rule name</Label><Input id="rollout-name" required pattern=".*\S.*" value={name} placeholder="Rollout rule 1" onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="rollout-key">API name</Label><Input id="rollout-key" disabled={Boolean(initialRule)} required pattern="[A-Za-z0-9_-]+" title="Use letters, numbers, underscores or hyphens" value={key} placeholder="RollOutRule" onChange={e => { setKey(e.target.value); setError(''); }} /></div>
          </div>
          <section><Button type="button" variant="link" className="px-0" onClick={() => setDescriptionOpen(!descriptionOpen)}><Plus className="mr-1 size-4" />{descriptionOpen ? 'Hide description' : 'Add Description'}</Button>{descriptionOpen && <textarea aria-label="Description" className="min-h-20 w-full rounded border bg-background p-3" value={description} onChange={e => setDescription(e.target.value)} />}</section></div>
          <section className="space-y-2"><h3 className="font-semibold">Audience</h3>
            <Button type="button" variant="outline" className="h-9 w-[220px] max-w-full justify-between" aria-expanded={audienceOpen} aria-controls="rollout-audience-panel" onClick={() => setAudienceOpen(!audienceOpen)}><span key={audience} className="flag-section-transition min-w-0 truncate" title={audience}>{audience}</span><ChevronDown className={`ml-2 size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${audienceOpen ? "rotate-180" : ""}`} /></Button>
            <AnimatedRuleContent open={audienceOpen} id="rollout-audience-panel"><div className="grid h-[340px] w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded border sm:grid-cols-[200px_minmax(0,1fr)] sm:grid-rows-1">
              <div className="space-y-1 border-r bg-muted p-2">{['Standard Segments', 'My Segments', 'Custom segments'].map(label => <Button key={label} type="button" variant="ghost" className={`w-full justify-start whitespace-nowrap ${audienceTab === label ? 'bg-background' : ''}`} onClick={() => setAudienceTab(label)}>{label}</Button>)}</div>
              <div key={audienceTab} className="flag-section-transition flex min-h-0 min-w-0 flex-col gap-3 overflow-y-auto p-3">{custom ? <><Label htmlFor="audience-attribute">Attribute</Label><Input id="audience-attribute" required value={attribute} onChange={e => setAttribute(e.target.value)} /><Label htmlFor="audience-operator">Operator</Label><Input id="audience-operator" required value={operator} onChange={e => setOperator(e.target.value)} /><Label htmlFor="audience-value">Value</Label><Input id="audience-value" required value={value} onChange={e => setValue(e.target.value)} /></> : <>
                <Input aria-label="Search audiences" placeholder="Search audiences" value={search} onChange={e => setSearch(e.target.value)} />
                <div className="grid min-h-0 flex-1 gap-0 sm:grid-cols-2"><div className="min-h-0 overflow-y-auto sm:border-r sm:border-border">{(audienceTab === 'My Segments' ? [{ id: 'my-segments', section: 'My Segments', attributes: MY_SEGMENTS }] : STANDARD_SEGMENTS).map(group => {
                  const matches = group.attributes.filter(item => item.label.toLowerCase().includes(search.toLowerCase()));
                  return matches.length ? <div key={group.id} className="mb-3"><p className="mb-1 text-xs text-muted-foreground">{group.section}</p>{matches.map(item => <Button key={item.id} type="button" variant="ghost" className={`h-auto w-full justify-between whitespace-normal py-2 text-left ${segment.id === item.id ? 'bg-accent' : ''}`} onClick={() => { setSegment(item); setAudienceOpen(false); }}>{item.label}{segment.id === item.id && <Check className="size-4 shrink-0" />}</Button>)}</div> : null;
                })}</div><div className="min-h-0 space-y-2 overflow-y-auto pl-4"><h4 className="font-semibold">{segment.label}</h4><p>All Visitors</p><p className="text-muted-foreground">{segment.condition ? `Where ${segment.condition.subject} ${segment.condition.operator} ${segment.condition.value}` : 'No audience conditions applied.'}</p></div></div>
              </>}{custom && <Button type="button" variant="outline" disabled={!attribute.trim() || !value.trim()} onClick={() => setAudienceOpen(false)}>Done</Button>}</div>
            </div></AnimatedRuleContent>
          </section>
          <section className="space-y-3"><Label htmlFor="rollout-percentage" className="font-semibold">Rollout percentage</Label><div className="flex max-w-md items-center gap-4"><Slider aria-label="Rollout percentage" min={0} max={100} step={1} value={[traffic]} onValueChange={v => setTraffic(v[0])} /><Input id="rollout-percentage" className="w-24" type="number" min={0} max={100} required value={traffic} onChange={e => setTraffic(Number(e.target.value))} /><span>%</span></div></section>
          <section className="space-y-3"><div><h3 className="font-semibold">Gradual rollout</h3><p className="text-muted-foreground">Automate rollout/rollback based on time or metric</p></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={timeEnabled} onChange={e => setTimeEnabled(e.target.checked)} />On basis of date/time</label>
            {timeEnabled && <div className="space-y-3 rounded border p-3"><p>At launch: {traffic}%</p>{steps.map((step, i) => <div key={i} className="flex flex-wrap items-center gap-2">After <Input aria-label={`Step ${i + 1} days`} className="w-20" type="number" min={1} required value={step.afterDays} onChange={e => setSteps(steps.map((s, j) => j === i ? { ...s, afterDays: Number(e.target.value) } : s))} /> days, set rollout to <Input aria-label={`Step ${i + 1} percentage`} className="w-20" type="number" min={0} max={100} required value={step.trafficAllocation} onChange={e => setSteps(steps.map((s, j) => j === i ? { ...s, trafficAllocation: Number(e.target.value) } : s))} />%{steps.length > 1 && <Button type="button" variant="ghost" onClick={() => setSteps(steps.filter((_, j) => i !== j))}>Remove</Button>}</div>)}<Button type="button" variant="outline" onClick={() => setSteps([...steps, { afterDays: steps[steps.length - 1].afterDays + 1, trafficAllocation: 100 }])}>Add step</Button></div>}
            <label className="flex items-center gap-2"><input type="checkbox" checked={metricEnabled} onChange={e => setMetricEnabled(e.target.checked)} />On basis of metric</label>
            {metricEnabled && <div className="space-y-3">{metricConditions.map((condition, index) => <div key={index} className="grid gap-3 rounded border p-3 sm:grid-cols-2">{([
              ['Metric', 'metric'], ['Conversion rate above (%)', 'conversionRate'], ['Minimum visitors', 'visitors'], ['Set rollout to (%)', 'trafficAllocation'],
            ] as const).map(([label, field]) => <label key={field} className="space-y-1">{label}<Input required type={field === 'metric' ? 'text' : 'number'} min={0} max={field === 'conversionRate' || field === 'trafficAllocation' ? 100 : undefined} value={condition[field]} onChange={e => setMetricConditions(metricConditions.map((item, i) => i === index ? { ...item, [field]: field === 'metric' ? e.target.value : Number(e.target.value) } : item))} /></label>)}{metricConditions.length > 1 && <Button type="button" variant="ghost" onClick={() => setMetricConditions(metricConditions.filter((_, i) => i !== index))}>Remove condition</Button>}</div>)}<Button type="button" variant="outline" onClick={() => setMetricConditions([...metricConditions, { metric: '', conversionRate: 5, visitors: 500, trafficAllocation: 100 }])}>Add condition</Button></div>}
          </section>
          <section className="rounded border p-4"><Button type="button" variant="ghost" className="h-auto items-start gap-2 p-0 text-left" aria-expanded={advanced} onClick={() => setAdvanced(!advanced)}><ChevronRight className={`mt-0.5 size-4 shrink-0 transition-transform ${advanced ? 'rotate-90' : ''}`} /><span className="flex flex-col gap-0.5"><span className="leading-5">Advanced Options</span>{!advanced && <span className="whitespace-normal font-normal text-muted-foreground">Automate campaigns and Manage Salting</span>}</span></Button>
            <div hidden={!advanced} className="ml-6 mt-4 space-y-4">
              <h4 className="font-medium">Automate work flow</h4>
              <div className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-x-2">
                <input id="rollout-scheduling" type="checkbox" className="mt-0.5 size-4" checked={schedule} onChange={e => setSchedule(e.target.checked)} aria-describedby="rollout-scheduling-description" />
                <div>
                  <label htmlFor="rollout-scheduling" className="block leading-5">Enable Scheduling</label>
                  <p id="rollout-scheduling-description" className="mt-0.5 text-muted-foreground">Schedule the launch after the rule is turned on.</p>
                  {schedule && <Input className="mt-3" aria-label="Scheduled launch" type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} />}
                </div>
              </div>
              <div className="space-y-3 border-t pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="rollout-salt" className="block leading-5">Salting</Label>
                  <p id="rollout-salt-description" className="text-muted-foreground">Use a Salt value (unique string) to ensure the same user gets the same bucket assignment across rules in different flags.</p>
                </div>
                <Input id="rollout-salt" aria-describedby="rollout-salt-description" className="max-w-sm" placeholder="Enter string, for e.g. checkout_user" value={salt} onChange={e => setSalt(e.target.value)} />
              </div>
            </div>
          </section>
          {error && <p role="alert" className="text-destructive">{error}</p>}
        </div>
        <footer className="flex shrink-0 justify-end gap-3 border-t px-6 py-4"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={!name.trim() || !key.trim() || (custom && (!attribute.trim() || !value.trim()))}>{initialRule ? 'Save changes' : 'Create'}</Button></footer>
      </form>
    </SheetContent>
  </Sheet>;
}
