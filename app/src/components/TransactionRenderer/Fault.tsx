import { Fault as FaultResult } from '@anchor-protocol/broadcastable-operation';
import React from 'react';

export interface FaultProps {
  result: FaultResult<unknown[]>;
}

export function Fault({ result }: FaultProps) {
  return (
    <div>
      <h2>Failure</h2>
      <pre>{String(result.error)}</pre>
    </div>
  );
}
