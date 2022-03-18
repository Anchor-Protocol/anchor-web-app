import { useContext } from 'react';
import { BackgroundTxRequestContext } from './context';

export const useBackgroundTxRequest = () => {
  return useContext(BackgroundTxRequestContext);
};
