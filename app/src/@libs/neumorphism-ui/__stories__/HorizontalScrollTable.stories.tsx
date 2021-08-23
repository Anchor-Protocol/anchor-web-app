import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import React from 'react';

export default {
  title: 'components/HorizontalScrollTable',
};

export const Basic = () => (
  <HorizontalScrollTable minWidth={800}>
    <colgroup>
      <col style={{ width: 300 }} />
      <col style={{ width: 300 }} />
      <col style={{ width: 300 }} />
      <col style={{ width: 300 }} />
    </colgroup>
    <thead>
      <tr>
        <th>A</th>
        <th>B</th>
        <th style={{ textAlign: 'right' }}>C</th>
        <th style={{ textAlign: 'right' }}>D</th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 5 }, (_, i) => (
        <tr key={`row-${i}`}>
          <td>{'A'.repeat(i * 3 + 1)}</td>
          <td>{'B'.repeat(i * 3 + 1)}</td>
          <td style={{ textAlign: 'right' }}>
            {'C'.repeat(i * 3 + 1)}
            <br />
            {'C'.repeat(i * 2 + 1)}
          </td>
          <td style={{ textAlign: 'right' }}>{'D'.repeat(i * 3 + 1)}</td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td>A</td>
        <td>B</td>
        <td style={{ textAlign: 'right' }}>C</td>
        <td style={{ textAlign: 'right' }}>D</td>
      </tr>
    </tfoot>
  </HorizontalScrollTable>
);
