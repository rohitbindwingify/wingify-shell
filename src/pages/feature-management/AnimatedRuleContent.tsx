import type { ReactNode } from 'react';

export default function AnimatedRuleContent({ open, children, id }: { open: boolean; children: ReactNode; id?: string }) {
  return <div id={id} className="flag-rule-collapse" data-open={open} aria-hidden={!open} inert={!open}>
    <div className="flag-rule-collapse-inner">{children}</div>
  </div>;
}
