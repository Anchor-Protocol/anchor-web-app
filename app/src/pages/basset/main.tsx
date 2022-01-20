import { prettifySymbol } from '@anchor-protocol/app-fns';
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
        {bAssetInfoList.map(
          ({ bAsset, custodyConfig, wormholeTokenInfo, converterConfig }) => {
            const bAssetSymbol = prettifySymbol(bAsset.symbol);
            const whAssetSymbol = prettifySymbol(
              wormholeTokenInfo.symbol,
              wormholeTokenInfo,
            );

            return (
              <AssetCard
                key={custodyConfig.collateral_token}
                to={`/basset/wh/${bAsset.symbol.toLowerCase()}`}
                title={`${bAssetSymbol}/${whAssetSymbol}`}
                bAssetIcon={<TokenIcon token="beth" />}
                originAssetIcon={<TokenIcon token="wheth" />}
                hoverText="CONVERT"
              >
                <AssetCardContentWormhole
                  bAssetTokenAddr={bAsset.collateral_token}
                  whAssetTokenAddr={converterConfig.wormhole_token_address}
                  bAssetSymbol={bAssetSymbol}
                  whAssetSymbol={whAssetSymbol}
                  rewardAddr={custodyConfig.reward_contract}
                />
              </AssetCard>
            );
          },
        )}
      </ul>
    </CenteredLayout>
  );
}

const StyledComponent = styled(Component)`
  .claimable-section {
    margin-bottom: 40px;
  }

  .message-box {
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
