import React from 'react';
import { DAY, HOUR, MINUTE, useTimeEnd, TimeEnd } from '../';

export default {
  title: 'packages/use-time-end',
};

export const Hook = () => {
  const p = useTimeEnd(new Date(Date.now() - DAY));
  const m30 = useTimeEnd(new Date(Date.now() + MINUTE * 30));
  const h2 = useTimeEnd(new Date(Date.now() + HOUR * 2));
  const d2 = useTimeEnd(new Date(Date.now() + DAY * 2));
  const d9 = useTimeEnd(new Date(Date.now() + DAY * 9));

  return (
    <ul>
      <li>{p}</li>
      <li>{m30}</li>
      <li>{h2}</li>
      <li>{d2}</li>
      <li>{d9}</li>
    </ul>
  );
};

export const Component = () => {
  return (
    <ul>
      <li>
        <TimeEnd endTime={new Date(Date.now() - DAY)} />
      </li>
      <li>
        <TimeEnd endTime={new Date(Date.now() + MINUTE * 30)} />
      </li>
      <li>
        <TimeEnd endTime={new Date(Date.now() + HOUR * 2)} />
      </li>
      <li>
        <TimeEnd endTime={new Date(Date.now() + DAY * 2)} />
      </li>
      <li>
        <TimeEnd endTime={new Date(Date.now() + DAY * 9)} />
      </li>
    </ul>
  );
};
