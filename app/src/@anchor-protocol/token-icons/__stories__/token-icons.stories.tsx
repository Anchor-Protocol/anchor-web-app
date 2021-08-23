import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { anc160gif, anc80gif, GifIcon, TokenIcon, tokens, variants } from '../';

export default {
  title: 'assets/Token Icons',
};

export const Token_Icons = () => {
  return (
    <div>
      <GifIcons>
        <GifIcon src={anc80gif} style={{ fontSize: 30 }} />
        <GifIcon src={anc160gif} style={{ fontSize: 60 }} />
      </GifIcons>

      {[50, 100, 200].map((size) => (
        <Grid key={'preview' + size} size={size}>
          {tokens.map((token) =>
            variants.map((variant) => (
              <Tooltip
                title={`<TokenIcon token="${token}" variant="${variant}"/>`}
                placement="right"
              >
                <div key={token + variant}>
                  <TokenIcon token={token} variant={variant} />
                </div>
              </Tooltip>
            )),
          )}
        </Grid>
      ))}
    </div>
  );
};

const GifIcons = styled.div`
  display: flex;
  align-items: center;

  > * {
    margin-right: 20px;
  }
`;

const Grid = styled(
  ({ children, className }: { children: ReactNode[]; className?: string }) => (
    <section className={className}>{children}</section>
  ),
)<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${variants.length}, ${({ size }) => size}px);
  grid-template-rows: repeat(${tokens.length}, ${({ size }) => size}px);

  div {
    display: grid;
    place-content: center;

    img {
      font-size: ${({ size }) => size - 10}px;
      width: 1em;
      height: 1em;
    }
  }
`;
