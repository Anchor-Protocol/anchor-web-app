import { useResolveLast } from '@libs/use-resolve-last/index';
import React from 'react';

export default {
  title: 'packages/use-resolve-last',
};

const someFetch = (value: string) =>
  new Promise<number>((resolve) =>
    setTimeout(() => {
      console.log('fetch result is', value);
      resolve(parseInt(value));
    }, Math.random() * 3000),
  );

export const Basic = () => {
  const [resolve, result] = useResolveLast<number>(() => 0);

  return (
    <div>
      <input
        type="number"
        defaultValue={0}
        onChange={({ target }) => resolve(someFetch(target.value))}
      />
      <p>the latest resolve value is "{result}"</p>
    </div>
  );
};
