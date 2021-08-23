import { ANC, anchorToken, cw20 } from '@anchor-protocol/types';

export interface PollList {
  isLast: boolean;
  polls: anchorToken.gov.PollResponse[];
  govANCBalance: cw20.BalanceResponse<ANC> | undefined;
  govState: anchorToken.gov.StateResponse | undefined;
  govConfig: anchorToken.gov.ConfigResponse | undefined;
  onClick: (poll: anchorToken.gov.PollResponse) => void;
  onLoadMore: () => void;
}
