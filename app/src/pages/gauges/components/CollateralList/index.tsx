import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@libs/neumorphism-ui/components/Section';
import React from 'react';

export const CollateralList = () => {
  return (
    <Section>
      <HorizontalScrollTable minWidth={850}>
        <colgroup>
          <col style={{ width: 200 }} />
        </colgroup>
        <thead>
          <tr>
            <th>COLLATERAL LIST</th>
          </tr>
        </thead>
      </HorizontalScrollTable>
    </Section>
  );
};
