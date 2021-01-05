import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators/basset/basset-bond';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { isConnected, useWallet } from '@anchor-protocol/wallet-provider';
import { useQuery } from '@apollo/client';
import {
  Input as MuiInput,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import Big from 'big.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ActionContainer } from '../../containers/action';
import { useAddressProvider } from '../../providers/address-provider';
import * as exchangeRate from './queries/exchangeRate';
import * as validators from './queries/validators';

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
  const { status } = useWallet();

  const addressProvider = useAddressProvider();

  const [bondAmount, setBondAmount] = useState<string>('');

  const [mintCurrency, setMintCurrency] = useState<Item>(
    () => mintCurrencies[0],
  );
  const [bondCurrency, setBondCurrency] = useState<Item>(
    () => bondCurrencies[0],
  );
  const [validator, setValidator] = useState<
    validators.Data['validators']['Result'][number] | null
  >(null);

  const { data: _validatorsData } = useQuery<
    validators.StringifiedData,
    validators.StringifiedVariables
  >(validators.query, {
    skip: !isConnected(status),
    variables: validators.stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(mintCurrency.value),
    }),
  });

  const validatorsData = _validatorsData
    ? validators.parseData(_validatorsData)
    : undefined;

  const { data: _exchangeRateData } = useQuery<
    exchangeRate.StringifiedData,
    exchangeRate.StringifiedVariables
  >(exchangeRate.query, {
    variables: exchangeRate.stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(mintCurrency.value),
    }),
  });

  const exchangeRateData = _exchangeRateData
    ? exchangeRate.parseData(_exchangeRateData)
    : undefined;

  console.log('mint.tsx..MintBase()', {
    status,
    validatorsData,
    exchangeRateData,
    validator,
  });

  return (
    <Section className={className}>
      <div className="bond-description">
        <p>I want to bond</p>
        <p>
          {exchangeRateData &&
            `1 Luna = ${Big(1).div(
              exchangeRateData.exchangeRate.Result.exchange_rate,
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
          value={bondAmount}
          onChange={({ target }) => setBondAmount(target.value)}
        />
      </SelectAndTextInputContainer>

      <div className="mint-description">
        <p>and mint</p>
        <p>
          {exchangeRateData &&
            `1 bLuna = ${exchangeRateData.exchangeRate.Result.exchange_rate} Luna`}
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
        <MuiInput placeholder="0.00" disabled />
      </SelectAndTextInputContainer>

      <HorizontalRuler />

      <NativeSelect
        className="validator"
        value={validator?.OperatorAddress ?? ''}
        onChange={({ target }) =>
          setValidator(
            validatorsData?.whitelistedValidators.Result.find(
              ({ OperatorAddress }) => target.value === OperatorAddress,
            ) ?? null,
          )
        }
        disabled={validatorsData?.whitelistedValidators.Result.length === 0}
      >
        <option value="">Please select validators...</option>
        {validatorsData?.whitelistedValidators.Result.map(
          ({ Description, OperatorAddress }) => (
            <option key={OperatorAddress} value={OperatorAddress}>
              {Description.Moniker}
            </option>
          ),
        )}
      </NativeSelect>

      {status.status === 'ready' &&
      validator &&
      bondAmount.length > 0 &&
      Big(bondAmount).gt(0) ? (
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
                    validator: validator.OperatorAddress,
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

    select {
      width: 50px;
    }
  }

  hr {
    margin: 40px 0;
  }

  .validator {
    width: 100%;
    margin-bottom: 40px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;
