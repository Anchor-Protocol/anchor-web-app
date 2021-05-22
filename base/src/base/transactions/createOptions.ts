import { CreateTxOptions, Msg } from '@terra-money/terra.js';

// TODO remove after refactoring done
export const createOptions = (
  override: () => Required<Pick<CreateTxOptions, 'fee' | 'gasAdjustment'>> &
    Omit<CreateTxOptions, 'fee' | 'gasAdjustment' | 'msgs'>,
) => (msgs: Msg[]): CreateTxOptions => {
  const tx: CreateTxOptions = {
    msgs,
    ...override(),
  };

  return tx;
};
