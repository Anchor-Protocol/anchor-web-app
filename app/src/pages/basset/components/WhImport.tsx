import {
  BAssetInfo,
  prettifySymbol,
  validateTxFee,
} from '@anchor-protocol/app-fns';
import {
  useAnchorBank,
  useBAssetImportTx,
} from '@anchor-protocol/app-provider';
import {
  formatUST,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance, useFixedFee } from '@libs/app-provider';
import { demicrofy, formatUInput, formatUToken } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { SwapListItem, TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export interface WhImportProps {
  bAssetInfo: BAssetInfo;
}

export function WhImport({ bAssetInfo }: WhImportProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const [convert, convertResult] = useBAssetImportTx(
    bAssetInfo.bAsset.collateral_token,
  );

  const fixedFee = useFixedFee();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [amount, setAmount] = useState<bAsset>('' as bAsset);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  const balance = useCW20Balance<bAsset>(
    bAssetInfo.converterConfig.wormhole_token_address ?? undefined,
    connectedWallet?.walletAddress,
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank.tokenBalances.uUST, fixedFee),
    [bank, fixedFee, connectedWallet],
  );

  const invalidAmount = useMemo(() => {
    return !!connectedWallet &&
      amount.length > 0 &&
      big(amount).gt(demicrofy(balance))
      ? 'Not enough assets'
      : undefined;
  }, [amount, balance, connectedWallet]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const init = useCallback(() => {
    setAmount('' as bAsset);
  }, []);

  const proceed = useCallback(
    (amount: bAsset) => {
      if (!connectedWallet || !convert) {
        return;
      }

      convert({
        amount,
        onTxSucceed: () => {
          init();
        },
      });
    },
    [connectedWallet, convert, init],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    convertResult?.status === StreamStatus.IN_PROGRESS ||
    convertResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={convertResult.value}
        onExit={() => {
          init();
          switch (convertResult.status) {
            case StreamStatus.IN_PROGRESS:
              convertResult.abort();
              break;
            case StreamStatus.DONE:
              convertResult.clear();
              break;
          }
        }}
      />
    );
  }

  return (
    <>
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      <div className="from-description">
        <p>From</p>
        <p />
      </div>

      <SelectAndTextInputContainer
        className="from"
        gridColumns={[120, '1fr']}
        error={!!invalidAmount}
        leftHelperText={invalidAmount}
        rightHelperText={
          !!connectedWallet && (
            <span>
              Balance:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  big(balance).gt(0) &&
                  setAmount(formatUInput(balance) as bAsset)
                }
              >
                {formatUToken(balance)}{' '}
                {prettifySymbol(
                  bAssetInfo.wormholeTokenInfo.symbol,
                  bAssetInfo.wormholeTokenInfo,
                )}
              </span>
            </span>
          )
        }
      >
        <div>
          {prettifySymbol(
            bAssetInfo.wormholeTokenInfo.symbol,
            bAssetInfo.wormholeTokenInfo,
          )}
        </div>
        <NumberMuiInput
          placeholder="0.00"
          value={amount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setAmount(target.value as bAsset)
          }
        />
      </SelectAndTextInputContainer>

      <IconLineSeparator />

      <div className="to-description">
        <p>To</p>
        <p />
      </div>

      <SelectAndTextInputContainer className="to" gridColumns={[120, '1fr']}>
        <div>{prettifySymbol(bAssetInfo.bAsset.symbol)}</div>
        <NumberMuiInput
          placeholder="0.00"
          value={amount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setAmount(target.value as bAsset)
          }
        />
      </SelectAndTextInputContainer>

      {amount.length > 0 && (
        <TxFeeList className="receipt">
          <SwapListItem
            label="Price"
            currencyA={prettifySymbol(
              bAssetInfo.wormholeTokenInfo.symbol,
              bAssetInfo.wormholeTokenInfo,
            )}
            currencyB={prettifySymbol(bAssetInfo.bAsset.symbol)}
            exchangeRateAB={1}
            initialDirection="a/b"
            formatExchangeRate={() => '1'}
          />
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      {/* Submit */}
      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !convert ||
            amount.length === 0 ||
            big(amount).lte(0) ||
            !!invalidTxFee ||
            !!invalidAmount
          }
          onClick={() => proceed(amount)}
        >
          Convert
        </ActionButton>
      </ViewAddressWarning>
    </>
  );
}
