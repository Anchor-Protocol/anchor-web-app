import React from 'react';
import styled, { keyframes } from 'styled-components';
import classNames from 'classnames';
import { lighten } from '@material-ui/core';

type TransactionProgressProps = {
  className?: string;
  stepCount: number;
  currStep: number;
};

const TransactionProgressBase = ({
  className,
  stepCount,
  currStep,
}: TransactionProgressProps) => {
  return (
    <div className={className}>
      {Array.from({ length: stepCount }).map((_, idx) => (
        <span
          key={idx}
          className={classNames(
            'step',
            idx < currStep && 'past',
            idx === currStep && 'current',
          )}
        />
      ))}
    </div>
  );
};

const progressAnimation = (color: string) => keyframes`
  0%    {background: rgba(0,0,0,0.1);}
  10%   {background: ${lighten(color, 0.7)};}
  20%   {background: ${lighten(color, 0.5)};}
  30%   {background: ${lighten(color, 0.3)};}
  40%   {background: ${lighten(color, 0.1)};}
  50%   {background: ${color};}
  60%   {background: ${lighten(color, 0.1)};}
  70%   {background: ${lighten(color, 0.3)};}
  80%   {background: ${lighten(color, 0.5)};}
  90%   {background: ${lighten(color, 0.7)};}
  100%  {background: rgba(0,0,0,0.1);}
`;

export const TransactionProgress = styled(TransactionProgressBase)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 100%;

  .step {
    &:last-child {
      margin-right: 0;
    }

    &:first-child {
      margin-left: 0;
    }

    margin: 0 1px;
    width: 100%;
    height: 5px;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .current {
    animation: ${({ theme }) => progressAnimation(theme.colors.secondary)} 1.5s
      infinite;
  }

  .past {
    opacity: 1;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;
