import { CreateTxOptions, Msg } from '@terra-money/terra.js';

export const createOptions = (
  override: () => Omit<CreateTxOptions, 'msgs'> = () => ({}),
) => (msgs: Msg[]): CreateTxOptions => {
  return {
    msgs,
    ...override(),
  };
};
