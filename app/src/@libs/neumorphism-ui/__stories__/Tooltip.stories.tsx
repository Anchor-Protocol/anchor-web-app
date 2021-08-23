import { TextButton } from '@libs/neumorphism-ui/components/TextButton';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { messageColors } from '@libs/neumorphism-ui/themes/Theme';
import React from 'react';
import styled from 'styled-components';

export default {
  title: 'components/Tooltip',
};

const placements = [
  'bottom-end',
  'bottom-start',
  'bottom',
  'left-end',
  'left-start',
  'left',
  'right-end',
  'right-start',
  'right',
  'top-end',
  'top-start',
  'top',
] as const;

export const Placements = () => (
  <Layout style={{ gridTemplateColumns: 'repeat(3, 150px)' }}>
    {placements.map((placement) => (
      <Tooltip
        key={placement}
        title={placement}
        color="success"
        placement={placement}
      >
        <TextButton>
          {placement.toUpperCase()}
          <br />
          TOOLTIP
        </TextButton>
      </Tooltip>
    ))}
  </Layout>
);

export const Colors = () => (
  <Layout>
    {messageColors.map((color) => (
      <Tooltip key={color} title={color} color={color} placement="top">
        <TextButton>{color.toUpperCase()} TOOLTIP</TextButton>
      </Tooltip>
    ))}
  </Layout>
);

const Layout = styled.section`
  margin-top: 100px;

  display: grid;
  grid-template-columns: repeat(4, 150px);
  grid-gap: 20px;
  justify-content: center;
`;
