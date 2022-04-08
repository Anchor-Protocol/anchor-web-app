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

  return <span className={classNames(className, { pulse: animating })} />;
};

export const Led = styled(LedBase)`
  background: ${({ theme }) => theme.colors.positive};
  border-radius: 50%;
  height: 10px;
  width: 10px;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);

  &.pulse {
    animation: pulse 1.5s normal;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }
`;
