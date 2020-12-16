import { useState } from 'react';

export type PopupItemsMap = { [key: string]: () => boolean };

export const usePopupState = () => {
  return useState<boolean>();
};
