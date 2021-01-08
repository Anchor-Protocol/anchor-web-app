import { fabricateDepositStableCoin } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { HorizontalDashedRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalDashedRuler';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { MICRO, toFixedNoRounding } from '@anchor-protocol/number-notation';
import { BroadcastableQueryOptions, useBroadcastableQuery } from '@anchor-protocol/use-broadcastable-query';
import type { DialogProps, DialogTemplate, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient, useQuery } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import { CreateTxOptions } from '@terra-money/terra.js';
import big from 'big.js';
import { transactionFee } from 'env';
import { useAddressProvider } from 'providers/address-provider';
import * as tax from 'queries/tax';
import * as txi from 'queries/txInfos';
import * as bal from 'queries/userBankBalances';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';
import { txNotificationFactory, TxResultRenderer } from 'transactions/TxResultRenderer';

interface FormParams {
  className?: string;
}

interface FormReturn {
  refresh: boolean;
}

export function useDepositDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Template);
}

const Template: DialogTemplate<FormParams, FormReturn> = (props) => {
  return <Component {...props} />;
};

//const taxRate = 0.001;
//const maxTax = 10 * MICRO;
const fixedGas = 0.001 * MICRO;

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [
    fetchDeposit,
    depositResult,
    resetDepositResult,
  ] = useBroadcastableQuery(depositQueryOptions);

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [amount, setAmount] = useState<string>('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: taxData } = useQuery<
    tax.StringifiedData,
    tax.StringifiedVariables
  >(tax.query, {
    fetchPolicy: 'cache-and-network',
    variables: tax.stringifyVariables({
      Denom: 'uusd',
    }),
  });

  const { data: userBankBalancesData } = useQuery<
    bal.StringifiedData,
    bal.StringifiedVariables
  >(bal.query, {
    skip: status.status !== 'ready',
    fetchPolicy: 'cache-and-network',
    variables: bal.stringifyVariables({
      userAddress: status.status === 'ready' ? status.walletAddress : '',
    }),
  });

  const userUusdBalance = useMemo(() => {
    return userBankBalancesData
      ? bal.parseData(userBankBalancesData).get('uusd')?.Amount
      : undefined;
  }, [userBankBalancesData]);

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const inputQualifiedError = useMemo(() => {
    if (big(userUusdBalance ?? 0).lt(fixedGas)) {
      return 'Not enough Tx Fee';
    }

    return undefined;
  }, [userUusdBalance]);

  const inputError = useMemo<ReactNode>(() => {
    if (
      big(amount.length > 0 ? amount : 0)
        .mul(MICRO)
        .gt(big(userUusdBalance ?? 0))
    ) {
      return `Insufficient balance: Not enough Assets`;
    }

    return undefined;
  }, [amount, userUusdBalance]);

  const txFee = useMemo(() => {
    if (amount.length === 0 || !taxData) return undefined;

    const ratioTxFee = big(amount).mul(MICRO).mul(taxData.tax_rate.Result);
    const maxTax = big(taxData.tax_cap_denom.Result);

    if (ratioTxFee.gt(maxTax)) {
      return big(maxTax).add(fixedGas).toString();
    } else {
      return ratioTxFee.add(fixedGas).toString();
    }
  }, [amount, taxData]);

  console.log('useDepositDialog.tsx..ComponentBase()', depositResult);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    depositResult?.status === 'in-progress' ||
    depositResult?.status === 'done' ||
    depositResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>Deposit</h1>
          <TxResultRenderer
            result={depositResult}
            resetResult={() => {
              resetDepositResult && resetDepositResult();
              closeDialog({ refresh: true });
            }}
          />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open>
      <Dialog
        className={className}
        onClose={() => closeDialog({ refresh: false })}
      >
        <h1>Deposit</h1>

        <TextInput
          className="amount"
          type="number"
          value={amount}
          label="AMOUNT"
          disabled={!!inputQualifiedError}
          error={!!inputQualifiedError || !!inputError}
          onChange={({ target }) => setAmount(target.value)}
          InputProps={{
            endAdornment: (
              <Tooltip
                color={inputError ? 'error' : undefined}
                title="Available you deposit"
                placement="top"
              >
                <InputAdornment position="end">UST</InputAdornment>
              </Tooltip>
            ),
            inputMode: 'numeric',
          }}
        />

        <div
          className="wallet"
          aria-invalid={!!inputQualifiedError || !!inputError}
        >
          <span>{inputQualifiedError || inputError}</span>
          <span>
            Wallet:{' '}
            {toFixedNoRounding(
              big(userUusdBalance ?? 0)
                .div(MICRO)
                .toString(),
              2,
            )}{' '}
            UST
          </span>
        </div>

        {txFee && (
          <figure className="receipt">
            <HorizontalDashedRuler />
            <ul>
              <li>
                <span>
                  Tx Fee{' '}
                  <Tooltip title="Tx Fee Description" placement="top">
                    <InfoOutlined />
                  </Tooltip>
                </span>
                <span>{toFixedNoRounding(big(txFee).div(MICRO))} UST</span>
              </li>
            </ul>
            <HorizontalDashedRuler />
          </figure>
        )}

        <ActionButton
          className="proceed"
          disabled={
            status.status !== 'ready' ||
            amount.length === 0 ||
            big(amount).lte(0) ||
            !!inputError
          }
          onClick={() =>
            fetchDeposit({
              post: post<CreateTxOptions, StringifiedTxResult>({
                ...transactionFee,
                msgs: fabricateDepositStableCoin({
                  address:
                    status.status === 'ready' ? status.walletAddress : '',
                  amount: big(amount).toNumber(),
                  symbol: 'usd',
                })(addressProvider),
              }).then(({ payload }) => parseResult(payload)),
              client,
            })
          }
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const depositQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'earn/deposit',
  notificationFactory: txNotificationFactory,
};

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .amount {
    width: 100%;
    margin-bottom: 5px;
  }

  .wallet {
    display: flex;
    justify-content: space-between;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    &[aria-invalid='true'] {
      color: #f5356a;
    }
  }

  .receipt {
    margin-top: 30px;

    font-size: 12px;

    ul {
      list-style: none;
      padding: 0;

      li {
        margin: 15px 0;

        display: flex;
        justify-content: space-between;
        align-items: center;

        > :first-child {
          color: ${({ theme }) => theme.dimTextColor};
        }

        > :last-child {
          color: ${({ theme }) => theme.textColor};
        }

        svg {
          font-size: 1em;
          transform: scale(1.2) translateY(0.08em);
        }
      }
    }
  }

  .proceed {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
