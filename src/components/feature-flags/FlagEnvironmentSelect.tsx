import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FLAG_ENVIRONMENTS } from '@/data/featureFlagRules';
import './FlagEnvironmentSelect.css';

export default function FlagEnvironmentSelect({ value, onValueChange, isEnabled, label = 'Flag environment', reportStyle = false }: {
  value: string;
  onValueChange: (value: string) => void;
  isEnabled: (environment: string) => boolean;
  label?: string;
  reportStyle?: boolean;
}) {
  const icon = (environment: string) => <div aria-hidden="true" className={`flag-report-environment-icon ${isEnabled(environment) ? 'text-[var(--success-fg)]' : 'text-[var(--warning-fg)]'}`} />;
  return <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger aria-label={`${label}: ${value}, flag ${isEnabled(value) ? 'on' : 'off'}`} className={`${reportStyle ? 'flag-report-environment-outline' : 'flag-report-environment-trigger'} h-8 w-[156px] min-w-[156px] max-w-[156px] shrink-0 gap-1 rounded-sm border-0 px-3 py-1.5 text-sm shadow-none [&>span]:min-w-0 [&>span]:flex-1 [&>span]:text-left`}>
      {reportStyle ? <div aria-hidden="true" className={`size-2 shrink-0 rounded-full ${isEnabled(value) ? 'bg-[var(--success-fg)]' : 'bg-[var(--warning-fg)]'}`} /> : icon(value)}<SelectValue><span className="block truncate" title={value}>{value}</span></SelectValue>
    </SelectTrigger>
    <SelectContent className={reportStyle ? "w-[208px]" : "w-[180px]"}>
      {FLAG_ENVIRONMENTS.map(environment => <SelectItem key={environment} value={environment} textValue={environment} aria-label={`${environment}, flag ${isEnabled(environment) ? 'on' : 'off'}`} className={reportStyle ? "pr-3 [&>span:first-child]:hidden [&>span:last-child]:w-full data-[state=checked]:bg-[var(--semantic-bg-selected-hover)]" : undefined}>{reportStyle ? <span className="flex w-full items-center justify-between gap-6"><span>{environment}</span><span className={`text-xs ${isEnabled(environment) ? 'text-[var(--success-fg)]' : 'text-[var(--warning-fg)]'}`}>{isEnabled(environment) ? 'ON' : 'OFF'}</span></span> : <span className="flex items-center gap-2">{icon(environment)}{environment}</span>}</SelectItem>)}
    </SelectContent>
  </Select>;
}
