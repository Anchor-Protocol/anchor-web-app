import {
  MultiColumnTable,
  MultiColumnTableCell,
} from '@libs/neumorphism-ui/components/MultiColumnTable';
import React from 'react';

export default {
  title: 'components/MultiColumnTable',
};

export const Basic = () => (
  <MultiColumnTable>
    {Array.from({ length: 9 }, (_, i) => (
      <MultiColumnTableCell key={i} label={`Label ${i}`}>
        Value {i}
      </MultiColumnTableCell>
    ))}
  </MultiColumnTable>
);
