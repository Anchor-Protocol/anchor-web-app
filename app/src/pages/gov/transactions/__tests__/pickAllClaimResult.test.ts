import { uUST } from '@anchor-protocol/types';
import { TxResult } from '@anchor-protocol/wallet-provider';
import { pickAllClaimResult } from 'pages/gov/transactions/pickAllClaimResult';
import json from './fixtures/claim-all.json';

describe('pickAllClaimResult', () => {
  test('should get result', () => {
    const result = pickAllClaimResult({
      txResult: (json.txResult as unknown) as TxResult,
      txInfo: json.txInfo,
      fixedGas: 350000 as uUST<number>,
    });

    expect(result.details[0]).toEqual({
      name: 'Claimed',
      value: '758.156075 ANC',
    });
    expect(result.details[2]).toEqual({ name: 'Tx Fee', value: '0.35 UST' });
  });
});
