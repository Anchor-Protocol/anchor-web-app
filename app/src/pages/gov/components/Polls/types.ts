import { anchorToken } from '@anchor-protocol/types';

export interface PollList {
  polls: anchorToken.gov.PollResponse[];
  govConfig: anchorToken.gov.ConfigResponse | undefined;
  onClick: (poll: anchorToken.gov.PollResponse) => void;
  onLoadMore: () => void;
}
