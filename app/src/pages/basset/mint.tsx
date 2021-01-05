import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators/basset/basset-bond';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { isConnected, useWallet } from '@anchor-protocol/wallet-provider';
import { useQuery } from '@apollo/client';
import {
  Input as MuiInput,
  InputAdornment,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import { Error } from '@material-ui/icons';
import Big from 'big.js';
import React, { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ActionContainer } from '../../containers/action';
import { useAddressProvider } from '../../providers/address-provider';
import * as exc from './queries/exchangeRate';
import * as bal from './queries/userBankBalances';
import * as val from './queries/validators';

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
  const { status } = useWallet();

  const addressProvider = useAddressProvider();

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

  const validators = useMemo(
    () => (validatorsData ? val.parseData(validatorsData) : undefined),
    [validatorsData],
  );

  const exchangeRate = useMemo(
    () => (exchangeRateData ? exc.parseData(exchangeRateData) : undefined),
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

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <div className="bond-description">
        <p>I want to bond</p>
        <p>
          {exchangeRate &&
            `1 Luna = ${Big(1).div(
              exchangeRate.exchangeRate.Result.exchange_rate,
            )} bLuna`}
        </p>
      </div>

      <SelectAndTextInputContainer className="bond">
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
        <p>
          {exchangeRate &&
            `1 bLuna = ${exchangeRate.exchangeRate.Result.exchange_rate} Luna`}
        </p>
      </div>

      <SelectAndTextInputContainer className="mint">
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
                  .mul(
                    Big(exchangeRate?.exchangeRate.Result.exchange_rate ?? 0),
                  )
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
            validators?.whitelistedValidators.Result.find(
              ({ OperatorAddress }) => target.value === OperatorAddress,
            ) ?? null,
          )
        }
        disabled={validators?.whitelistedValidators.Result.length === 0}
      >
        <option value="">Select validator</option>
        {validators?.whitelistedValidators.Result.map(
          ({ Description, OperatorAddress }) => (
            <option key={OperatorAddress} value={OperatorAddress}>
              {Description.Moniker}
            </option>
          ),
        )}
      </NativeSelect>

      {status.status === 'ready' &&
      selectedValidator &&
      bondAmount.length > 0 &&
      Big(bondAmount).gt(0) &&
      !bondInputError ? (
        <ActionContainer
          render={(execute) => (
            <ActionButton
              className="submit"
              onClick={() =>
                execute(
                  fabricatebAssetBond({
                    address: status.walletAddress,
                    amount: Big(bondAmount).toNumber(),
                    bAsset: addressProvider.bAssetToken('bluna'),
                    validator: selectedValidator.OperatorAddress,
                  }),
                )
              }
            >
              Mint
            </ActionButton>
          )}
        />
      ) : (
        <ActionButton className="submit" disabled>
          Mint
        </ActionButton>
      )}
    </Section>
  );
}

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
