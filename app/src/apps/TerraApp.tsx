import { WalletControllerChainOptions } from '@terra-money/wallet-provider';
import { AstroportGuideBanner } from 'components/AstroportGuideBanner';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Airdrop } from 'pages/airdrop';
import { Claim as AncVestingClaim } from 'pages/anc/vesting';
import { BlunaConvert, BLunaMint, BLunaBurn } from 'pages/basset/bluna.convert';
import { BlunaWithdraw } from 'pages/basset/bluna.withdraw';
import { BAssetClaim } from 'pages/basset/claim';
import { BAssetMain } from 'pages/basset/main';
import { WormholeConvert } from 'pages/basset/wh.convert';
import { WormholeConvertToBAsset } from 'pages/basset/wh.convert.to-basset';
import { WormholeConvertToWBAsset } from 'pages/basset/wh.convert.to-wbasset';
import { Borrow } from 'pages/borrow';
import { Dashboard } from 'pages/dashboard';
import { Earn } from 'pages/earn';
import { GovernanceMain } from 'pages/gov/main';
import { PollCreate } from 'pages/gov/poll.create';
import { PollCreateModifyANCDistribution } from 'pages/gov/poll.create.modify-anc-distribution';
import { PollCreateModifyBorrowInterest } from 'pages/gov/poll.create.modify-borrow-interest';
import { PollCreateModifyCollateralAttribute } from 'pages/gov/poll.create.modify-collateral-attribute';
import { PollCreateModifyMarketParameters } from 'pages/gov/poll.create.modify-market-parameters';
import { PollCreateRegisterCollateralAttributes } from 'pages/gov/poll.create.register-collateral-attributes';
import { PollCreateSpendCommunityPool } from 'pages/gov/poll.create.spend-community-pool';
import { PollCreateTextProposal } from 'pages/gov/poll.create.text-proposal';
import { PollDetail } from 'pages/gov/poll.detail';
import { Mypage } from 'pages/mypage';
import { TermsOfService } from 'pages/terms';
import { ClaimAll } from 'pages/trade/claim.all';
import { ClaimAncUstLp } from 'pages/trade/claim.anc-ust-lp';
import { ClaimUstBorrow } from 'pages/trade/claim.ust-borrow';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  ustBorrowPathname,
} from 'pages/trade/env';
import { RewardsAncGovernance } from 'pages/trade/rewards.anc-governance';
import { RewardsAncUstLp } from 'pages/trade/rewards.anc-ust-lp';
import { Trade } from 'pages/trade/trade';
import { TerraAppProviders } from 'providers/terra/TerraAppProviders';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import '../configurations/chartjs';

type TerraAppProps = {
  chainOptions: WalletControllerChainOptions | null;
};

export function TerraApp({ chainOptions }: TerraAppProps) {
  return (
    chainOptions && (
      <TerraAppProviders {...chainOptions}>
        <div>
          <GlobalStyle />
          <Header />
          <AstroportGuideBanner />
          <Routes>
            <Route index={true} element={<Dashboard />} />

            <Route path="/earn" element={<Earn />} />

            <Route path="/borrow" element={<Borrow />} />

            <Route path="/basset" element={<BAssetMain />} />

            <Route path="/basset/bluna" element={<BlunaConvert />}>
              <Route path="" element={<Navigate to="mint" />} />
              <Route path="mint" element={<BLunaMint />} />
              <Route path="burn" element={<BLunaBurn />} />
              <Route path="*" element={<Navigate to="mint" />} />
            </Route>

            <Route path="/basset/withdraw" element={<BlunaWithdraw />} />

            <Route path="/basset/claim" element={<BAssetClaim />} />

            <Route path="/basset/wh/:tokenSymbol" element={<WormholeConvert />}>
              <Route path="" element={<Navigate to="to-basset" />} />
              <Route path="to-basset" element={<WormholeConvertToBAsset />} />
              <Route path="to-wbasset" element={<WormholeConvertToWBAsset />} />
              <Route path="*" element={<Navigate to="to-basset" />} />
            </Route>

            <Route path="/airdrop" element={<Airdrop />} />

            <Route path={`/anc/vesting/claim`} element={<AncVestingClaim />} />

            <Route path={`/gov/`} element={<GovernanceMain />} />

            <Route path={`/poll/create`} element={<PollCreate />} />
            <Route
              path={`/poll/create/modify-anc-distribution`}
              element={<PollCreateModifyANCDistribution />}
            />
            <Route
              path={`/poll/create/modify-borrow-interest`}
              element={<PollCreateModifyBorrowInterest />}
            />
            <Route
              path={`/poll/create/modify-collateral-attribute`}
              element={<PollCreateModifyCollateralAttribute />}
            />
            <Route
              path={`/poll/create/modify-market-parameters`}
              element={<PollCreateModifyMarketParameters />}
            />
            <Route
              path={`/poll/create/spend-community-pool`}
              element={<PollCreateSpendCommunityPool />}
            />
            <Route
              path={`/poll/create/text-proposal`}
              element={<PollCreateTextProposal />}
            />
            <Route
              path={`/poll/create/register-collateral-attributes`}
              element={<PollCreateRegisterCollateralAttributes />}
            />
            <Route path={`/poll/:id`} element={<PollDetail />} />

            <Route path={`/trade/*`} element={<Trade />} />

            <Route
              path={`/${ancUstLpPathname}/*`}
              element={<RewardsAncUstLp />}
            />

            <Route
              path={`/${ancGovernancePathname}/*`}
              element={<RewardsAncGovernance />}
            />
            <Route path={`/claim/all`} element={<ClaimAll />} />
            <Route
              path={`/claim/${ancUstLpPathname}`}
              element={<ClaimAncUstLp />}
            />
            <Route
              path={`/claim/${ustBorrowPathname}`}
              element={<ClaimUstBorrow />}
            />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/terms" element={<TermsOfService />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </TerraAppProviders>
    )
  );
}
