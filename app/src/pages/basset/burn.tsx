import { fabricatebAssetBurn } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import {
  Input as MuiInput,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import { useState } from 'react';
import styled from 'styled-components';
import Box from '../../components/box';
import Button, { ButtonTypes } from '../../components/button';
import { ActionContainer } from '../../containers/action';
import { useWallet } from '../../hooks/use-wallet';
import { useAddressProvider } from '../../providers/address-provider';

import style from './basset.module.scss';
import BassetInput from './components/basset-input';

export interface BurnProps {
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

function BurnBase({ className }: BurnProps) {
  const { address } = useWallet();
  const addressProvider = useAddressProvider();
  const [burnState, setBurnState] = useState(0.0);

  // TODO: get exchange rate

  // ---------------------------------------------
  //
  // ---------------------------------------------
  const [mint, setMint] = useState<Item>(() => mintItems[0]);
  const [bond, setBond] = useState<Item>(() => bondItems[0]);

  return (
    <Section className={className}>
      <div className="mint-description">
        <p>I want to burn</p>
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

      <div className="bond-description">
        <p>and get</p>
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

      <ActionButton className="submit">Burn</ActionButton>

      <HorizontalHeavyRuler />

      <article className={style.business}>
        <Box>
          <BassetInput
            caption="I want to burn"
            offerDenom="bLuna"
            askDenom="Luna"
            exchangeRate={0.99}
            onChange={setBurnState}
            amount={burnState}
            allowed={true}
          />
        </Box>
        <Box>
          <BassetInput
            caption="... and get"
            offerDenom="Luna"
            askDenom="bLuna"
            exchangeRate={1.01}
            amount={200.0}
            allowed={false}
          />
        </Box>
        {/* center arrow */}
        <aside>~</aside>
      </article>

      <footer>
        <ActionContainer
          render={(execute) => (
            <Button
              type={ButtonTypes.PRIMARY}
              transactional={true}
              onClick={() =>
                execute(
                  fabricatebAssetBurn({
                    address,
                    amount: burnState.toString(),
                    bAsset: addressProvider.bAssetToken('uluna'),
                  }),
                )
              }
            >
              Burn
            </Button>
          )}
        />
      </footer>
    </Section>
  );
}

export const Burn = styled(BurnBase)`
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
