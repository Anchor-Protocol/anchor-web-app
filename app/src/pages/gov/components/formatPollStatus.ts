import { PollStatus } from '@anchor-protocol/anchor.js';

export const pollStatusLabels: Record<PollStatus, string> = {
  in_progress: 'In Progress',
  executed: 'Executed',
  passed: 'Passed',
  rejected: 'Rejected',
};
