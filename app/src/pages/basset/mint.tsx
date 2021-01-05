import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators/basset/basset-bond';
import { fabricateRegisterValidator } from '@anchor-protocol/anchor-js/fabricators/basset/basset-register-validator';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
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
import Box from '../../components/box';
import Button, { ButtonTypes } from '../../components/button';
import { ActionContainer } from '../../containers/action';
import useWhitelistedValidators from '../../hooks/mantle/use-whitelisted-validators';
import { useAddressProvider } from '../../providers/address-provider';
import style from './basset.module.scss';
import BassetInput from './components/basset-input';
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

  // ---------------------------------------------
  // deprecated logic
  // ---------------------------------------------
  // mint input state
  const [mintState, setMintState] = useState(0.0);

  // validator selection state
  const [validatorState, setValidatorState] = useState<string>('');

  // whitelisted validators
  const [, , whitelistedValidators = []] = useWhitelistedValidators();

  // const isReady = !loading
  //const isReady = true;

  //console.log(loading, error, whitelistedValidators);

  // temp admin
  const [addressToWhitelist, setAddressToWhitelist] = useState('');

  // ---------------------------------------------
  //
  // ---------------------------------------------
  const [mintCurrency, setMintCurrency] = useState<Item>(
    () => mintCurrencies[0],
  );
  const [bondCurrency, setBondCurrency] = useState<Item>(
    () => bondCurrencies[0],
  );
  const [validator, setValidator] = useState<
    validators.Data['validators']['Result'][number] | null
  >(null);

  const { data: validatorsData } = useQuery<
    validators.StringifiedData,
    validators.StringifiedVariables
  >(validators.query, {
    skip: !isConnected(status),
    variables: validators.stringifyVariables({
      bLunaHubContract: addressProvider.bAssetHub(mintCurrency.value),
    }),
  });

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
          IconComponent={bondCurrencies.length < 2 ? () => <div /> : undefined}
          disabled={bondCurrencies.length < 2}
        >
          {bondCurrencies.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput placeholder="0.00" />
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
          IconComponent={mintCurrencies.length < 2 ? () => <div /> : undefined}
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
        value={validator?.Description.Moniker}
        onChange={({ target }) =>
          setValidator(
            validatorsData?.validators.Result.find(
              ({ OperatorAddress }) => target.value === OperatorAddress,
            ) ?? null,
          )
        }
        disabled={!validatorsData}
      >
        {validatorsData?.validators.Result.map(
          ({ Description, OperatorAddress }) => (
            <option key={OperatorAddress} value={OperatorAddress}>
              {Description.Moniker}
            </option>
          ),
        )}
      </NativeSelect>

      <ActionButton className="submit">Mint</ActionButton>

      <HorizontalHeavyRuler />

      <article className={style.business}>
        <Box>
          <BassetInput
            caption="I want to bond"
            offerDenom="Luna"
            askDenom="bLuna"
            exchangeRate={1.01}
            amount={mintState}
            onChange={setMintState}
            allowed={true}
          />
        </Box>
        <Box>
          <BassetInput
            caption="... and mint"
            offerDenom="bLuna"
            askDenom="Luna"
            exchangeRate={0.99}
            amount={mintState * 0.99}
            allowed={false}
          />
        </Box>
        {/* center arrow */}
        <aside>~</aside>

        {/* Validator selection */}
        <select
          value={validatorState}
          onChange={(ev) => setValidatorState(ev.currentTarget.value)}
        >
          <option value="">Select Validator</option>
          {whitelistedValidators.map((validator) => (
            <option key={validator} value={validator}>
              {validator}
            </option>
          ))}
        </select>
      </article>

      <footer>
        <ActionContainer
          render={(execute) => (
            <Button
              type={ButtonTypes.PRIMARY}
              transactional={true}
              onClick={() =>
                execute(
                  fabricatebAssetBond({
                    address:
                      status.status === 'ready' ? status.walletAddress : '',
                    amount: mintState,
                    bAsset: addressProvider.bAssetToken('bluna'),
                    validator: validatorState,
                  }),
                )
              }
            >
              Mint
            </Button>
          )}
        />
      </footer>

      {/* temp mint admin functions */}
      <div>
        <input
          value={addressToWhitelist}
          onChange={(ev) => setAddressToWhitelist(ev.currentTarget.value)}
        />
        <ActionContainer
          render={(execute) => (
            <Button
              type={ButtonTypes.PRIMARY}
              transactional={true}
              onClick={() =>
                execute(
                  fabricateRegisterValidator({
                    address:
                      status.status === 'ready' ? status.walletAddress : '',
                    validatorAddress: addressToWhitelist,
                  }),
                )
              }
            >
              RegisterValidator
            </Button>
          )}
        />
      </div>
    </Section>
  );
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
