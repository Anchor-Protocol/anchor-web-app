# `@libs/use-restricted-input`

Restrict text input

<https://anchor-storybook.vercel.app/?path=/story/core-use-restricted-input--basic>

## API

<!-- source index.ts --pick "RestrictedInputReturn useRestrictedInput RestrictedNumberInputParams useRestrictedNumberInput" -->

[index.ts](index.ts)

```ts
/**
 * @param availableCharacters 'abc', 'a-z', 'a-z0-9'
 */
export function useRestrictedInput(
  availableCharacters: ((character: string) => boolean) | string,
): RestrictedInputReturn {}

export function useRestrictedNumberInput({
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoinsts,
  onChange: _onChange,
}: RestrictedNumberInputParams): RestrictedInputReturn {}

export interface RestrictedInputReturn {
  onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface RestrictedNumberInputParams {
  type?: 'decimal' | 'integer';
  maxDecimalPoints?: number;
  maxIntegerPoinsts?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
```

<!-- /source -->
