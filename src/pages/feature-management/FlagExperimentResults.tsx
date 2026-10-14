import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useReportData } from '@/pages/reports/reportDataContext';
import { formatNumber } from '@/pages/reports/reportMetrics';

/** Compact experiment table shares the same filtered data as the report graphs. */
export default function FlagExperimentResults({ metric }: { metric: string }) {
  const { campaign, statsFor, dataMode } = useReportData();
  const rows = campaign.report.variants.map((variant, index) => ({ ...statsFor(metric, index), name: variant.name, label: variant.label }));
  const visitors = rows.reduce((sum, row) => sum + row.visitors, 0);
  const conversions = rows.reduce((sum, row) => sum + row.conversions, 0);
  const headers = ['Variations', dataMode === 'sessions' ? 'Sessions' : 'Visitors', dataMode === 'sessions' ? 'Conversions (s)' : 'Conversions (v)', 'Conversion Rate', 'Improvement %', dataMode === 'sessions' ? 'Conversions Per Session' : 'Conversions Per Visitor'];
  return <div className="overflow-x-auto"><table className="w-full min-w-[820px] border-collapse text-sm"><caption className="sr-only">Experiment results for {metric}</caption>
    <thead className="bg-muted"><tr className="hover:bg-transparent">
      {headers.map((header, index) => <th key={header} className={`h-[42px] whitespace-nowrap px-4 text-xs font-semibold ${index ? 'text-right' : 'text-left'}`}>
        <span className="inline-flex items-center gap-1">{header}<Tooltip><TooltipTrigger asChild><button aria-label={`About ${header}`} className="inline-flex shrink-0"><img className="shrink-0" src="/feature-flags/report-layout/question.svg" alt="" /></button></TooltipTrigger><TooltipContent>{header === 'Improvement %' ? 'Change in conversion rate compared with Control.' : header === 'Conversion Rate' ? 'Conversions divided by visitors, expressed as a percentage.' : header}</TooltipContent></Tooltip></span>
      </th>)}
      <th className="w-12"><span className="sr-only">Actions</span></th>
    </tr></thead>
    <tbody>
      {[...rows, { name: 'Total', label: 'T', visitors, conversions, conversionRate: visitors ? conversions / visitors * 100 : 0, uplift: null }].map(row => <tr key={row.label} className="h-[60px] border-b border-border">
        <td className="whitespace-nowrap px-4"><span className="mr-3 inline-flex min-w-6 justify-center rounded-full bg-muted px-1 text-xs">{row.label}</span>{row.name}</td>
        <td className="px-4 text-right font-mono">{formatNumber(row.visitors)}</td>
        <td className="px-4 text-right font-mono">{formatNumber(row.conversions)}</td>
        <td className="px-4 text-right font-mono">{row.conversionRate.toFixed(2)}%</td>
        <td className="px-4 text-right font-mono">{row.uplift === null ? '–' : `${row.uplift.toFixed(1)}%`}</td>
        <td className="px-4 text-right font-mono">{row.visitors ? (row.conversions / row.visitors).toFixed(3) : '–'}</td>
        <td className="px-2"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-7" aria-label={`Actions for ${row.name}`}><img src="/feature-flags/report-layout/more.svg" alt="" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => {
          const values = [row.name, row.visitors, row.conversions, row.conversionRate.toFixed(2), row.uplift ?? '', row.visitors ? (row.conversions / row.visitors).toFixed(3) : ''];
          const csv = [headers, values].map(record => record.map(value => '"' + String(value).replaceAll('"', '""') + '"').join(',')).join('\n');
          const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
          const link = document.createElement('a'); link.href = url; link.download = 'experiment-results.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}>Download row CSV</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td>
      </tr>)}
    </tbody>
  </table></div>;
}
