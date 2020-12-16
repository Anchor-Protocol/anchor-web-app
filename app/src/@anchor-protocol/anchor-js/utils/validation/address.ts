import { InputEntry } from '../validate-input';

export const validateAddress = (address: string): InputEntry => [
  () => true, // TODO: bech32 me
  `invalid address ${address}.`,
];

export const validateValAddress = (valAddress: string): InputEntry => [
  () => true, // TODO: bech32 me,
  `invalid validator address ${valAddress}.`,
];
