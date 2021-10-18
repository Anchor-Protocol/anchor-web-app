import { cw20TokenInfoQuery, TokenDisplayInfo } from '@libs/app-fns';
import { QueryClient } from '@libs/query-client';
import { CW20Addr } from '@libs/types';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { AccAddress } from '@terra-money/terra.js';
import { useEffect, useState } from 'react';
import { useTokenDisplayInfosQuery } from '../queries/terra/tokenDisplayInfos';

export function useTokenSearch(
  search: string,
  network: NetworkInfo,
  queryClient: QueryClient,
): TokenDisplayInfo[] {
  const [tokenList, setTokenList] = useState<TokenDisplayInfo[]>(() => []);

  const { data: tokenDisplayInfos = [] } = useTokenDisplayInfosQuery(
    network.name,
  );

  useEffect(() => {
    if (AccAddress.validate(search)) {
      const tokenAddr: CW20Addr = search as CW20Addr;

      const found = tokenDisplayInfos.find(({ asset }) => {
        return 'token' in asset && asset.token.contract_addr === search;
      });

      if (found) {
        setTokenList([found]);
      }

      cw20TokenInfoQuery(tokenAddr, queryClient)
        .then(({ tokenInfo }) => {
          setTokenList([
            {
              protocol: tokenInfo.name,
              symbol: tokenInfo.symbol,
              asset: {
                token: {
                  contract_addr: tokenAddr,
                },
              },
              // TODO change to empty icon
              icon: 'https://assets.terra.money/icon/60/UST.png',
            },
          ]);
        })
        .catch(() => {
          setTokenList([]);
        });
    } else if (search.trim().length === 0) {
      setTokenList(tokenDisplayInfos);
    } else {
      const searchLowercase = search.toLowerCase();

      const found = tokenDisplayInfos.filter(({ symbol, protocol }) => {
        return (
          symbol.toLowerCase().indexOf(searchLowercase) > -1 ||
          protocol.toLowerCase().indexOf(searchLowercase) > -1
        );
      });

      setTokenList(found);
    }
  }, [network.name, search, queryClient, tokenDisplayInfos]);

  return tokenList;
}
