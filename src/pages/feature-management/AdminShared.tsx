import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import './FeatureManagementAdmin.css';

export function AdminIcon({ name }: { name: string }) {
  return <img className="fm-admin-icon" src={`/feature-management/extensions/${name}.svg`} alt="" />;
}
export function HeaderCell({ children, help, info = false }: { children: ReactNode; help: string; info?: boolean }) {
  return <th scope="col"><span className="inline-flex items-center gap-1">{children}<TooltipProvider delayDuration={250}><Tooltip><TooltipTrigger asChild><Button variant="ghost" className="h-6 w-6 p-1" aria-label={`About ${children}`}><AdminIcon name={info ? 'info' : 'question'} /></Button></TooltipTrigger><TooltipContent>{help}</TooltipContent></Tooltip></TooltipProvider></span></th>;
}
export function AdminSearch({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return <div className="relative w-80 max-w-full"><span className="pointer-events-none absolute left-3 top-2.5"><AdminIcon name="search" /></span><Input className="h-10 rounded-sm pl-11" aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} /></div>;
}
export function ConfirmDelete({ name, onCancel, onConfirm }: { name: string | undefined; onCancel: () => void; onConfirm: () => void }) {
  return <Dialog open={Boolean(name)} onOpenChange={open => !open && onCancel()}><DialogContent><DialogHeader><DialogTitle>Delete {name}?</DialogTitle><DialogDescription>This removes it from this local workspace.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={onCancel}>Cancel</Button><Button variant="destructive" onClick={onConfirm}>Delete</Button></DialogFooter></DialogContent></Dialog>;
}
