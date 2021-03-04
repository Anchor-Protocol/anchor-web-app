import { anchorToken, cw20, uANC } from '@anchor-protocol/types';

export interface PollList {
  polls: anchorToken.gov.PollResponse[];
  govANCBalance: cw20.BalanceResponse<uANC> | undefined;
  govState: anchorToken.gov.StateResponse | undefined;
  govConfig: anchorToken.gov.ConfigResponse | undefined;
  onClick: (poll: anchorToken.gov.PollResponse) => void;
  onLoadMore: () => void;
}
