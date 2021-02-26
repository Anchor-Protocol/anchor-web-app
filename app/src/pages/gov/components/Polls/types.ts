import { Poll } from '../../queries/polls';

export interface PollList {
  polls: Poll[];
  onClick: (poll: Poll) => void;
}
