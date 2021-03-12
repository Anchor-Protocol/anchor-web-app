import {
  RestrictedNumberInputParams,
  useRestrictedNumberInput,
} from '@terra-dev/use-restricted-input';
import { TextFieldProps } from '@material-ui/core';
import { TextInput } from './TextInput';

export type NumberInputProps = Omit<TextFieldProps, 'type'> &
  RestrictedNumberInputParams;

export function NumberInput({
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoinsts,
  ...props
}: NumberInputProps) {
  const handlers = useRestrictedNumberInput({
    type,
    maxIntegerPoinsts,
    maxDecimalPoints,
  });
  return <TextInput {...props} type="text" {...handlers} />;
}
