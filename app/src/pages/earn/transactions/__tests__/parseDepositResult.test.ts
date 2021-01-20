import { parseDepositResult } from '../parseDepositResult';
import fixture1 from './fixtures/deposit/1.json';
import fixture2 from './fixtures/deposit/2.json';
import fixture3 from './fixtures/deposit/3.json';

function isNumberString(str: unknown): str is string {
  return typeof str === 'string' && /^[.0-9]+$/.test(str);
}

describe('parseDepositResult', () => {
  test.each([fixture1, fixture2, fixture3])(
    'should pick data from transaction result (txInfo)',
    (fixture: any) => {
      const {
        depositAmount,
        receivedAmount,
        exchangeRate,
        txFee,
        txHash,
      } = parseDepositResult(fixture);

      expect(isNumberString(depositAmount)).toBeTruthy();
      expect(isNumberString(receivedAmount)).toBeTruthy();
      expect(isNumberString(exchangeRate)).toBeTruthy();
      expect(isNumberString(txFee)).toBeTruthy();
      expect(typeof txHash).toBe('string');
    },
  );
});
