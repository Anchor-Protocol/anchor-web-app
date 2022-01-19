import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import { AnchorApiContext } from 'contexts/api';
import { Observable } from 'rxjs';
import { pipe } from '@rx-stream/pipe';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';

const deposit = (): Observable<TxResultRendering> => {
  const observable = pipe<void, TxResultRendering>(() => {
    return {
      value: null,
      phase: TxStreamPhase.SUCCEED,
      receipts: [
        {
          name: 'Deposit Amount',
          value: '0 UST',
        },
      ],
    };
  });
  return observable();
};

const TerraAnchorApiProvider = ({ children }: UIElementProps) => {
  const api = useMemo(() => {
    return { deposit };
  }, []);
  return (
    <AnchorApiContext.Provider value={api}>
      {children}
    </AnchorApiContext.Provider>
  );
};

export { TerraAnchorApiProvider };
