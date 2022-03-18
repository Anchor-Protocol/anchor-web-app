import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAncAncUstLpProvideTx,
  useAncPriceQuery,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { Plus } from '@anchor-protocol/icons';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatANC,
  formatANCInput,
  formatLP,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { ANC, u, UST } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { max, min } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import { isZero } from '@libs/is-zero';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { formatShareOfPool } from 'pages/gov/components/formatShareOfPool';
import { ancUstLpAncSimulation } from 'pages/trade/logics/ancUstLpAncSimulation';
import { ancUstLpUstSimulation } from 'pages/trade/logics/ancUstLpUstSimulation';
import { AncUstLpSimulation } from 'pages/trade/models/ancUstLpSimulation';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

export function AncUstLpProvide() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { availablePost, connected } = useAccount();

  const [openConfirm, confirmElement] = useConfirm();

  const fixedFee = useFixedFee();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [ancAmount, setAncAmount] = useState<ANC>('' as ANC);
  const [ustAmount, setUstAmount] = useState<UST>('' as UST);

  const [simulation, setSimulation] = useState<AncUstLpSimulation<Big> | null>(
    null,
  );

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  // ---------------------------------------------
  // transaction
  // ---------------------------------------------
  const [provide, provideResult] = useAncAncUstLpProvideTx();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const ustBalance = useMemo(() => {
    if (big(bank.tax.taxRate).lte(0)) {
      return big(bank.tokenBalances.uUST).minus(fixedFee) as u<UST<Big>>;
    }

    const txFee = min(
      max(
        big(big(bank.tokenBalances.uUST).minus(fixedFee)).div(
          big(big(1).plus(bank.tax.taxRate)).mul(bank.tax.taxRate),
        ),
        0,
      ),
      bank.tax.maxTaxUUSD,
    );

    return max(
      big(bank.tokenBalances.uUST).minus(txFee).minus(big(fixedFee).mul(3)),
      0,
    ) as u<UST<Big>>;
  }, [
    bank.tax.maxTaxUUSD,
    bank.tax.taxRate,
    bank.tokenBalances.uUST,
    fixedFee,
  ]);

  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connected],
  );

  const invalidAncAmount = useMemo(() => {
    if (ancAmount.length === 0 || !connected) return undefined;

    return big(microfy(ancAmount)).gt(bank.tokenBalances.uANC)
      ? 'Not enough assets'
      : undefined;
  }, [ancAmount, bank.tokenBalances.uANC, connected]);

  const invalidUstAmount = useMemo(() => {
    if (ustAmount.length === 0 || !connected || !simulation) return undefined;

    return big(microfy(ustAmount))
      .plus(simulation.txFee)
      .plus(fixedFee)
      .gt(bank.tokenBalances.uUST)
      ? 'Not enough assets'
      : undefined;
  }, [bank.tokenBalances.uUST, connected, fixedFee, simulation, ustAmount]);

  // FIXME anc-ust lp withdraw real tx fee is fixed_gas (simulation.txFee is no matter)
  const invalidNextTransaction = useMemo(() => {
    if (ustAmount.length === 0 || !simulation || !!invalidUstAmount) {
      return undefined;
    }

    const remainUUSD = big(bank.tokenBalances.uUST)
      .minus(microfy(ustAmount))
      .minus(simulation.txFee);

    if (remainUUSD.lt(big(fixedFee).mul(2))) {
      return 'Leaving less UST in your account may lead to insufficient transaction fees for future transactions.';
    }

    return undefined;
  }, [
    bank.tokenBalances.uUST,
    fixedFee,
    invalidUstAmount,
    simulation,
    ustAmount,
  ]);

  const updateAncAmount = useCallback(
    (nextAncAmount: string) => {
      if (!ancPrice || nextAncAmount.length === 0) {
        setAncAmount('' as ANC);
        setUstAmount('' as UST);
        setSimulation(null);
        return;
      } else if (isZero(nextAncAmount)) {
        setUstAmount('' as UST);
        setAncAmount(nextAncAmount as ANC);
        setSimulation(null);
        return;
      }

      const { ustAmount, ...nextSimulation } = ancUstLpAncSimulation(
        ancPrice,
        nextAncAmount as ANC,
        fixedFee,
        bank,
      );

      setAncAmount(nextAncAmount as ANC);
      ustAmount && setUstAmount(formatUSTInput(ustAmount));
      setSimulation(nextSimulation);
    },
    [ancPrice, bank, fixedFee],
  );

  const updateUstAmount = useCallback(
    (nextUstAmount: string) => {
      if (!ancPrice || nextUstAmount.length === 0) {
        setAncAmount('' as ANC);
        setUstAmount('' as UST);
        setSimulation(null);
        return;
      } else if (isZero(nextUstAmount)) {
        setAncAmount('' as ANC);
        setUstAmount(nextUstAmount as UST);
        setSimulation(null);
        return;
      }

      const { ancAmount, ...nextSimulation } = ancUstLpUstSimulation(
        ancPrice,
        nextUstAmount as UST,
        fixedFee,
        bank,
      );

      ancAmount && setAncAmount(formatANCInput(ancAmount));
      setUstAmount(nextUstAmount as UST);
      setSimulation(nextSimulation);
    },
    [ancPrice, bank, fixedFee],
  );

  const init = useCallback(() => {
    setAncAmount('' as ANC);
    setUstAmount('' as UST);
    setSimulation(null);
  }, []);

  const proceed = useCallback(
    async (
      //walletReady: ConnectedWallet,
      ancAmount: ANC,
      ustAmount: UST,
      txFee: u<UST>,
      confirm: ReactNode,
    ) => {
      if (!connected || !provide) {
        return;
      }

      if (confirm) {
        const userConfirm = await openConfirm({
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
        });

        if (!userConfirm) {
          return;
        }
      }

      provide({
        ancAmount,
        ustAmount,
        txFee,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connected, init, openConfirm, provide],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    provideResult?.status === StreamStatus.IN_PROGRESS ||
    provideResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={provideResult.value}
        onExit={() => {
          init();

          switch (provideResult.status) {
            case StreamStatus.IN_PROGRESS:
              provideResult.abort();
              break;
            case StreamStatus.DONE:
              provideResult.clear();
              break;
          }
        }}
      />
    );
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      {/* ANC */}
      <div className="description">
        <p>Input</p>
        <p />
      </div>

      <NumberInput
        className="amount"
        value={ancAmount}
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        placeholder="0.00"
        error={!!invalidAncAmount}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          updateAncAmount(target.value)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidAncAmount}>
        <span>{invalidAncAmount}</span>
        <span>
          ANC Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              updateAncAmount(
                formatANCInput(demicrofy(bank.tokenBalances.uANC)),
              )
            }
          >
            {formatANC(demicrofy(bank.tokenBalances.uANC))} ANC
          </span>
        </span>
      </div>

      <IconLineSeparator className="separator" Icon={Plus} />

      {/* UST */}
      <div className="description">
        <p>Input UST</p>
        <p />
      </div>

      <NumberInput
        className="amount"
        value={ustAmount}
        maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
        placeholder="0.00"
        error={!!invalidUstAmount}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          updateUstAmount(target.value)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">UST</InputAdornment>,
        }}
      />

      <div className="wallet" aria-invalid={!!invalidUstAmount}>
        <span>{invalidUstAmount}</span>
        <span>
          UST Balance:{' '}
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() =>
              updateUstAmount(
                formatUSTInput(
                  demicrofy(ustBalance ?? bank.tokenBalances.uUST),
                ),
              )
            }
          >
            {formatUST(demicrofy(ustBalance ?? bank.tokenBalances.uUST))} UST
            {/*/{' '}*/}
            {/*{formatUST(demicrofy(bank.tokenBalances.uUST))}{' '}*/}
            {/*={' '}*/}
            {/*{formatUST(demicrofy(big(bank.tokenBalances.uUST).minus(simulation?.txFee ?? 0).minus(ustBalance ?? 0) as u<UST<Big>>))}{' '}*/}
          </span>
        </span>
      </div>

      <TxFeeList className="receipt">
        {simulation && (
          <>
            <SwapListItem
              label="Pool Price"
              currencyA="UST"
              currencyB="ANC"
              initialDirection="a/b"
              exchangeRateAB={demicrofy(simulation.poolPrice)}
              formatExchangeRate={(ratio, direction) =>
                direction === 'a/b'
                  ? formatANC(ratio as ANC<Big>)
                  : formatUST(ratio as UST<Big>)
              }
            />
            <TxFeeListItem label="LP from Tx">
              {formatLP(simulation.lpFromTx)} LP
            </TxFeeListItem>
            <TxFeeListItem label="Share of Pool">
              {formatShareOfPool(simulation.shareOfPool)} %
            </TxFeeListItem>
            <TxFeeListItem label="Tx Fee">
              {formatUST(demicrofy(simulation.txFee))} UST
            </TxFeeListItem>
          </>
        )}
      </TxFeeList>

      {invalidNextTransaction && ustBalance && (
        <MessageBox style={{ marginTop: 30, marginBottom: 0 }}>
          {invalidNextTransaction}
        </MessageBox>
      )}

      {/* Submit */}
      <ViewAddressWarning>
        <ActionButton
          className="submit"
          style={
            invalidNextTransaction
              ? {
                  backgroundColor: '#c12535',
                }
              : undefined
          }
          disabled={
            !availablePost ||
            !connected ||
            !provide ||
            ancAmount.length === 0 ||
            ustAmount.length === 0 ||
            big(ancAmount).lte(0) ||
            big(ustAmount).lte(0) ||
            !simulation ||
            !!invalidTxFee ||
            !!invalidAncAmount ||
            !!invalidUstAmount
          }
          onClick={() =>
            simulation &&
            proceed(
              ancAmount,
              ustAmount,
              simulation.txFee.toFixed() as u<UST>,
              invalidNextTransaction,
            )
          }
        >
          Add Liquidity
        </ActionButton>
      </ViewAddressWarning>

      {confirmElement}
    </>
  );
}
