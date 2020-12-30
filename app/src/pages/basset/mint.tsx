import { fabricatebAssetMint } from '@anchor-protocol/anchor-js/fabricators';
import { fabricateRegisterValidator } from '@anchor-protocol/anchor-js/fabricators/register-validator';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { NativeSelect } from '@anchor-protocol/neumorphism-ui/components/NativeSelect';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  Input as MuiInput,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import Box from '../../components/box';
import Button, { ButtonTypes } from '../../components/button';
import { ActionContainer } from '../../containers/action';
import useWhitelistedValidators from '../../hooks/mantle/use-whitelisted-validators';
import { useWallet } from '../../hooks/use-wallet';
import { useAddressProvider } from '../../providers/address-provider';

import style from './basset.module.scss';
import BassetInput from './components/basset-input';

export interface MintProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const bondItems: Item[] = [
  { label: 'Luna', value: 'luna' },
  { label: 'KRT', value: 'krt' },
  { label: 'UST', value: 'ust' },
];

const mintItems: Item[] = [
  { label: 'bLuna', value: 'bluna' },
  { label: 'KRT', value: 'krt' },
  { label: 'UST', value: 'ust' },
];

const validatorItems: Item[] = Array.from({ length: 20 }, (_, i) => ({
  label: 'Validator ' + i,
  value: 'validator' + i,
}));

function MintBase({ className }: MintProps) {
  const { address } = useWallet();
  const addressProvider = useAddressProvider();

  // mint input state
  const [mintState, setMintState] = useState(0.0);

  // validator selection state
  const [validatorState, setValidatorState] = useState<string>('');

  // whitelisted validators
  const [
    loading,
    error,
    whitelistedValidators = [],
  ] = useWhitelistedValidators();

  // const isReady = !loading
  //const isReady = true;

  console.log(loading, error, whitelistedValidators);

  // temp admin
  const [addressToWhitelist, setAddressToWhitelist] = useState('');

  // ---------------------------------------------
  //
  // ---------------------------------------------
  const [mint, setMint] = useState<Item>(() => mintItems[0]);
  const [bond, setBond] = useState<Item>(() => bondItems[0]);
  const [validator, setValidator] = useState<Item | null>(null);

  return (
    <Section className={className}>
      <div className="bond-description">
        <p>I want to bond</p>
        <p>1 Luna = 1.01 bLuna</p>
      </div>

      <SelectAndTextInputContainer className="bond">
        <MuiNativeSelect
          value={bond}
          onChange={(evt) =>
            setBond(
              bondItems.find(({ value }) => evt.target.value === value) ??
                bondItems[0],
            )
          }
        >
          {bondItems.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput placeholder="0.00" />
      </SelectAndTextInputContainer>

      <div className="mint-description">
        <p>and mint</p>
        <p>1 bLuna = 0.99 Luna</p>
      </div>

      <SelectAndTextInputContainer className="mint">
        <MuiNativeSelect
          value={mint}
          onChange={(evt) =>
            setMint(
              mintItems.find(({ value }) => evt.target.value === value) ??
                mintItems[0],
            )
          }
        >
          {mintItems.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </MuiNativeSelect>
        <MuiInput placeholder="0.00" />
      </SelectAndTextInputContainer>

      <HorizontalRuler />

      <NativeSelect
        className="validator"
        value={validator?.value}
        onChange={({ target }) =>
          setValidator(
            validatorItems.find(({ value }) => target.value === value) ?? null,
          )
        }
      >
        {validatorItems.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </NativeSelect>
      {/*<Selector*/}
      {/*  className="validator"*/}
      {/*  items={validatorItems}*/}
      {/*  selectedItem={validator}*/}
      {/*  onChange={(next) => setValidator(next)}*/}
      {/*  labelFunction={(item) => item?.label ?? 'Select Validator'}*/}
      {/*  keyFunction={(item) => item.value}*/}
      {/*/>*/}

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
                  fabricatebAssetMint({
                    address,
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
                    address: address,
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
