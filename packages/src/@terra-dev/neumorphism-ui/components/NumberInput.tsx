import { TextFieldProps } from '@material-ui/core';
import {
  RestrictedNumberInputParams,
  useRestrictedNumberInput,
} from '@terra-dev/use-restricted-input';
import { TextInput } from './TextInput';

export type NumberInputProps = Omit<TextFieldProps, 'type'> &
  RestrictedNumberInputParams;

export function NumberInput({
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoints,
  onChange,
  inputMode = type === 'decimal' ? 'decimal' : 'numeric',
  pattern = '[0-9.]*',
  ...props
}: NumberInputProps) {
  const handlers = useRestrictedNumberInput({
    type,
    maxIntegerPoints,
    maxDecimalPoints,
    onChange,
  });
  return (
    <TextInput
      {...props}
      type="text"
      inputProps={{
        inputMode,
        pattern,
      }}
      {...handlers}
    />
  );
}
