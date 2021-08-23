import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { UST } from '@anchor-protocol/types';
import { AnimateNumber } from '@libs/ui';
import React, { useCallback, useState } from 'react';

export default {
  title: 'components/AnimateNumber',
};

export const Basic = () => {
  const [n, setN] = useState<UST>('1000' as UST);

  const updateNumber = useCallback(() => {
    setN(
      Math.floor(
        Math.random() * (Math.random() > 0.5 ? 100000000 : 100000),
      ).toString() as UST,
    );
  }, []);

  return (
    <div>
      <AnimateNumber format={formatUSTWithPostfixUnits}>{n}</AnimateNumber>
      <div>
        <button onClick={updateNumber}>Update Number</button>
      </div>
    </div>
  );
};
