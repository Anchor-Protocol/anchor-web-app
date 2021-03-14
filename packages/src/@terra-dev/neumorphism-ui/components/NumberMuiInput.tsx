import { InputProps } from '@material-ui/core';
import {
  RestrictedNumberInputParams,
  useRestrictedNumberInput,
} from '@terra-dev/use-restricted-input';
import { TextInput } from './TextInput';

export type NumberMuiInputProps = Omit<InputProps, 'type'> &
  RestrictedNumberInputParams;

export function NumberMuiInput({
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoinsts,
  onChange,
  ...props
}: NumberMuiInputProps) {
  const handlers = useRestrictedNumberInput({
    type,
    maxIntegerPoinsts,
    maxDecimalPoints,
    onChange,
  });
  return <TextInput {...props} type="text" {...handlers} />;
}
