import { PollStatus } from '@anchor-protocol/types/contracts/anchorToken/gov';
import { ReactNode } from 'react';

export interface StatusSpanProps {
  endsIn: Date;
  status: PollStatus;
  children: ReactNode;
}

export function PollStatusSpan({ status, endsIn, children }: StatusSpanProps) {
  return status === 'in_progress' && endsIn.getTime() < Date.now() ? (
    <s>{children}</s>
  ) : (
    <span>{children}</span>
  );
}
