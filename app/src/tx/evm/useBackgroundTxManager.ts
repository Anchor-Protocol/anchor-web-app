import { useContext } from 'react';
import { BackgroundTxContext } from './background/BackgroundTxProvider';

export const useBackgroundTxManager = () => {
  const { backgroundTxManager } = useContext(BackgroundTxContext);

  return backgroundTxManager;
};
