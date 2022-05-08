import {
  AnchorContractAddress,
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { useQuery } from 'react-query';
import { createQueryFn } from '@libs/react-query-utils';
import { ContractAddressMap } from 'env';
import { getAnchorContractAddress } from '@anchor-protocol/app-provider/utils/getAnchorContractAddress';

const localAnchorContractAddressesQuery = async (): Promise<
  AnchorContractAddress | undefined
> => {
  try {
    const addressMap: ContractAddressMap = await fetch(
      'http://localhost:3003/addressProvider',
    ).then((res) => res.json());

    const contractAddress = getAnchorContractAddress(addressMap);

    if (process.env.NODE_ENV === 'development') {
      const flatAddressMap = Object.entries(contractAddress).reduce(
        (acc, [namespace, addresses]) => {
          Object.entries(addresses).forEach(([key, value]) => {
            acc.push([`${namespace}.${key}`, value as string]);
          });

          return acc;
        },
        [] as [string, string][],
      );

      const missingAddresses = flatAddressMap
        .filter(([, value]) => value === undefined)
        .map(([key]) => key);

      if (missingAddresses.length > 0) {
        console.info(
          `LocalAnchor missing ${
            missingAddresses.length
          } contract addresses:\n${missingAddresses.join('\n')}`,
        );
      }
    }

    return contractAddress;
  } catch (err) {
    console.error('Failed to fetch contract addresses from Local Anchor', err);
  }
};

const localAnchorContractAddressesQueryFn = createQueryFn(
  localAnchorContractAddressesQuery,
);

interface UseLocalAnchorContractAddressQueryParams {
  enabled?: boolean;
}

export function useLocalAnchorContractAddressQuery(
  params?: UseLocalAnchorContractAddressQueryParams,
) {
  const { queryErrorReporter } = useAnchorWebapp();

  return useQuery(
    [ANCHOR_QUERY_KEY.LOCAL_ANCHOR_CONTRACT_ADDRESS],
    localAnchorContractAddressesQueryFn,
    {
      enabled: params?.enabled ?? true,
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
