import { fabricatebAssetMint } from '@anchor-protocol/anchor-js/fabricators';
import { fabricateRegisterValidator } from '@anchor-protocol/anchor-js/fabricators/register-validator';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import React, { useState } from 'react';
import styled from 'styled-components';
import Box from '../../components/box';
import Button, { ButtonTypes } from '../../components/button';
import { ready } from '../../components/ready';
import { ActionContainer } from '../../containers/action';
import useWhitelistedValidators from '../../hooks/mantle/use-whitelisted-validators';
import { useWallet } from '../../hooks/use-wallet';
import { useAddressProvider } from '../../providers/address-provider';

import style from './basset.module.scss';
import BassetInput from './components/basset-input';

export interface MintProps {
  className?: string;
}

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
  const isReady = true;

  console.log(loading, error, whitelistedValidators);

  // temp admin
  const [addressToWhitelist, setAddressToWhitelist] = useState('');

  return ready(isReady, () => (
    <Section className={className}>
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
  ));
}

export const Mint = styled(MintBase)`
  // TODO
`;
