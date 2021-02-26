import { GovConfig, Poll } from '../../queries/polls';

export interface PollList {
  polls: Poll[];
  govConfig: GovConfig | undefined;
  onClick: (poll: Poll) => void;
  onLoadMore: () => void;
}
