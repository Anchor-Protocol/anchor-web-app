import { useLongtimeNoSee } from '@libs/use-longtime-no-see';
import React, { useCallback } from 'react';

export default {
  title: 'packages/use-longtime-no-see',
};

export const Basic = () => {
  const onSee = useCallback(() => {
    console.log('👋 Longtime no see!');
  }, []);

  useLongtimeNoSee({
    longtime: 1000 * 10,
    onSee,
  });

  return <div>See the Console!</div>;
};
