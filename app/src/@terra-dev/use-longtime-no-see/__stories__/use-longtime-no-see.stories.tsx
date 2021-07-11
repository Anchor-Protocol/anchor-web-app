import { useLongtimeNoSee } from '@terra-dev/use-longtime-no-see';
import { useCallback } from 'react';

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
