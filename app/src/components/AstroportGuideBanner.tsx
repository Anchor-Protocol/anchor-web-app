import { formatUToken } from '@libs/formatter';
import { fixHMR } from 'fix-hmr';
import { useCheckTerraswapLpBalance } from 'queries/checkTerraswapLpBalance';
import React from 'react';
import styled from 'styled-components';

export interface AstroportGuideBannerProps {
  className?: string;
}

function Component({ className }: AstroportGuideBannerProps) {
  const terraswapLpBalances = useCheckTerraswapLpBalance();

  if (!terraswapLpBalances) {
    return null;
  }

  return (
    <div className={className}>
      <article>
        Anchor protocol has migrated to use Astroport and new LP token staking
        contracts.
        <br />
        To use Astroport, users should go through a one-time process to migrate
        liquidity and claim unclaimed rewards.
        <br />
        To withdraw liquidity on Terraswap /Unstake LP tokens from previous
        staking contract,{' '}
        <a
          href="https://terraswap-app.anchorprotocol.com/anc-ust-lp/withdraw"
          target="_blank"
          rel="noreferrer"
        >
          click here
        </a>
        . To claim rewards earned on the previous LP staking contract,{' '}
        <a
          href="https://terraswap-app.anchorprotocol.com/claim/anc-ust-lp"
          target="_blank"
          rel="noreferrer"
        >
          click here
        </a>
        .
        <br />
        <br />
        <a
          href="https://terraswap-app.anchorprotocol.com/anc-ust-lp/withdraw"
          target="_blank"
          rel="noreferrer"
        >
          Your ANC-UST LP Balance :{' '}
          {formatUToken(terraswapLpBalances.lpBalance)}
        </a>
        ,{' '}
        <a
          href="https://terraswap-app.anchorprotocol.com/anc-ust-lp/unstake"
          target="_blank"
          rel="noreferrer"
        >
          Staked : {formatUToken(terraswapLpBalances.lpStaked)}
        </a>
        ,{' '}
        <a
          href="https://terraswap-app.anchorprotocol.com/claim/anc-ust-lp"
          target="_blank"
          rel="noreferrer"
        >
          Rewards: {formatUToken(terraswapLpBalances.lpRewards)} ANC
        </a>
      </article>
    </div>
  );
}

const StyledComponent = styled(Component)`
  background-color: #dfe196;
  color: black;
  font-size: 0.9em;

  article {
    padding: 20px;
    margin: 0 auto;
    max-width: 900px;
    text-align: center;
  }
`;

export const AstroportGuideBanner = fixHMR(StyledComponent);
