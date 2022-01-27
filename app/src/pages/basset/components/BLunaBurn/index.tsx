import { bLuna, Luna } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { fixHMR } from 'fix-hmr';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Burn } from './Burn';
import { Swap } from './Swap';

export interface BLunaBurnProps {
  className?: string;
}

function Component({ className }: BLunaBurnProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [burnAmount, setBurnAmount] = useState<bLuna>('' as bLuna);
  const [getAmount, setGetAmount] = useState<Luna>('' as Luna);

  const [mode, setMode] = useState<'burn' | 'swap'>('burn');

  return (
    <Section className={className}>
      {mode === 'swap' ? (
        <Swap
          burnAmount={burnAmount}
          getAmount={getAmount}
          setBurnAmount={setBurnAmount}
          setGetAmount={setGetAmount}
          connectedWallet={connectedWallet}
          fixedFee={fixedFee}
          setMode={setMode}
        />
      ) : (
        <Burn
          burnAmount={burnAmount}
          getAmount={getAmount}
          setBurnAmount={setBurnAmount}
          setGetAmount={setGetAmount}
          connectedWallet={connectedWallet}
          fixedFee={fixedFee}
          setMode={setMode}
        />
      )}
    </Section>
  );
}

const StyledComponent = styled(Component)`
  .burn-description,
  .gett-description {
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

  .burn,
  .gett {
    margin-bottom: 30px;
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

  .guide {
    h4 {
      svg {
        font-size: 1em;
        transform: translateY(2px);
      }

      font-size: 13px;
      font-weight: 500;
    }

    ul {
      margin-top: 10px;

      font-size: 12px;
      padding-left: 15px;
      line-height: 19px;
    }
  }

  .slippage {
    margin-bottom: 40px;
  }

  .receipt {
    margin-bottom: 40px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }
`;

export const BLunaBurn = fixHMR(StyledComponent);
