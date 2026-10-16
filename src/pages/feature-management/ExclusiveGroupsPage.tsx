import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useFeatureManagementAdmin, type ExclusiveGroup } from '@/store/featureManagementAdmin';
import { AdminIcon, AdminSearch, HeaderCell, ConfirmDelete } from './AdminShared';

export default function ExclusiveGroupsPage() {
  const { groups, saveGroup, removeGroup } = useFeatureManagementAdmin();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [creator, setCreator] = useState('all');
  const [editing, setEditing] = useState<ExclusiveGroup>();
  const [deleting, setDeleting] = useState<ExclusiveGroup>();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const creating = params.get('create') === '1';
  const close = () => { setEditing(undefined); setName(''); setError(''); setParams({}, { replace: true }); };
  const rows = groups.filter(g => `${g.name} ${g.id}`.toLowerCase().includes(search.toLowerCase()) && (creator === 'all' || g.creator === creator));
  const save = () => {
    const nextName = name.trim();
    if (!nextName || groups.some(g => g.name.toLowerCase() === nextName.toLowerCase() && g.id !== editing?.id)) { setError('Enter a unique group name.'); return; }
    saveGroup({ id: editing?.id ?? Math.max(0, ...groups.map(g => g.id)) + 1, name: nextName, campaigns: editing?.campaigns ?? 0, creator: editing?.creator ?? 'John Doe', modified: new Date().toISOString() });
    close();
  };
  return <div className="fm-admin">
    <Tabs value="table" className="mb-6"><TabsList variant="underline" className="w-full"><TabsTrigger value="table" className="h-8 py-1">Table view</TabsTrigger></TabsList></Tabs>
    <div className="mb-6 flex flex-wrap items-center gap-4"><AdminSearch value={search} onChange={setSearch} placeholder="Search groups" />
      <Popover><PopoverTrigger asChild><Button variant="outline" className="h-10 gap-1.5 rounded-sm border-dashed px-3 font-normal"><AdminIcon name="plus" />{creator === 'all' ? 'Add filters' : 'Created by: ' + creator}</Button></PopoverTrigger><PopoverContent align="start" className="space-y-3"><Label>Created by</Label><Select value={creator} onValueChange={setCreator}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All creators</SelectItem>{[...new Set(groups.map(g => g.creator))].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><Button variant="ghost" onClick={() => setCreator('all')}>Clear filters</Button></PopoverContent></Popover>
    </div>
    <div className="overflow-x-auto rounded-md border border-border shadow-sm"><table className="fm-admin-table min-w-[900px]"><thead><tr>
      <HeaderCell help="The unique identifier for this group." info>Group ID</HeaderCell><HeaderCell help="Experiments in a group have mutually exclusive audiences.">Name</HeaderCell><HeaderCell help="Number of campaigns assigned to the group.">No. of Campaigns</HeaderCell><HeaderCell help="The most recent change to this group.">Last modified on</HeaderCell><HeaderCell help="The person who created this group.">Created by</HeaderCell><th><span className="sr-only">Actions</span></th>
    </tr></thead><tbody>{rows.map(g => <tr key={g.id}><td className="text-muted-foreground">{g.id}</td><td>{g.name}</td><td className="text-muted-foreground">{g.campaigns}</td><td className="whitespace-nowrap font-mono text-xs">{new Date(g.modified).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</td><td className="text-muted-foreground">{g.creator}</td><td><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${g.name}`}><AdminIcon name="more" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => { setEditing(g); setName(g.name); }}>Rename group</DropdownMenuItem><DropdownMenuItem onSelect={() => setDeleting(g)}>Delete group</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td></tr>)}{!rows.length && <tr><td colSpan={6} className="text-center text-muted-foreground">No groups match your search.</td></tr>}</tbody></table></div>
    <Dialog open={creating || Boolean(editing)} onOpenChange={open => !open && close()}><DialogContent><form onSubmit={e => { e.preventDefault(); save(); }} className="space-y-5"><DialogHeader><DialogTitle>{editing ? 'Rename group' : 'Create mutually exclusive group'}</DialogTitle><DialogDescription>Group experiments to keep their audiences mutually exclusive.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="group-name">Group name</Label><Input id="group-name" autoFocus value={name} onChange={e => setName(e.target.value)} required maxLength={120} />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div><DialogFooter><Button type="button" variant="outline" onClick={close}>Cancel</Button><Button type="submit">{editing ? 'Save changes' : 'Create group'}</Button></DialogFooter></form></DialogContent></Dialog>
    <ConfirmDelete name={deleting?.name} onCancel={() => setDeleting(undefined)} onConfirm={() => { if (deleting) removeGroup(deleting.id); setDeleting(undefined); }} />
  </div>;
}
