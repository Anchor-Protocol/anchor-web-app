import React from 'react';
import { toAmount } from '../libs/amount';

interface AmountProps {
  amount: number;
  denom: string;
}

const Amount: React.FunctionComponent<AmountProps> = ({ amount, denom }) => {
  const amt = toAmount(amount);

  return (
    <span>
      <span>{amt[0]}</span>
      <span>{amt[1]}</span>
      <span>{denom}</span>
    </span>
  );
};

export default Amount;
