import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useBAssetInfoAndBalanceTotalQuery,
  useTerraSendTx,
} from '@anchor-protocol/app-provider';
import {
  AnchorBank,
  useAnchorBank,
} from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  AUST_INPUT_MAXIMUM_DECIMAL_POINTS,
  AUST_INPUT_MAXIMUM_INTEGER_POINTS,
  formatANCInput,
  formatAUSTInput,
  formatBAssetInput,
  formatLunaInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { HumanAddr, Token, u, UST } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { min } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Modal, NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { StreamStatus } from '@rx-stream/react';
import { AccAddress } from '@terra-money/terra.js';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { CurrencyInfo } from 'pages/send/models/currency';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useSendDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { connected } = useAccount();

  const fixedFee = useFixedFee();

  const {
    contractAddress: { cw20 },
  } = useAnchorWebapp();

  const { data: { infoAndBalances = [] } = {} } =
    useBAssetInfoAndBalanceTotalQuery();

  const [send, sendResult] = useTerraSendTx();

  const currencies = useMemo<CurrencyInfo[]>(
    () => [
      {
        label: 'UST',
        value: 'usd',
        integerPoints: UST_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: UST_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: AnchorBank, fixedGas: u<UST<BigSource>>) => {
          return big(bank.tokenBalances.uUST)
            .minus(
              min(
                big(bank.tokenBalances.uUST).mul(bank.tax.taxRate),
                bank.tax.maxTaxUUSD,
              ),
            )
            .minus(big(fixedGas).mul(2))
            .toString() as u<Token>;
        },
        getFormatWithdrawable: (
          bank: AnchorBank,
          fixedGas: u<UST<BigSource>>,
        ) => {
          return formatUSTInput(
            demicrofy(
              big(bank.tokenBalances.uUST)
                .minus(
                  min(
                    big(bank.tokenBalances.uUST).mul(bank.tax.taxRate),
                    bank.tax.maxTaxUUSD,
                  ),
                )
                .minus(big(fixedGas).mul(2)) as u<UST<Big>>,
            ),
          );
        },
      },
      {
        label: 'aUST',
        value: 'aust',
        integerPoints: AUST_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: AUST_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: AnchorBank) => bank.tokenBalances.uaUST,
        getFormatWithdrawable: (bank: AnchorBank) =>
          formatAUSTInput(demicrofy(bank.tokenBalances.uaUST)),
        cw20Address: cw20.aUST,
      },
      {
        label: 'LUNA',
        value: 'luna',
        integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: AnchorBank) => bank.tokenBalances.uLuna,
        getFormatWithdrawable: (bank: AnchorBank) =>
          formatLunaInput(demicrofy(bank.tokenBalances.uLuna)),
      },
      {
        label: 'bLUNA',
        value: 'bluna',
        integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: AnchorBank) => bank.tokenBalances.ubLuna,
        getFormatWithdrawable: (bank: AnchorBank) =>
          formatLunaInput(demicrofy(bank.tokenBalances.ubLuna)),
        cw20Address: cw20.bLuna,
      },
      ...infoAndBalances.map(({ bAsset, balance, tokenDisplay }) => ({
        label: tokenDisplay?.symbol ?? bAsset.symbol,
        value: bAsset.symbol,
        integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: () => balance.balance,
        getFormatWithdrawable: () =>
          formatBAssetInput(demicrofy(balance.balance)),
        cw20Address: bAsset.collateral_token,
      })),
      {
        label: 'ANC',
        value: 'anc',
        integerPoints: ANC_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: AnchorBank) => bank.tokenBalances.uANC,
        getFormatWithdrawable: (bank: AnchorBank) =>
          formatANCInput(demicrofy(bank.tokenBalances.uANC)),
        cw20Address: cw20.ANC,
      },
    ],
    [cw20.ANC, cw20.aUST, cw20.bLuna, infoAndBalances],
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [address, setAddress] = useState<string>('');

  const [amount, setAmount] = useState<Token>('' as Token);

  const [currency, setCurrency] = useState<CurrencyInfo>(() => currencies[0]);

  const [memo, setMemo] = useState<string>('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useAnchorBank();

  // ---------------------------------------------
  // computed
  // ---------------------------------------------
  //const numberInputHandlers = useRestrictedNumberInput({
  //  maxIntegerPoinsts: currency.integerPoints,
  //  maxDecimalPoints: currency.decimalPoints,
  //});

  const memoWarning = useMemo(() => {
    return memo.trim().length === 0
      ? 'Please double check if the transaction requires a memo'
      : undefined;
  }, [memo]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateCurrency = useCallback(
    (nextCurrencyValue: string) => {
      setCurrency(
        currencies.find(({ value }) => nextCurrencyValue === value) ??
          currencies[0],
      );

      setAmount('' as Token);
    },
    [currencies],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const txFee = useMemo(() => {
    if (amount.length === 0 || currency.value !== 'usd') {
      return fixedFee;
    }

    return min(
      microfy(amount as UST).mul(bank.tax.taxRate),
      bank.tax.maxTaxUUSD,
    ).plus(fixedFee) as u<UST<Big>>;
  }, [amount, bank.tax.maxTaxUUSD, bank.tax.taxRate, currency.value, fixedFee]);

  const invalidTxFee = useMemo(
    () => connected && validateTxFee(bank.tokenBalances.uUST, txFee),
    [bank, connected, txFee],
  );

  const invalidAddress = useMemo(() => {
    if (address.length === 0) {
      return undefined;
    }

    return !AccAddress.validate(address) ? 'Invalid address' : undefined;
  }, [address]);

  const invalidAmount = useMemo(() => {
    if (amount.length === 0) return undefined;

    return microfy(amount as Token).gt(currency.getWithdrawable(bank, fixedFee))
      ? 'Not enough assets'
      : undefined;
  }, [amount, currency, bank, fixedFee]);

  const invalidMemo = useMemo(() => {
    return /[<>]/.test(memo) ? 'Characters < and > are not allowed' : undefined;
  }, [memo]);

  const submit = useCallback(
    async (
      toAddress: string,
      currency: CurrencyInfo,
      amount: Token,
      txFee: u<UST>,
      memo: string,
    ) => {
      if (!connected || !send) {
        return;
      }

      send({
        toWalletAddress: toAddress as HumanAddr,
        amount,
        currency,
        txFee,
        memo,
      });
    },
    [connected, send],
  );

  if (
    sendResult?.status === StreamStatus.IN_PROGRESS ||
    sendResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={sendResult.value}
            onExit={closeDialog}
          />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Send</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        {/* Address */}
        <div className="address-description">
          <p>Send to</p>
          <p />
        </div>

        <TextInput
          className="address"
          fullWidth
          placeholder="ADDRESS"
          value={address}
          error={!!invalidAddress}
          helperText={invalidAddress}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setAddress(target.value)
          }
        />

        {/* Amount */}
        <div className="amount-description">
          <p>Amount</p>
          <p />
        </div>

        <SelectAndTextInputContainer
          className="amount"
          gridColumns={[120, '1fr']}
          error={!!invalidAmount}
          leftHelperText={invalidAmount}
          rightHelperText={
            <span>
              Withdrawable:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  setAmount(
                    currency.getFormatWithdrawable(bank, fixedFee) as Token,
                  )
                }
              >
                {currency.getFormatWithdrawable(bank, fixedFee)}{' '}
                {currency.label}
              </span>
            </span>
          }
        >
          <MuiNativeSelect
            value={currency.value}
            onChange={({ target }) => updateCurrency(target.value)}
          >
            {currencies.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </MuiNativeSelect>
          <NumberMuiInput
            placeholder="0"
            value={amount}
            maxIntegerPoinsts={currency.integerPoints}
            maxDecimalPoints={currency.decimalPoints}
            onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
              setAmount(target.value as Token)
            }
          />
        </SelectAndTextInputContainer>

        {/* Memo */}
        <div className="memo-description">
          <p>Memo (Optional)</p>
          <p />
        </div>

        <TextInput
          className="memo"
          fullWidth
          placeholder="MEMO"
          value={memo}
          error={!!invalidMemo}
          helperText={invalidMemo}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setMemo(target.value)
          }
        />

        <div className="memo-warning">
          {memoWarning && (
            <WarningMessage>
              <IconSpan wordBreak={false}>
                <Warning /> Please double check if the transaction requires a
                memo
              </IconSpan>
            </WarningMessage>
          )}
        </div>

        <TxFeeList className="receipt">
          <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
            {formatUST(demicrofy(txFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ViewAddressWarning>
          <ActionButton
            className="send"
            disabled={
              !connected ||
              !send ||
              address.length === 0 ||
              amount.length === 0 ||
              !!invalidAddress ||
              !!invalidAmount ||
              !!invalidTxFee ||
              !!invalidMemo ||
              big(currency.getWithdrawable(bank, fixedFee)).lte(0)
            }
            onClick={() =>
              submit(
                address,
                currency,
                amount,
                txFee.toString() as u<UST>,
                memo,
              )
            }
          >
            Send
          </ActionButton>
        </ViewAddressWarning>
      </Dialog>
    </Modal>
  );
}

const WarningMessage = styled.div`
  color: ${({ theme }) => theme.colors.negative};

  text-align: center;

  font-size: 13px;

  padding: 5px;
  border: 1px solid ${({ theme }) => theme.colors.negative};
  border-radius: 5px;

  svg {
    margin-right: 10px;
  }

  margin-bottom: 20px;
`;

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .address-description,
  .amount-description,
  .memo-description {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 12px;
    color: ${({ theme }) => theme.textColor};

    > :last-child {
      font-size: 12px;
    }

    margin-bottom: 12px;
  }

  .address {
    margin-bottom: 20px;
  }

  .amount {
    margin-bottom: 20px;

    select {
      padding-right: 10px;
    }
  }

  .memo-warning {
    padding: 20px 0;

    &:empty {
      min-height: 30px;
    }
  }

  .receipt {
    margin-bottom: 40px;
  }

  .send {
    width: 100%;
    height: 60px;
  }
`;
