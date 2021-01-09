import React from 'react';

interface InputProps {
  textLeft?: string;
  textRight?: string;
  disabled?: boolean;
  value: number | string;
  onChange?: (nextValue: string) => void;
  validation?: (input: string) => boolean | string; // self-correcting if non-boolean is returned
}

const Input: React.FunctionComponent<InputProps> = ({
  textLeft,
  textRight,
  value,
  onChange = () => void 0,
  disabled = false,
}) => {
  return (
    <div>
      <aside>{textLeft}</aside>
      <input
        disabled={disabled}
        value={value}
        onChange={(ev) => onChange(ev.currentTarget.value)}
      />
      <aside>{textRight}</aside>
    </div>
  );
};

export default Input;
