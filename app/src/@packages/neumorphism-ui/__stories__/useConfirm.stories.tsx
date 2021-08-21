import { ActionButton } from '@packages/neumorphism-ui/components/ActionButton';
import { useConfirm } from '@packages/neumorphism-ui/components/useConfirm';
import React, { useCallback, useState } from 'react';

export default {
  title: 'components/useConfirm',
};

export const Basic = () => {
  const [openConfirm, confirmElement] = useConfirm();
  const [result, setResult] = useState<string>('');

  const fn = useCallback(async () => {
    const userConfirm = await openConfirm({
      title: 'Title',
      description: 'Description',
    });

    setResult(`Result = ${userConfirm}`);
  }, [openConfirm]);

  return (
    <div>
      <ActionButton style={{ width: 200 }} onClick={() => fn()}>
        Open Confirm
      </ActionButton>
      <div>{result}</div>
      {confirmElement}
    </div>
  );
};
