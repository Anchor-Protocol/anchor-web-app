import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UIElementProps } from 'components/layouts/UIElementProps';
import classNames from 'classnames';

export interface LedProps extends UIElementProps {
  blockNumber: number;
}

const LedBase = (props: LedProps) => {
  const { className, blockNumber } = props;

  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);

    const timeout = setTimeout(() => setAnimating(false), 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [blockNumber]);

  return (
    <div className={className}>
      <div className={classNames('pulse', { animate: animating })} />
      <div className="inner" />
    </div>
  );
};

export const Led = styled(LedBase)`
  position: relative;
  height: 10px;
  width: 10px;

  .inner {
    position: absolute;
    background: ${({ theme }) => theme.colors.positive};
    border-radius: 50%;
    height: 100%;
    width: 100%;
  }

  .pulse {
    position: absolute;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.positive};
    height: 100%;
    width: 100%;

    &.animate {
      animation: pulse 1.5s normal;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    70% {
      transform: scale(2.5);
      opacity: 0;
    }

    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;
