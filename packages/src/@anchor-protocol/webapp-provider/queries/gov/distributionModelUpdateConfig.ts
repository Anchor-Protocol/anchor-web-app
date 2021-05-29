import { HumanAddr } from '@anchor-protocol/types';
import {
  GovDistributionModelUpdateConfigData,
  govDistributionModelUpdateConfigQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, distributionModelContract],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr]>) => {
  return govDistributionModelUpdateConfigQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      distributionModelContract,
      distributionModelConfigQuery: {
        config: {},
      },
    },
  });
};

export function useGovDistributionModelUpdateConfigQuery(): UseQueryResult<
  GovDistributionModelUpdateConfigData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

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
    },
  );

  return result;
}
