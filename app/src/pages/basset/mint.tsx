import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators/basset/basset-bond';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import { isConnected, useWallet } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient, useQuery } from '@apollo/client';
import {
  Input as MuiInput,
  InputAdornment,
  NativeSelect as MuiNativeSelect,
  SnackbarContent as MuiSnackbarContent,
} from '@material-ui/core';
import { Error } from '@material-ui/icons';
import { CreateTxOptions } from '@terra-money/terra.js';
import Big from 'big.js';
import { transactionFee } from 'env';
import React, { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAddressProvider } from '../../providers/address-provider';
import * as exc from './queries/exchangeRate';
import * as txi from './queries/txInfos';
import * as bal from './queries/userBankBalances';
import * as val from './queries/validators';
import * as mint from './transactions/mint';

export interface MintProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const bondCurrencies: Item[] = [{ label: 'Luna', value: 'luna' }];
const mintCurrencies: Item[] = [{ label: 'bLuna', value: 'bluna' }];

function MintBase({ className }: MintProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [fetchMint, mintResult] = useBroadcastableQuery(mintQueryOptions);

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [bondAmount, setBondAmount] = useState<string>('');

  const [mintCurrency, setMintCurrency] = useState<Item>(
    () => mintCurrencies[0],
  );

  const [bondCurrency, setBondCurrency] = useState<Item>(
    () => bondCurrencies[0],
  );

  const [selectedValidator, setSelectedValidator] = useState<
    val.Data['validators']['Result'][number] | null
  >(null);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: validatorsData } = useQuery<
    val.StringifiedData,
    val.StringifiedVariables
  >(val.query, {
    skip: !isConnected(status),
    variables: val.stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(mintCurrency.value),
    }),
  });

  const { data: exchangeRateData } = useQuery<
    exc.StringifiedData,
    exc.StringifiedVariables
  >(exc.query, {
    variables: exc.stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(mintCurrency.value),
    }),
  });

  const { data: userBankBalancesData } = useQuery<
    bal.StringifiedData,
    bal.StringifiedVariables
  >(bal.query, {
    skip: status.status !== 'ready',
    variables: bal.stringifyVariables({
      userAddress: status.status === 'ready' ? status.walletAddress : '',
    }),
  });

  const whitelistedValidators = useMemo(
    () =>
      validatorsData
        ? val.parseData(validatorsData).whitelistedValidators.Result
        : undefined,
    [validatorsData],
  );

  const exchangeRate = useMemo(
    () =>
      exchangeRateData
        ? exc.parseData(exchangeRateData).exchangeRate.Result
        : undefined,
    [exchangeRateData],
  );

  const userUlunaBalance = useMemo(() => {
    return userBankBalancesData
      ? bal.parseData(userBankBalancesData).get('uluna')?.Amount
      : undefined;
  }, [userBankBalancesData]);

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const bondInputError = useMemo<ReactNode>(() => {
    if (
      Big(bondAmount.length > 0 ? bondAmount : 0)
        .mul(1000000)
        .gt(Big(userUlunaBalance ?? 0))
    ) {
      return `Insufficient balance: Not enough Assets\nYou have: ${Big(
        userUlunaBalance ?? 0,
      ).div(1000000)} Luna`;
    }
    return undefined;
  }, [bondAmount, userUlunaBalance]);

  console.log('mint.tsx..MintBase()', mintResult);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <div className="bond-description">
        <p>I want to bond</p>
        <p>
          {exchangeRate &&
            `1 Luna = ${Big(1).div(exchangeRate.exchange_rate)} bLuna`}
        </p>
      </div>

      <SelectAndTextInputContainer
        className="bond"
        aria-disabled={mintResult?.status === 'in-progress'}
      >
        <MuiNativeSelect
          value={bondCurrency}
          onChange={(evt) =>
            setBondCurrency(
              bondCurrencies.find(({ value }) => evt.target.value === value) ??
                bondCurrencies[0],
            )
          }
          IconComponent={bondCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={bondCurrencies.length < 2}
        >
          {bondCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>

        <MuiInput
          type="number"
          placeholder="0.00"
          error={!!bondInputError}
          endAdornment={
            bondInputError ? (
              <InputAdornment position="end">
                <Tooltip
                  open
                  color="error"
                  title={bondInputError}
                  placement="top"
                >
                  <Error />
                </Tooltip>
              </InputAdornment>
            ) : undefined
          }
          value={bondAmount}
          onChange={({ target }) => setBondAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      <div className="mint-description">
        <p>and mint</p>
        <p>{exchangeRate && `1 bLuna = ${exchangeRate.exchange_rate} Luna`}</p>
      </div>

      <SelectAndTextInputContainer
        className="mint"
        aria-disabled={mintResult?.status === 'in-progress'}
      >
        <MuiNativeSelect
          value={mintCurrency}
          onChange={(evt) =>
            setMintCurrency(
              mintCurrencies.find(({ value }) => evt.target.value === value) ??
                mintCurrencies[0],
            )
          }
          IconComponent={mintCurrencies.length < 2 ? BlankComponent : undefined}
          disabled={mintCurrencies.length < 2}
        >
          {mintCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput
          placeholder="0.00"
          value={
            bondAmount.length > 0
              ? Big(bondAmount)
                  .mul(Big(exchangeRate?.exchange_rate ?? 0))
                  .toString()
              : ''
          }
          disabled
        />
      </SelectAndTextInputContainer>

      <HorizontalRuler />

      <NativeSelect
        className="validator"
        data-selected-value={selectedValidator?.OperatorAddress ?? ''}
        value={selectedValidator?.OperatorAddress ?? ''}
        onChange={({ target }) =>
          setSelectedValidator(
            whitelistedValidators?.find(
              ({ OperatorAddress }) => target.value === OperatorAddress,
            ) ?? null,
          )
        }
        disabled={
          whitelistedValidators?.length === 0 ||
          mintResult?.status === 'in-progress'
        }
      >
        <option value="">Select validator</option>
        {whitelistedValidators?.map(({ Description, OperatorAddress }) => (
          <option key={OperatorAddress} value={OperatorAddress}>
            {Description.Moniker}
          </option>
        ))}
      </NativeSelect>

      {status.status === 'ready' &&
      selectedValidator &&
      bondAmount.length > 0 &&
      Big(bondAmount).gt(0) &&
      !bondInputError &&
      mintResult?.status !== 'in-progress' ? (
        <ActionButton
          className="submit"
          onClick={() =>
            fetchMint({
              post: post<CreateTxOptions, mint.StringifiedTxResult>({
                ...transactionFee,
                msgs: fabricatebAssetBond({
                  address: status.walletAddress,
                  amount: Big(bondAmount).toNumber(),
                  bAsset: addressProvider.bAssetToken('bluna'),
                  validator: selectedValidator.OperatorAddress,
                })(addressProvider),
              })
                .then(({ payload }) => payload)
                .then(mint.parseResult),
              client,
            }).then((data) => {
              if (data) { // the meaning that data is exists is this component does not unmounted
                setBondAmount('');
                setSelectedValidator(null);
              }
            })
          }
        >
          Mint
        </ActionButton>
      ) : (
        <ActionButton className="submit" disabled>
          Mint
        </ActionButton>
      )}

      {mintResult?.status === 'done' && (
        <>
          <HorizontalHeavyRuler />
          <pre>{JSON.stringify(mintResult.data, null, 2)}</pre>
        </>
      )}
    </Section>
  );
}

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const mintQueryOptions: BroadcastableQueryOptions<
  { post: Promise<mint.TxResult>; client: ApolloClient<any> },
  mint.TxResult & { txInfos: txi.Data },
  Error
> = {
  broadcastWhen: 'unmounted',
  group: 'basset/mint',
  fetchClient: async ({ post, client }) => {
    const txResult = await post;

    while (true) {
      const txInfos = await client
        .query<txi.StringifiedData, txi.StringifiedVariables>({
          query: txi.query,
          fetchPolicy: 'network-only',
          variables: txi.stringifyVariables({
            txHash: txResult.result.txhash,
          }),
        })
        .then(({ data }) => txi.parseData(data));

      if (txInfos.length > 0) {
        return { ...txResult, txInfos };
      } else {
        await timeout(500);
      }
    }
  },
  notificationFactory: (result) => {
    return <MuiSnackbarContent message={result.status} />;
  },
};

function BlankComponent() {
  return <div />;
}

export const Mint = styled(MintBase)`
  .bond-description,
  .mint-description {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 16px;
    color: ${({ theme }) => theme.dimTextColor};

    > :last-child {
      font-size: 12px;
    }

    margin-bottom: 12px;
  }

  .bond,
  .mint {
    margin-bottom: 30px;

    > :first-child {
      width: 100px;
    }

    > :nth-child(2) {
      flex: 1;
    }
  }

  hr {
    margin: 40px 0;
  }

  .validator {
    width: 100%;
    margin-bottom: 40px;

    &[data-selected-value=''] {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
