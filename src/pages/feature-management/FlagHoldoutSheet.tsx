import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Info, ChevronDown } from '@/components/icons/protoLucide';
import { FLAG_HOLDOUTS } from '@/data/flagHoldouts';
import { useVisibleFeatureFlags } from '@/store/flagRows';
import { useFlagRulesStore } from '@/store/flagRules';
import { useFlagEnvironmentsStore } from '@/store/flagEnvironments';

export default function FlagHoldoutSheet({ flagId, environment, selectedIds, onClose, onSave }: {
  flagId: string; environment: string; selectedIds: string[]; onClose: () => void; onSave: (ids: string[]) => void;
}) {
  const [draft, setDraft] = useState(selectedIds);
  const [search, setSearch] = useState('');
  const [focusedId, setFocusedId] = useState(selectedIds[0] ?? FLAG_HOLDOUTS[0].id);
  const [expandedFlags, setExpandedFlags] = useState<Record<string, boolean>>({});
  const [audienceExpanded, setAudienceExpanded] = useState(false);
  const flags = useVisibleFeatureFlags();
  const { rules } = useFlagRulesStore();
  const { enabled } = useFlagEnvironmentsStore();
  const focused = FLAG_HOLDOUTS.find(item => item.id === focusedId)!;
  const linkedIds = new Set([...focused.linkedFlagIds.filter(id => id !== flagId), ...(draft.includes(focused.id) ? [flagId] : [])]);
  const linkedFlags = flags.filter(flag => linkedIds.has(flag.id));
  const matches = FLAG_HOLDOUTS.filter(item => item.name.toLowerCase().includes(search.trim().toLowerCase()));

  return <Sheet open onOpenChange={open => { if (!open) onClose(); }}>
    <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[960px]">
      <SheetHeader className="shrink-0 border-b border-border px-6 py-6 pr-12 text-left">
        <SheetTitle className="flex flex-wrap items-center gap-3 text-xl"><img src="/feature-flags/layout/holdout.svg" alt="" className="size-6" />{selectedIds.length ? 'Manage holdout' : 'Add to Holdout'}<Badge tone="neutral">{environment}</Badge></SheetTitle>
        <SheetDescription className="sr-only">Select holdouts for this feature flag in {environment}. Changes are applied when you save.</SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
        <p className="text-sm text-muted-foreground">The current flag will be a part of the following Holdouts</p>
        <div className="flex min-h-0 flex-1 flex-col rounded border border-border">
          <div className="border-b border-border p-4"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" aria-label="Search Holdouts" placeholder="Search Holdouts" value={search} onChange={event => setSearch(event.target.value)} /></div></div>
          <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[42%_58%]">
            <div className="overflow-y-auto border-b border-border p-3 sm:border-b-0 sm:border-r">
              {(['Global', 'Selective'] as const).map(type => <section key={type} className="mb-3">
                <h3 className="flex items-center gap-2 px-2 py-3 text-xs font-semibold uppercase text-muted-foreground">{type} Holdouts<Info className="size-3.5" aria-label={`${type} holdouts`} /></h3>
                {matches.filter(item => item.type === type).map(item => <div key={item.id} className={`flex items-center gap-2 rounded px-2 py-3 ${focusedId === item.id ? 'bg-muted' : ''}`}>
                  <Checkbox aria-label={`Link ${item.name}`} checked={draft.includes(item.id)} onCheckedChange={checked => { setFocusedId(item.id); setDraft(ids => checked ? [...ids, item.id] : ids.filter(id => id !== item.id)); }} />
                  <Button variant="ghost" className="h-auto min-w-0 flex-1 justify-start whitespace-normal p-0 text-left text-sm font-normal hover:bg-transparent" aria-pressed={focusedId === item.id} onClick={() => { setFocusedId(item.id); setAudienceExpanded(false); }}>{item.name}</Button>
                  <Badge tone={item.active ? 'green' : 'amber'} className="shrink-0">{item.active ? 'Active' : 'Inactive'}</Badge>
                </div>)}
              </section>)}
              {!matches.length && <p role="status" className="p-2 text-sm text-muted-foreground">No holdouts found.</p>}
            </div>
            <div className="flex min-h-0 flex-col">
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="text-lg font-semibold">{focused.name}</h3><Button variant="link" className="h-auto p-0 text-sm" disabled title="Holdout reports are coming soon">View reports</Button></div>
                <Badge tone="neutral" className="mt-2">{focused.type}</Badge>
                <div className="my-5 space-y-3 border-t border-border pt-5 text-sm">
                  <div className="flex flex-wrap items-center gap-1"><span className="text-muted-foreground">Audience</span><Button variant="ghost" className="h-auto gap-1 p-0 font-medium" aria-expanded={audienceExpanded} onClick={() => setAudienceExpanded(value => !value)}>{focused.audience}<ChevronDown className={`size-4 ${audienceExpanded ? 'rotate-180' : ''}`} /></Button></div>
                  {audienceExpanded && <p className="rounded border border-border bg-canvas p-3 text-muted-foreground">{focused.type === 'Global' ? 'All visitors in this environment are eligible.' : 'Visitors whose country is India.'}</p>}
                  <p><span className="text-muted-foreground">Traffic Allocation</span> <strong className="font-medium">{focused.traffic}%</strong></p>
                </div>
                <Tabs defaultValue="flags">
                  <TabsList><TabsTrigger value="metrics">Metrics <span className="ml-2">1</span></TabsTrigger><TabsTrigger value="flags">Linked Flags <span className="ml-2">{linkedFlags.length}</span></TabsTrigger></TabsList>
                  <TabsContent value="metrics" className="pt-4 text-sm"><h4 className="font-medium">{focused.metric}</h4><p className="mt-2 text-muted-foreground">Primary metric</p></TabsContent>
                  <TabsContent value="flags" className="space-y-3 pt-3">
                    {!linkedFlags.length && <p className="text-sm text-muted-foreground">No linked flags. Select this holdout to add the current flag.</p>}
                    {linkedFlags.map((flag, index) => {
                      const open = expandedFlags[flag.id] ?? index === 0;
                      const flagRules = rules.filter(rule => rule.flagId === flag.id && rule.environment === environment && rule.enabled);
                      const on = enabled[`${flag.id}:${environment}`] ?? false;
                      return <div key={flag.id} className="text-sm"><Button variant="ghost" className="h-auto gap-2 p-0 text-left" aria-expanded={open} onClick={() => setExpandedFlags(values => ({ ...values, [flag.id]: !open }))}><ChevronDown className={`size-4 ${open ? 'rotate-180' : ''}`} />{flag.name}</Button>
                        {open && <div className="ml-6 mt-3 space-y-3"><p className="text-muted-foreground">Environment Summary</p><p className="flex items-center gap-2">{environment}<Badge tone={on ? 'green' : 'amber'}>{on ? 'ON' : 'OFF'}</Badge></p><p className="text-muted-foreground">This flag has enabled:</p><dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">{(['Rollout', 'Testing', 'Personalization'] as const).map(type => <div key={type} className="contents"><dt className="text-muted-foreground">{type === 'Personalization' ? 'Personalise' : type}</dt><dd>{flagRules.filter(rule => rule.type === type).length}</dd></div>)}</dl><p className="text-muted-foreground">{on ? 'This flag is exposed to visitors.' : 'This flag is not exposed to visitors.'}</p></div>}
                      </div>;
                    })}
                  </TabsContent>
                </Tabs>
              </div>
              <p className="border-t border-border p-4 text-xs text-muted-foreground">Created by Maninder Singh on 11 Dec 2025</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 justify-end gap-3 border-t border-border px-6 py-4"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(draft)}>Save</Button></div>
    </SheetContent>
  </Sheet>;
}
