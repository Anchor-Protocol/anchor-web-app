import { useBAssetInfoListQuery } from '@anchor-protocol/app-provider';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { links } from 'env';
import { fixHMR } from 'fix-hmr';
import { AssetCardContentWormhole } from 'pages/basset/components/AssetCardContentWormhole';
import React from 'react';
import styled from 'styled-components';
import { AssetCard } from './components/AssetCard';
import { AssetCardContentBluna } from './components/AssetCardContentBluna';
import { Claimable } from './components/Claimable';
import { ReactComponent as InfoIcon } from './assets/info.svg';

export interface BAssetMainProps {
  className?: string;
}

function Component({ className }: BAssetMainProps) {
  const { data: bAssetInfoList = [] } = useBAssetInfoListQuery();

  return (
    <CenteredLayout className={className} maxWidth={1440}>
      <TitleContainer>
        <PageTitle title="bASSET" docs={links.docs.bond} />
      </TitleContainer>

      <MessageBox
        className="message-box"
        icon={<InfoIcon />}
        variant="highlight"
        textAlign="left"
        level="info"
        hide={{ id: 'basset_transfer', period: 1000 * 60 * 60 * 24 * 7 }}
      >
        bAssets that have been transferred to Terra through Wormhole (webETH)
        must go through the convert operation to be used as collateral on
        Anchor.
      </MessageBox>

      <Claimable className="claimable-section" />

      <ul className="asset-list">
        <AssetCard
          to="/basset/bluna"
          title="LUNA/bLUNA"
          bAssetIcon={<TokenIcon token="bluna" />}
          originAssetIcon={<TokenIcon token="luna" />}
          hoverText="MINT & BURN"
        >
          <AssetCardContentBluna />
        </AssetCard>
        {bAssetInfoList
          .filter((asset) => asset.wormholeTokenInfo !== undefined)
          .map(({ bAsset, custodyConfig, converterConfig, tokenDisplay }) => {
            return (
              <AssetCard
                key={custodyConfig.collateral_token}
                to={`/basset/wh/${bAsset.symbol.toLowerCase()}`}
                title={`${tokenDisplay.anchor.symbol}/${tokenDisplay.wormhole.symbol}`}
                bAssetIcon={<TokenIcon token="beth" />}
                originAssetIcon={
                  <TokenIcon
                    symbol={tokenDisplay.anchor?.symbol}
                    path={tokenDisplay.anchor?.icon}
                  />
                }
                hoverText="CONVERT"
              >
                <AssetCardContentWormhole
                  bAssetTokenAddr={bAsset.collateral_token}
                  whAssetTokenAddr={converterConfig.wormhole_token_address}
                  bAssetSymbol={tokenDisplay.anchor.symbol}
                  whAssetSymbol={tokenDisplay.wormhole.symbol}
                  rewardAddr={custodyConfig.reward_contract}
                />
              </AssetCard>
            );
          })}
      </ul>
    </CenteredLayout>
  );
}

const StyledComponent = styled(Component)`
  .claimable-section {
    margin-bottom: 40px;
  }

  .message-box {
    font-size: 13px;
    margin: 20px 0 20px 0;
  }

  .asset-list {
    list-style: none;
    padding: 0;

    display: flex;
    gap: 40px;

    > li {
      width: 330px;
      height: 436px;
    }
  }

  @media (max-width: 800px) {
    .asset-list {
      flex-direction: column;
      gap: 20px;

      > li {
        width: 100%;
        height: 380px;
      }
    }
  }
`;

export const BAssetMain = fixHMR(StyledComponent);
