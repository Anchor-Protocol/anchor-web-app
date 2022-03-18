import { BorrowMarket } from '@anchor-protocol/app-fns';
import { moneyMarket } from '@anchor-protocol/types';
import { CW20TokenDisplayInfo } from '@libs/app-fns';
import { TokenDisplayInfoByAddr } from '../../utils/tokenDisplay';

type OverseerWhilelistElem = moneyMarket.overseer.WhitelistResponse['elems'][0];

export type OverseerWhitelistWithDisplay = {
  elems: Array<OverseerWhilelistElem & { tokenDisplay: CW20TokenDisplayInfo }>;
};

export type BorrowMarketWithDisplay = Omit<
  BorrowMarket,
  'overseerWhitelist'
> & {
  overseerWhitelist: OverseerWhitelistWithDisplay;
};

export type OverseerWhitelistTokenDisplay = {
  tokenDisplay: CW20TokenDisplayInfo;
};

export const withBorrowMarketTokenDisplay = (
  borrowMarket: BorrowMarket,
  tokenDisplayInfoByAddr: TokenDisplayInfoByAddr,
): BorrowMarketWithDisplay => ({
  ...borrowMarket,
  overseerWhitelist: {
    ...borrowMarket.overseerWhitelist,
    elems: borrowMarket.overseerWhitelist.elems.map((elem) => ({
      ...elem,
      tokenDisplay: tokenDisplayInfoByAddr[elem.collateral_token],
    })),
  },
});
