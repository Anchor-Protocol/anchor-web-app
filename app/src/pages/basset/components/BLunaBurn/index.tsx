import { bLuna, Luna } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
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
    <div className={className}>
      {mode === 'swap' ? (
        <Swap
          burnAmount={burnAmount}
          getAmount={getAmount}
          setBurnAmount={setBurnAmount}
          setGetAmount={setGetAmount}
          connectedWallet={connectedWallet}
          fixedFee={fixedFee}
          mode={mode}
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
          mode={mode}
          setMode={setMode}
        />
      )}
    </div>
  );
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const BLunaBurn = fixHMR(StyledComponent);
