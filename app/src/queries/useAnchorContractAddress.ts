import {
  AnchorContractAddress,
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
  useNetwork,
} from '@anchor-protocol/app-provider';
import { useQuery } from 'react-query';
import { createQueryFn } from '@libs/react-query-utils';
import { BOMBAY_CONTRACT_ADDRESS, COLUMBUS_CONTRACT_ADDRESS } from 'env';
import { CW20Addr, HumanAddr } from '@libs/types';
import { AnchorNetwork } from '@anchor-protocol/types';
import { getAnchorNetwork } from 'utils/getAnchorNetwork';

const anchorContractAddressesQuery = async (
  anchorNetwork: AnchorNetwork,
): Promise<AnchorContractAddress> => {
  let addressMap =
    anchorNetwork === AnchorNetwork.Test
      ? BOMBAY_CONTRACT_ADDRESS
      : COLUMBUS_CONTRACT_ADDRESS;

  if (anchorNetwork === AnchorNetwork.Local) {
    try {
      addressMap = await fetch('http://localhost:3003/').then((res) =>
        res.json(),
      );
      console.log(addressMap);
    } catch (err) {
      console.error(
        'Failed to fetch contract addresses from Local Anchor',
        err,
      );
    }
  }

  const contractAddress = {
    bluna: {
      reward: addressMap.bLunaReward as HumanAddr,
      hub: addressMap.bLunaHub as HumanAddr,
      airdropRegistry: addressMap.anchorAirdropRegistry as HumanAddr,
      validatorsRegistry: addressMap.bLunaValidatorsRegistry as HumanAddr,
      custody: addressMap.mmCustody as HumanAddr,
    },
    moneyMarket: {
      market: addressMap.moneymarketMarket as HumanAddr,
      overseer: addressMap.moneymarketOverseer as HumanAddr,
      oracle: addressMap.moneymarketOracle as HumanAddr,
      interestModel: addressMap.moneymarketInterestModel as HumanAddr,
      distributionModel: addressMap.moneymarketDistributionModel as HumanAddr,
    },
    liquidation: {
      liquidationContract: addressMap.moneymarketLiquidation as HumanAddr,
      liquidationQueueContract: addressMap.mmLiquidationQueue as HumanAddr,
    },
    anchorToken: {
      gov: addressMap.anchorGov as HumanAddr,
      staking: addressMap.anchorStaking as HumanAddr,
      community: addressMap.anchorCommunity as HumanAddr,
      distributor: addressMap.anchorDistributor as HumanAddr,
      investorLock: addressMap.investor_vesting as HumanAddr,
      teamLock: addressMap.team_vesting as HumanAddr,
      collector: addressMap.anchorCollector as HumanAddr,
      vesting: addressMap.anchorVesting as HumanAddr,
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
      ANC: addressMap.anchorToken as CW20Addr,
      AncUstLP: addressMap.anchorLpToken as CW20Addr,
      bLunaLunaLP: addressMap.bLunaLunaLPToken as CW20Addr,
    },
    crossAnchor: {
      core: '' as HumanAddr,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    const flatAddressMap = Object.entries(contractAddress).reduce(
      (acc, [namespace, addresses]) => {
        Object.entries(addresses).forEach(([key, value]) => {
          acc.push([`${namespace}.${key}`, value]);
        });

        return acc;
      },
      [] as [string, string][],
    );

    const missingAddresses = flatAddressMap
      .filter(([, value]) => value === undefined)
      .map(([key]) => key);

    console.info(
      `${anchorNetwork} network missing ${
        missingAddresses.length
      } contract addresses:\n${missingAddresses.join('\n')}`,
    );

    if (anchorNetwork === AnchorNetwork.Local) {
      const usedAddresses = new Set(
        flatAddressMap
          .map(([, value]) => value)
          .filter((value) => value !== undefined),
      );

      const unusedLocalAnchorAddresses = Object.entries(addressMap)
        .filter(([, value]) => !usedAddresses.has(value))
        .map(([key]) => key);

      console.info(
        `The app doesn't use ${
          unusedLocalAnchorAddresses.length
        } LocalAnchor contract addresses:\n${unusedLocalAnchorAddresses.join(
          '\n',
        )}`,
      );
    }
  }

  return contractAddress;
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

export const unusedLocalAnchorAddresses = {
  anchorBassetHub: 'terra1gps62zd7ttn7uzzduhfkn5etud7jay42ms5y8u',
  anchorBassetReward: 'terra159dhrc880ygvfzqtwuuvsu0lga8t4hcctmhxau',
  anchorBassetToken: 'terra1e6csvfgz3msv3swc8l9dm7a9jlyw3nusyklrgl',
  anchorBassetLpToken: 'terra1e4qle50qclz78wx4ytst3qphaf2p59g2u3375a',
  anchorBassetUstPair: 'terra148txkp0sq9ggwflem2j9xnza5a037s4cuzajj5',
  anchorBethReward: 'terra1nrv47252c7hsvs26kwyc90vuy2wp3mk3updx9g',
  anchorBethToken: 'terra1gw9aemqacvktve57euldxavn4p53kstumwvgs8',
  anchorBethConverter: 'terra1pw24d9wtuaneac4ueeauurnwzetpyry6vkxqql',
  anchorAirdrop: 'terra1h54q2futvvzy2lg6ev9r3ml8zfd6x8n8tw5fml',
  moneymarketCustodyBluna: 'terra1mupxjcz8ggjw985h45gj9q407ew4zp59nvzvsk',
};
