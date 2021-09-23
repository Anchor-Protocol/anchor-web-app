import { defaultMantleFetch, mantle, WasmQuery } from '@libs/mantle';
import { CW20Addr, HumanAddr, NativeDenom, terraswap } from '@libs/types';
import { TEST_MANTLE_ENDPOINT } from '@libs/webapp-fns/test-env';

type AncWasmQuery = {
  anc: WasmQuery<terraswap.factory.Pair, terraswap.factory.PairResponse>;
};

describe('queries/simulation', () => {
  test('should get pair contract', async () => {
    const { anc } = await mantle<AncWasmQuery>({
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      mantleFetch: defaultMantleFetch,
      variables: {},
      wasmQuery: {
        anc: {
          contractAddress:
            'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
          query: {
            pair: {
              asset_infos: [
                {
                  native_token: {
                    denom: 'uusd' as NativeDenom,
                  },
                },
                {
                  token: {
                    contract_addr:
                      'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc' as CW20Addr,
                  },
                },
              ],
            },
          },
        },
      },
    });

    // contract_addr is anc-ust pair
    expect(anc.contract_addr).toBe(
      'terra1wfvczps2865j0awnurk9m04u7wdmd6qv3fdnvz',
    );
  });
});
