import { anchorToken } from '@anchor-protocol/types';
import React, { ReactNode } from 'react';
import { useTheme } from 'styled-components';

export interface StatusSpanProps {
  endsIn: Date;
  status: anchorToken.gov.PollStatus;
  children: ReactNode;
}

export function PollStatusSpan({ status, endsIn, children }: StatusSpanProps) {
  const theme = useTheme();

  return status === 'in_progress' && endsIn.getTime() < Date.now() ? (
    <s>{children}</s>
  ) : (
    <span
      style={
        status === 'rejected'
          ? { color: theme.colors.negative }
          : status === 'passed'
          ? { color: theme.colors.positive }
          : undefined
      }
    >
      {children}
    </span>
  );
}
