import { min } from '@anchor-protocol/big-math';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
  stripUUSD,
} from '@anchor-protocol/notation';
import { uANC, uAncUstLP, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TxHashLink } from 'components/TxHashLink';
import { Bank } from 'contexts/bank';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import { AncPrice } from 'pages/gov/models/ancPrice';
import {
  Data,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
} from 'queries/txInfos';
import { createElement } from 'react';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  fixedGas: uUST<BigSource>;
  bank: Bank;
  ancPrice: AncPrice | undefined;
}

export function pickAncUstLpProvideResult({
  txInfo,
  txResult,
  fixedGas,
  bank,
  ancPrice,
}: Params): TransactionResult {
  const rawLog = pickRawLog(txInfo, 1);

  if (!rawLog) {
    throw new TxInfoParseError(txResult, txInfo, 'Undefined the RawLog');
  }

  const fromContract = pickEvent(rawLog, 'from_contract');
  const transfer = pickEvent(rawLog, 'transfer');

  if (!fromContract || !transfer) {
    throw new TxInfoParseError(
      txResult,
      txInfo,
      'Undefined the from_contract event',
    );
  }

  const depositedAnc = pickAttributeValueByKey<uANC>(fromContract, 'amount');
  const depositedUusd = pickAttributeValueByKey<string>(transfer, 'amount');
  const depositedUst = depositedUusd && stripUUSD(depositedUusd);

  const received = pickAttributeValueByKey<uAncUstLP>(fromContract, 'share');

  // TODO fixedGas + min(SimulatedUST * taxRate, maxTax)
  const simulatedUst =
    !!depositedAnc &&
    !!depositedUst &&
    !!ancPrice &&
    (big(big(depositedAnc).mul(ancPrice.ANCPrice)).plus(
      depositedUst,
    ) as uUST<Big>);
  const txFee =
    simulatedUst &&
    (big(fixedGas).plus(
      min(simulatedUst.mul(bank.tax.taxRate), bank.tax.maxTaxUUSD),
    ) as uUST<Big>);
  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      received && {
        name: 'Received',
        value: formatLP(demicrofy(received)) + ' ANC-UST-LP',
      },
      !!depositedAnc &&
        !!depositedUst && {
          name: 'Deposited',
          value:
            formatANCWithPostfixUnits(demicrofy(depositedAnc)) +
            ' ANC + ' +
            formatUSTWithPostfixUnits(demicrofy(depositedUst)) +
            ' UST',
        },
      {
        name: 'Tx Hash',
        value: createElement(TxHashLink, { txHash }),
      },
      txFee && {
        name: 'Tx Fee',
        value: formatUSTWithPostfixUnits(demicrofy(txFee)) + ' UST',
      },
    ],
  };
}
