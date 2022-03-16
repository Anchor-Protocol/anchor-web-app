import React from 'react';
import { useBAssetInfoByTokenSymbolQuery } from '@anchor-protocol/app-provider';
import { useParams } from 'react-router-dom';
import { WhExport } from './components/WhExport';

export const WormholeConvertToWBAsset = () => {
  const { tokenSymbol } = useParams();

  const { data: bAssetInfo } = useBAssetInfoByTokenSymbolQuery(tokenSymbol);

  return bAssetInfo ? <WhExport bAssetInfo={bAssetInfo} /> : <></>;
};
