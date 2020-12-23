import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { Selector } from '@anchor-protocol/neumorphism-ui/components/Selector';
import { Tab } from '@anchor-protocol/neumorphism-ui/components/Tab';
import { Input, NativeSelect } from '@material-ui/core';
import { screen } from 'env';
import { useState } from 'react';
import styled from 'styled-components';

export interface MintProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const tabItems: Item[] = [
  { label: 'Mint', value: 'mint' },
  { label: 'Burn', value: 'burn' },
  { label: 'Claim', value: 'claim' },
];

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
  const [tab, setTab] = useState<Item>(() => tabItems[0]);
  const [bond, setBond] = useState<Item>(() => bondItems[0]);
  const [mint, setMint] = useState<Item>(() => mintItems[0]);
  const [validator, setValidator] = useState<Item | null>(null);

  return (
    <div className={className}>
      <main>
        <h1>bASSET</h1>

        <div className="content-layout">
          <Tab
            className="tab"
            items={tabItems}
            selectedItem={tab}
            onChange={setTab}
            labelFunction={({ label }) => label}
            keyFunction={({ value }) => value}
          />

          <Section>
            <div className="bond-description">
              <p>I want to bond</p>
              <p>1 Luna = 1.01 bLuna</p>
            </div>

            <SelectAndTextInputContainer className="bond">
              <NativeSelect
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
              </NativeSelect>
              <Input placeholder="0.00" />
            </SelectAndTextInputContainer>

            <div className="mint-description">
              <p>and mint</p>
              <p>1 bLuna = 0.99 Luna</p>
            </div>

            <SelectAndTextInputContainer className="mint">
              <NativeSelect
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
              </NativeSelect>
              <Input placeholder="0.00" />
            </SelectAndTextInputContainer>

            <HorizontalRuler />

            <Selector
              className="validator"
              items={validatorItems}
              selectedItem={validator}
              onChange={(next) => setValidator(next)}
              labelFunction={(item) => item?.label ?? 'Select Validator'}
              keyFunction={(item) => item.value}
            />

            <ActionButton className="submit">Mint</ActionButton>
          </Section>
        </div>
      </main>
    </div>
  );
}

export const Mint = styled(MintBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};

  h1 {
    margin: 0 0 86px 40px;

    font-size: 34px;
    font-weight: 900;
    color: ${({ theme }) => theme.textColor};
  }
  
  .tab {
    margin-bottom: 40px;
  }
  
  .bond-description, .mint-description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    font-size: 16px;
    color: ${({theme}) => theme.dimTextColor};
    
    > :last-child {
      font-size: 12px;
    }
    
    margin-bottom: 12px;
  }
  
  .bond, .mint {
    margin-bottom: 30px;
  }
  
  hr {
    margin: 40px 0;
  }
  
  .validator {
    margin-bottom: 40px;
  }
  
  .submit {
    width: 100%;
    height: 60px;
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  padding-bottom: 100px;
  
  main {
    .content-layout {
      max-width: 720px;
      margin: 0 auto;
      border-radius: 30px;
    }
  }

  // pc
  @media (min-width: ${screen.pc.min}px) {
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    .NeuSection-root {
      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .NeuSection-root {
      .NeuSection-content {
        padding: 20px;
      }
    }
  }
`;
