import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { useFeatureManagementAdmin, type ManagedEnvironment } from '@/store/featureManagementAdmin';
import { AdminIcon } from './AdminShared';

export default function WebhookSheet({ environment, onClose }: { environment: ManagedEnvironment; onClose: () => void }) {
  const [url, setUrl] = useState(environment.webhookUrl ?? '');
  const [secret, setSecret] = useState(() => environment.webhookSecret ?? crypto.randomUUID().replaceAll('-', ''));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const copy = async (value: string, label: string) => {
    try { await navigator.clipboard.writeText(value); setNotice(`${label} copied.`); }
    catch { setNotice('Unable to copy. Select and copy the value manually.'); }
  };
  const save = () => {
    const state = useFeatureManagementAdmin.getState();
    const current = state.environments.find(e => e.id === environment.id);
    if (!current) { onClose(); return; }
    try { const parsed = new URL(url.trim()); if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error(); }
    catch { setError('Enter a valid HTTP or HTTPS webhook URL.'); return; }
    state.saveEnvironment({ ...current, webhookUrl: url.trim(), webhookSecret: secret });
    onClose();
  };
  return <Sheet open onOpenChange={open => !open && onClose()}><SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-[680px]">
    <SheetHeader className="border-b border-border px-6 py-5 text-left"><SheetTitle>Enable webhook for {environment.name}</SheetTitle><SheetDescription>Configure webhook notifications for {environment.name}.</SheetDescription></SheetHeader>
    <form className="flex min-h-0 flex-1 flex-col" onSubmit={e => { e.preventDefault(); save(); }}>
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="space-y-2"><Label htmlFor="webhook-url">Webhook URL</Label><Input id="webhook-url" placeholder="https://" value={url} onChange={e => setUrl(e.target.value)} aria-describedby="webhook-retries" /><p id="webhook-retries" className="text-sm leading-6 text-muted-foreground">In case the webhook URL is down (or we receive a non 200 response for the POST request), then the webhook would be retried for the next 1 hour after every 1–2 seconds.</p></div>
          <div className="space-y-2"><div className="flex items-center justify-between gap-2"><Label htmlFor="webhook-secret">Secret Key</Label><Button type="button" variant="link" className="gap-2 text-sm" onClick={() => { setSecret(crypto.randomUUID().replaceAll('-', '')); setNotice('New secret key generated. Save changes to apply it.'); }}><AdminIcon name="refresh" />Regenerate Key</Button></div><div className="flex"><Input id="webhook-secret" readOnly value={secret} className="min-w-0 rounded-r-none bg-muted" /><Button type="button" variant="outline" className="shrink-0 gap-2 rounded-l-none" onClick={() => void copy(secret, 'Secret key')}><AdminIcon name="copy" />Copy</Button></div><p className="text-sm leading-6 text-muted-foreground">Secret Key will be sent in the <strong>x-vwo-auth</strong> header of the webhook request.</p></div>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<p role="status" className="mt-4 text-sm text-muted-foreground">{notice}</p>
      </div>
      <SheetFooter className="border-t border-border p-4"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">Save changes</Button></SheetFooter>
    </form>
  </SheetContent></Sheet>;
}
