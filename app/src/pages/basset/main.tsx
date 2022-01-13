import { prettifySymbol } from '@anchor-protocol/app-fns';
import { useBAssetInfoListQuery } from '@anchor-protocol/app-provider';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
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

      <Claimable className="claimable-section" />

      <ul className="asset-list">
        <AssetCard
          to="/basset/bluna"
          title="LUNA/bLUNA"
          bAssetIcon={<TokenIcon token="bluna" />}
          originAssetIcon={<TokenIcon token="luna" />}
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
                to={`/basset/wh/${bAsset.collateral_token}`}
                title={`${bAssetSymbol}/${whAssetSymbol}`}
                bAssetIcon={<TokenIcon token="beth" />}
                originAssetIcon={<TokenIcon token="wheth" />}
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
