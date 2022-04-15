import {
  AnchorContractAddress,
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
  useNetwork,
} from '@anchor-protocol/app-provider';
import { useQuery } from 'react-query';
import { createQueryFn } from '@libs/react-query-utils';
import {
  BOMBAY_CONTRACT_ADDRESS,
  COLUMBUS_CONTRACT_ADDRESS,
  ContractAddressMap,
} from 'env';
import { CW20Addr, HumanAddr } from '@libs/types';

enum AnchorNetwork {
  Main = 'Main',
  Test = 'Test',
  Local = 'Local',
}

const getAnchorNetwork = (chainId: string): AnchorNetwork => {
  if (chainId.startsWith('local')) {
    return AnchorNetwork.Local;
  } else if (chainId.startsWith('bombay')) {
    return AnchorNetwork.Test;
  }

  return AnchorNetwork.Main;
};

const anchorContractAddressesQuery = async (
  anchorNetwork: AnchorNetwork,
): Promise<AnchorContractAddress> => {
  let addressMap =
    anchorNetwork === AnchorNetwork.Test
      ? BOMBAY_CONTRACT_ADDRESS
      : COLUMBUS_CONTRACT_ADDRESS;

  if (anchorNetwork === AnchorNetwork.Local) {
    try {
      const localAnchorAddressMap: ContractAddressMap = await fetch(
        'http://localhost:3003/',
      ).then((res) => res.json());

      console.log(localAnchorAddressMap);
    } catch (err) {
      console.error(
        'Failed to fetch contract addresses from Local Anchor',
        err,
      );
    }
  }

  return {
    bluna: {
      reward: addressMap.bLunaReward as HumanAddr,
      hub: addressMap.bLunaHub as HumanAddr,
      airdropRegistry: addressMap.anchorAirdropRegistry as HumanAddr,
      validatorsRegistry: addressMap.bLunaValidatorsRegistry as HumanAddr,
      custody: addressMap.mmCustody as HumanAddr,
    },
    moneyMarket: {
      market: addressMap.mmMarket as HumanAddr,
      overseer: addressMap.mmOverseer as HumanAddr,
      oracle: addressMap.mmOracle as HumanAddr,
      interestModel: addressMap.mmInterestModel as HumanAddr,
      distributionModel: addressMap.mmDistributionModel as HumanAddr,
    },
    liquidation: {
      liquidationContract: addressMap.mmLiquidation as HumanAddr,
      liquidationQueueContract: addressMap.mmLiquidationQueue as HumanAddr,
    },
    anchorToken: {
      gov: addressMap.gov as HumanAddr,
      staking: addressMap.staking as HumanAddr,
      community: addressMap.community as HumanAddr,
      distributor: addressMap.distributor as HumanAddr,
      investorLock: addressMap.investor_vesting as HumanAddr,
      teamLock: addressMap.team_vesting as HumanAddr,
      collector: addressMap.collector as HumanAddr,
      vesting: addressMap.vesting as HumanAddr,
    },
    terraswap: {
      factory: addressMap.terraswapFactory as HumanAddr,
      blunaLunaPair: addressMap.bLunaLunaPair as HumanAddr,
    },
    astroport: {
      generator: addressMap.astroportGenerator as HumanAddr,
      astroUstPair: addressMap.astroUstPair as HumanAddr,
      ancUstPair: addressMap.ancUstPair as HumanAddr,
    },
    cw20: {
      bLuna: addressMap.bLunaToken as CW20Addr,
      aUST: addressMap.aTerra as CW20Addr,
      ANC: addressMap.ANC as CW20Addr,
      AncUstLP: addressMap.ancUstLPToken as CW20Addr,
      bLunaLunaLP: addressMap.bLunaLunaLPToken as CW20Addr,
    },
    crossAnchor: {
      core: '' as HumanAddr,
    },
  };
};

const anchorContractAddressesQueryFn = createQueryFn(
  anchorContractAddressesQuery,
);

export function useAnchorContractAddress() {
  const { network } = useNetwork();
  const { queryErrorReporter } = useAnchorWebapp();

  const anchorNetwork = getAnchorNetwork(network.chainID);

  return useQuery(
    [ANCHOR_QUERY_KEY.ANCHOR_CONTRACT_ADDRESSES, anchorNetwork],
    anchorContractAddressesQueryFn,
    {
      refetchInterval: false,
      onError: queryErrorReporter,
    },
  );
}
