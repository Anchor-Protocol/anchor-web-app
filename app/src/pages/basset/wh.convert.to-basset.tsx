import React from 'react';
import { useBAssetInfoByTokenSymbolQuery } from '@anchor-protocol/app-provider';
import { useParams } from 'react-router-dom';
import { WhImport } from './components/WhImport';

export const WormholeConvertToBAsset = () => {
  const { tokenSymbol } = useParams();

  const { data: bAssetInfo } = useBAssetInfoByTokenSymbolQuery(tokenSymbol);

  return bAssetInfo ? <WhImport bAssetInfo={bAssetInfo} /> : <></>;
};
