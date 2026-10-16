import { useEffect, useState } from 'react';
import { Trash2, Play, X } from '@/components/icons/protoLucide';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useFeatureManagementAdmin, type ManagedEnvironment } from '@/store/featureManagementAdmin';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import WebhookSheet from './WebhookSheet';
import { AdminIcon, AdminSearch, HeaderCell, ConfirmDelete } from './AdminShared';

const SDK_OPTIONS = [
  { value: 'node', label: 'Node.js/JavaScript (2.2.2)' },
  { value: 'java', label: 'Java (2.1.1)' },
  { value: 'php-2.2.1', label: 'PHP (2.2.1)' },
  { value: 'python', label: 'Python (1.2.1)' },
  { value: 'dotnet', label: '.NET (1.2.3)' },
  { value: 'ruby', label: 'Ruby (2.1.2)' },
  { value: 'go', label: 'Go (2.3.2)' },
  { value: 'react-js', label: 'React.js (2.1.4)' },
  { value: 'java-android', label: 'Java (Android)' },
  { value: 'kotlin-android', label: 'Kotlin (Android)' },
  { value: 'swift', label: 'Swift' },
  { value: 'react-native', label: 'React Native' },
  { value: 'flutter', label: 'Flutter (2.1.2)' },
  { value: 'next-js', label: 'Next.js' },
  { value: 'react', label: 'React (2.1.3)' },
  { value: 'php-2.3.4', label: 'PHP (2.3.4)' },
];

function SdkPanel({ environment }: { environment: ManagedEnvironment }) {
  const [sdk, setSdk] = useState('node');
  const code = sdk === 'node' ? `// Import the SDK\nimport { init } from 'vwo-fme-node-sdk';\n\n// Set Wingify Account ID and SDK key along with other optional parameters\nconst options = {\n  accountId: "876976",\n  sdkKey: "${environment.sdkKey}"\n};\n\n// Initialize the SDK with configuration options\nconst vwoClient = await init(options);` : `// Import the SDK\nimport { init } from 'vwo-fme-react-native-sdk';\n\n// Set Wingify Account ID and SDK key along with other optional parameters\nconst options = {\n  accountId: "876976",\n  sdkKey: "${environment.sdkKey}"\n};\n\n// Initialize the SDK with configuration options\nconst vwoClient = await init(options);`;
  const hasExample = sdk === 'node' || sdk === 'react-native';
  return <div className={environment.sdkEnabled ? "space-y-3" : "space-y-3 text-muted-foreground"}><h3 className="text-sm font-medium">Initialize SDK</h3><div className="flex items-center gap-4"><Select value={sdk} onValueChange={setSdk}><SelectTrigger className="h-8 w-[232px] rounded-sm text-sm [&>svg]:hidden" aria-label={`SDK language for ${environment.name}`}><div className="flex min-w-0 items-center gap-1"><AdminIcon name="code" /><SelectValue /></div><AdminIcon name="chevron" /></SelectTrigger><SelectContent className="max-h-80">{SDK_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select><Badge className={environment.sdkEnabled ? "gap-1 bg-success-bg text-success-fg" : "gap-1 bg-muted text-muted-foreground"} variant="outline" role="status">{environment.sdkEnabled && <AdminIcon name="dot" />}{!environment.sdkEnabled ? 'Disabled' : environment.refreshedAt ? 'Updated just now' : 'Updated 2 min ago'}</Badge></div>
    {hasExample ? <div className="h-[280px] overflow-auto border border-border bg-background" role="region" aria-label={`${environment.name} SDK code`} tabIndex={0}><div className="flex min-w-max text-sm leading-6"><div aria-hidden="true" className={`select-none border-r border-border bg-canvas px-4 py-5 text-right font-mono ${environment.sdkEnabled ? 'text-success-fg' : 'text-muted-foreground'}`}>{code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}</div><pre className="p-5 font-sans text-base"><code>{code}</code></pre></div></div> : <div className="flex h-[280px] items-center justify-center border border-border bg-background p-5 text-sm text-muted-foreground" role="status">Initialization example for {SDK_OPTIONS.find(option => option.value === sdk)?.label} coming soon.</div>}
  </div>;
}

export default function EnvironmentsPage() {
  const { environments, saveEnvironment, removeEnvironment } = useFeatureManagementAdmin();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sdkId, setSdkId] = useState<number>();
  const sdkEnvironment = environments.find(e => e.id === sdkId);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ message: string } | null>(null);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const [disablingId, setDisablingId] = useState<number>();
  const disabling = environments.find(e => e.id === disablingId);
  const [webhookId, setWebhookId] = useState<number>();
  const webhookEnvironment = environments.find(e => e.id === webhookId);
  const [deleting, setDeleting] = useState<ManagedEnvironment>();
  const close = () => { setParams({}, { replace: true }); setName(''); setError(''); };
  const rows = environments.filter(e => `${e.name} ${e.id}`.toLowerCase().includes(search.toLowerCase()) && (status === 'all' || e.sdkEnabled === (status === 'enabled')));
  const copy = async (environment: ManagedEnvironment) => { try { await navigator.clipboard.writeText(environment.sdkKey); setNotice({ message: `${environment.name} SDK key copied.` }); } catch { setNotice({ message: 'Unable to copy. Select and copy the SDK key manually.' }); } };
  const create = () => {
    if (!name.trim() || environments.some(e => e.name.toLowerCase() === name.trim().toLowerCase())) { setError('Enter a unique environment name.'); return; }
    saveEnvironment({ id: Math.max(12342, ...environments.map(e => e.id)) + 1, name: name.trim(), sdkKey: crypto.randomUUID().replaceAll('-', ''), webhook: false, openAccess: false, sdkEnabled: true }); close();
  };
  return <TooltipProvider><div className="fm-admin"><div className="mb-6 flex flex-wrap items-center gap-4"><AdminSearch value={search} onChange={setSearch} placeholder="Search environments" /><Popover><PopoverTrigger asChild><Button variant="outline" className="h-10 gap-1.5 rounded-sm border-dashed px-3 font-normal"><AdminIcon name="plus" />{status === 'all' ? 'Add filters' : `SDK: ${status}`}</Button></PopoverTrigger><PopoverContent align="start" className="space-y-3"><Label>SDK status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All environments</SelectItem><SelectItem value="enabled">Enabled</SelectItem><SelectItem value="disabled">Disabled</SelectItem></SelectContent></Select><Button variant="ghost" onClick={() => setStatus('all')}>Clear filters</Button></PopoverContent></Popover></div>
    <div className="overflow-x-auto rounded-sm border border-border"><table className="fm-admin-table min-w-[1100px]"><colgroup><col style={{ width: '20%' }} /><col style={{ width: '21%' }} /><col style={{ width: 180 }} /><col style={{ width: '12%' }} /><col /><col style={{ width: 64 }} /></colgroup><thead><tr><HeaderCell help="Use Initialize SDK to view setup instructions for an environment.">Name</HeaderCell><HeaderCell help="The SDK key identifies this environment.">SDK Key</HeaderCell><HeaderCell help="Enable webhook notifications for this environment." info>Webhook</HeaderCell><HeaderCell help="Allow open access to this environment." info>Open Access</HeaderCell><th><span className="sr-only">SDK controls</span></th><th><span className="sr-only">Delete</span></th></tr></thead><tbody>{rows.map(e => <tr key={e.id}><td><span className={e.sdkEnabled ? "block" : "block text-muted-foreground"}>{e.name}</span><span className="block text-xs text-muted-foreground">ID: {e.id}</span></td><td><div className="flex items-center gap-2"><span className="max-w-[210px] truncate text-xs text-muted-foreground" title={e.sdkKey}>{e.sdkKey}</span><Button size="icon" variant="ghost" className="h-6 w-6 shrink-0 p-1" aria-label={`Copy ${e.name} SDK key`} onClick={() => void copy(e)}><AdminIcon name="copy" /></Button></div></td><td><div className="flex min-w-[132px] items-center gap-2"><Switch className="fm-toggle" aria-label={`${e.name} webhook`} checked={e.webhook} onCheckedChange={webhook => { saveEnvironment({ ...e, webhook }); if (webhook) setWebhookId(e.id); }} />{e.webhook && <Button variant="link" className="whitespace-nowrap text-xs font-normal" aria-label={`View webhook details for ${e.name}`} onClick={() => setWebhookId(e.id)}>View details</Button>}</div></td><td><Switch className="fm-toggle" aria-label={`${e.name} open access`} checked={e.openAccess} onCheckedChange={openAccess => saveEnvironment({ ...e, openAccess })} /></td><td><div className="flex items-center gap-2 whitespace-nowrap">
      <Button variant="outline" size="sm" className="gap-1 rounded-sm px-2 font-normal" aria-label={`Initialize SDK for ${e.name}`} onClick={() => setSdkId(e.id)}><AdminIcon name="code" />Initialize SDK</Button>
      <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="size-8 rounded-sm" aria-label={`Force refresh SDK for ${e.name}`} onClick={() => { saveEnvironment({ ...e, refreshedAt: new Date().toISOString() }); setNotice({ message: `${e.name} SDK refreshed locally.` }); }}><AdminIcon name="refresh" /></Button></TooltipTrigger><TooltipContent>Force refresh SDK</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger asChild><Button variant={e.sdkEnabled ? 'destructive' : 'outline'} size="icon" className="size-8 rounded-sm" aria-label={`${e.sdkEnabled ? 'Disable' : 'Enable'} SDK for ${e.name}`} onClick={() => { if (e.sdkEnabled) { setDisablingId(e.id); } else { saveEnvironment({ ...e, sdkEnabled: true }); setNotice({ message: `${e.name} SDK enabled.` }); } }}>{e.sdkEnabled ? <AdminIcon name="pause" /> : <Play className="size-4" />}</Button></TooltipTrigger><TooltipContent>{e.sdkEnabled ? 'Disable SDK' : 'Enable SDK'}</TooltipContent></Tooltip></div></td><td><Button variant="ghost" size="icon" aria-label={`Delete ${e.name}`} onClick={() => setDeleting(e)}><AdminIcon name="trash" /></Button></td></tr>)}{!rows.length && <tr><td colSpan={6} className="text-center text-muted-foreground">No environments match your search.</td></tr>}</tbody></table></div>
    {notice && <Card role="status" aria-live="polite" aria-atomic="true" className="fixed bottom-6 right-6 z-[60] max-w-sm shadow-lg"><CardContent className="flex items-center gap-3 px-4 py-3 text-sm"><span>{notice.message}</span><Button variant="ghost" size="icon" className="size-6 shrink-0" aria-label="Dismiss notification" onClick={() => setNotice(null)}><X className="size-4" /></Button></CardContent></Card>}
    <Sheet open={!!sdkEnvironment} onOpenChange={open => { if (!open) setSdkId(undefined); }}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[680px]">
        <SheetHeader className="shrink-0 border-b border-border px-6 py-5 pr-12 text-left"><SheetTitle>Initialize SDK for {sdkEnvironment?.name}</SheetTitle><SheetDescription>Choose your SDK and use the setup instructions for this environment.</SheetDescription></SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{sdkEnvironment && <SdkPanel key={sdkEnvironment.id} environment={sdkEnvironment} />}</div>
        <div className="flex shrink-0 justify-end border-t border-border px-6 py-4"><Button onClick={() => setSdkId(undefined)}>Done</Button></div>
      </SheetContent>
    </Sheet>
    <Dialog open={params.get('create') === '1'} onOpenChange={open => !open && close()}><DialogContent><form className="space-y-5" onSubmit={e => { e.preventDefault(); create(); }}><DialogHeader><DialogTitle>Create environment</DialogTitle><DialogDescription>Add an environment with its own SDK key.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="environment-name">Environment name</Label><Input id="environment-name" autoFocus required maxLength={80} value={name} onChange={e => setName(e.target.value)} />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div><DialogFooter><Button variant="outline" type="button" onClick={close}>Cancel</Button><Button type="submit">Create environment</Button></DialogFooter></form></DialogContent></Dialog>
    <Dialog open={Boolean(disabling)} onOpenChange={open => !open && setDisablingId(undefined)}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <div className="flex items-start gap-4">
          <Trash2 className="mt-0.5 h-6 w-6 shrink-0 text-destructive" aria-hidden="true" />
          <DialogHeader className="min-w-0 flex-1 space-y-3 text-left">
            <div className="flex flex-wrap items-center gap-2 pr-5">
              <DialogTitle>Disable SDK</DialogTitle>
              <Badge variant="secondary" className="font-normal">Environment: {disabling?.name}</Badge>
            </div>
            <DialogDescription className="text-sm leading-6">
              This action will disable VWO SDK(s) on the selected environment. Visitors will no longer see any feature rollouts, tests, or personalized experiences.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="mt-6 gap-2">
          <Button variant="ghost" autoFocus onClick={() => setDisablingId(undefined)}>Cancel</Button>
          <Button variant="destructiveInverted" onClick={() => {
            if (!disabling) return;
            saveEnvironment({ ...disabling, sdkEnabled: false });
            setNotice({ message: `${disabling.name} SDK disabled.` });
            setDisablingId(undefined);
          }}>Disable SDK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    {webhookEnvironment && <WebhookSheet key={webhookEnvironment.id} environment={webhookEnvironment} onClose={() => setWebhookId(undefined)} />}
    <ConfirmDelete name={deleting?.name} onCancel={() => setDeleting(undefined)} onConfirm={() => { if (deleting) removeEnvironment(deleting.id); setDeleting(undefined); }} />
  </div></TooltipProvider>;
}
