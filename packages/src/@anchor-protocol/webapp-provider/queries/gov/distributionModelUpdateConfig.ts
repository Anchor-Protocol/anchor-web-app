import { HumanAddr } from '@anchor-protocol/types';
import {
  GovDistributionModelUpdateConfig,
  govDistributionModelUpdateConfigQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    distributionModelContract: HumanAddr,
  ) => {
    return govDistributionModelUpdateConfigQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        distributionModelConfig: {
          contractAddress: distributionModelContract,
          query: {
            config: {},
          },
        },
      },
    });
  },
);

export function useGovDistributionModelUpdateConfigQuery(): UseQueryResult<
  GovDistributionModelUpdateConfig | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.GOV_DISTRIBUTION_MODEL_UPDATE_CONFIG,

      mantleEndpoint,
      mantleFetch,
      moneyMarket.distributionModel,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
