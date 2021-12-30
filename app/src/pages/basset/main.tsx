import { useBAssetInfoListQuery } from '@anchor-protocol/app-provider';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { AssetCard } from './components/AssetCard';
import { Claimable } from './components/Claimable';

export interface BAssetMainProps {
  className?: string;
}

function Component({ className }: BAssetMainProps) {
  const { data: bAssetInfoList = [] } = useBAssetInfoListQuery();

  return (
    <div className={className}>
      <Claimable />

      <hr />

      <ul>
        <AssetCard to="/basset/bluna">Luna</AssetCard>
        {bAssetInfoList.map(({ bAsset, custodyConfig }) => (
          <AssetCard
            key={custodyConfig.collateral_token}
            to={`/basset/wh/${bAsset.collateral_token}`}
          >
            {bAsset.name}
          </AssetCard>
        ))}
      </ul>
    </div>
  );
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const BAssetMain = fixHMR(StyledComponent);
