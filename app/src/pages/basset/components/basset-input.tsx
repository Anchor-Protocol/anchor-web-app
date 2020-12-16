import React from 'react';

// TODO: add validate
interface BassetInputProps {
  caption: string;
  askDenom: string;
  offerDenom: string;
  exchangeRate: number;
  amount: number;
  allowed: boolean;
  onChange?: (nextValue: number) => void | boolean;
}

const BassetInput: React.FunctionComponent<BassetInputProps> = ({
  caption,
  askDenom,
  offerDenom,
  exchangeRate,
  amount,
  allowed,
  onChange = () => false,
}) => {
  return (
    <>
      <header>{caption}</header>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(ev) => onChange(Number.parseFloat(ev.currentTarget.value))}
          disabled={!allowed}
        />
        <aside>{offerDenom}</aside>
      </div>
      <footer>
        {1} {offerDenom} = {1 * exchangeRate} {askDenom}
      </footer>
    </>
  );
};

export default BassetInput;
