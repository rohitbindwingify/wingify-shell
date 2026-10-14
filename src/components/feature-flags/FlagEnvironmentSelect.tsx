import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FLAG_ENVIRONMENTS } from '@/data/featureFlagRules';
import './FlagEnvironmentSelect.css';

export default function FlagEnvironmentSelect({ value, onValueChange, isEnabled, label = 'Flag environment' }: {
  value: string;
  onValueChange: (value: string) => void;
  isEnabled: (environment: string) => boolean;
  label?: string;
}) {
  const icon = (environment: string) => <div aria-hidden="true" className={`flag-report-environment-icon ${isEnabled(environment) ? 'text-[var(--success-fg)]' : 'text-[var(--warning-fg)]'}`} />;
  return <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger aria-label={`${label}: ${value}, flag ${isEnabled(value) ? 'on' : 'off'}`} className="flag-report-environment-trigger h-8 w-[156px] min-w-[156px] max-w-[156px] shrink-0 gap-1 rounded-sm border-0 px-3 py-1.5 text-sm shadow-none [&>span]:min-w-0 [&>span]:flex-1 [&>span]:text-left">
      {icon(value)}<SelectValue><span className="block truncate" title={value}>{value}</span></SelectValue>
    </SelectTrigger>
    <SelectContent className="w-[180px]">
      {FLAG_ENVIRONMENTS.map(environment => <SelectItem key={environment} value={environment} textValue={environment} aria-label={`${environment}, flag ${isEnabled(environment) ? 'on' : 'off'}`}><span className="flex items-center gap-2">{icon(environment)}{environment}</span></SelectItem>)}
    </SelectContent>
  </Select>;
}
