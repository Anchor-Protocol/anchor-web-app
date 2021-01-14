import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { useRestrictedNumberInput } from '@anchor-protocol/use-restricted-input';
import { TextFieldProps } from '@material-ui/core';

export type NumberInputProps = Omit<TextFieldProps, 'type'> & {
  type?: 'decimal' | 'integer';
  maxDecimalPoints?: number;
};

export function NumberInput({
  type = 'decimal',
  maxDecimalPoints,
  ...props
}: NumberInputProps) {
  const { onKeyPress } = useRestrictedNumberInput({ type, maxDecimalPoints });
  return <TextInput {...props} type="text" onKeyPress={onKeyPress} />;
}
