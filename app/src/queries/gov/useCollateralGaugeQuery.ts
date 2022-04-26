import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { CW20Addr, u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import { useQuery } from 'react-query';
import { sum } from '@libs/big-math';
import { createQueryFn } from '@libs/react-query-utils';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { veANC, anchorToken } from '@anchor-protocol/types';

const rawCollateral = [
  {
    tokenAddress: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
    symbol: 'bLuna',
    name: 'Bonded Luna',
    icon: 'https://whitelist.anchorprotocol.com/logo/bLUNA.png',
    votes: Big('826789069442123') as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun',
    symbol: 'bETH',
    name: 'Bonded ETH',
    icon: 'https://whitelist.anchorprotocol.com/logo/bETH.png',
    votes: 132789069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra18zqcnl83z98tf6lly37gghm7238k7lh79u4z9a',
    symbol: 'bATOM',
    name: 'Bonded ATOM',
    icon: 'https://files.pstake.finance/logos/bAssets/bATOM.svg',
    votes: 211789069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra1z3e2e4jpk4n0xzzwlkgcfvc95pc5ldq0xcny58',
    symbol: 'wasAVAX',
    name: 'BENQI Staked AVAX (Portal)',
    icon: 'https://benqi.fi/images/assets/savax.svg',
    votes: 111189069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra12hgwnpupflfpuual532wgrxu2gjp0tcagzgx4n',
    symbol: 'MARS',
    name: 'Mars Token',
    icon: 'https://extraterra-assets.s3.us-east-2.amazonaws.com/images/SVG/MARS.svg',
    votes: 81189069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau',
    symbol: 'cLUNA',
    name: 'Prism cLUNA Token',
    icon: 'https://extraterra-assets.s3.us-east-2.amazonaws.com/images/SVG/cLUNA.svg',
    votes: 71189069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3',
    symbol: 'ASTRO',
    name: 'Astroport ASTRO Token',
    icon: 'https://extraterra-assets.s3.us-east-2.amazonaws.com/images/SVG/ASTRO.svg',
    votes: 61189069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra17wkadg0tah554r35x6wvff0y5s7ve8npcjfuhz',
    symbol: 'yLUNA',
    name: 'Prism yLUNA Token',
    icon: 'https://extraterra-assets.s3.us-east-2.amazonaws.com/images/SVG/yLUNA.svg',
    votes: 51189069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6',
    symbol: 'MIR',
    name: 'Mirror MIR Token',
    icon: 'https://extraterra-assets.s3.us-east-2.amazonaws.com/images/MIR100.png',
    votes: 41189069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2',
    symbol: 'pLUNA',
    name: 'Prism pLUNA Token',
    icon: 'https://extraterra-assets.s3.us-east-2.amazonaws.com/images/SVG/pLUNA.svg',
    votes: 31189069442123 as u<veANC<BigSource>>,
  },
  {
    tokenAddress: 'terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy',
    symbol: 'MINE',
    name: 'Pylon MINE Token',
    icon: 'https://extraterra-assets.s3.us-east-2.amazonaws.com/images/PYL100.png',
    votes: 31189069442123 as u<veANC<BigSource>>,
  },
];

export interface GaugeCollateral {
  tokenAddress: CW20Addr;
  symbol: string;
  name: string;
  icon: string;
  votes: u<veANC<BigSource>>;
  share: number;
}

interface AllGaugeAddrWasmQuery {
  allGaugeAddr: WasmQuery<
    anchorToken.gaugeController.AllGaugeAddr,
    anchorToken.gaugeController.AllGaugeAddrResponse
  >;
}

const collateralGaugeQuery = async (
  gaugeControllerContract: string,
  queryClient: QueryClient,
) => {
  const {
    allGaugeAddr: { all_gauge_addr },
  } = await wasmFetch<AllGaugeAddrWasmQuery>({
    ...queryClient,
    id: 'all-gauge-addr',
    wasmQuery: {
      allGaugeAddr: {
        contractAddress: gaugeControllerContract,
        query: {
          all_gauge_addr: {},
        },
      },
    },
  });

  console.log(all_gauge_addr);

  const totalVotes = sum(...rawCollateral.map((c) => c.votes));

  const collateral: GaugeCollateral[] = rawCollateral
    .map((collateral) => ({
      ...collateral,
      tokenAddress: collateral.tokenAddress as CW20Addr,
      share: Big(collateral.votes).div(totalVotes).toNumber(),
    }))
    .sort((a, b) => b.share - a.share);

  const collateralRecord = collateral.reduce(
    (acc, collateral) => ({
      ...acc,
      [collateral.tokenAddress]: collateral,
    }),
    {} as Record<CW20Addr, GaugeCollateral>,
  );

  return {
    collateral,
    totalVotes,
    collateralRecord,
  };
};

const collateralGaugeQueryFn = createQueryFn(collateralGaugeQuery);

export const useCollateralGaugeQuery = () => {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const gaugeControllerContract = contractAddress.anchorToken.gaugeController;

  return useQuery(
    [ANCHOR_QUERY_KEY.GAUGES, gaugeControllerContract, queryClient],
    collateralGaugeQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled: !!gaugeControllerContract,
      onError: queryErrorReporter,
    },
  );
};
