import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import {
  RestrictedNumberInputParams,
  useRestrictedNumberInput,
} from '@anchor-protocol/use-restricted-input';
import { TextFieldProps } from '@material-ui/core';

export type NumberInputProps = Omit<TextFieldProps, 'type'> &
  RestrictedNumberInputParams;

export function NumberInput({
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoinsts,
  ...props
}: NumberInputProps) {
  const { onKeyPress } = useRestrictedNumberInput({
    type,
    maxIntegerPoinsts,
    maxDecimalPoints,
  });
  return <TextInput {...props} type="text" onKeyPress={onKeyPress} />;
}
