import { UIElementProps } from '@libs/ui';
import React, { DOMAttributes } from 'react';
import styled from 'styled-components';
import { ChevronRight } from '@material-ui/icons';
import { Card } from './Card';
import classNames from 'classnames';

interface ButtonCardProps
  extends UIElementProps,
    Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> {}

function ButtonCardBase(props: ButtonCardProps) {
  const { className, children, onClick } = props;

  return (
    <Card
      className={classNames(className, { enabled: Boolean(onClick) })}
      sectionContentProps={{
        margin: 'small',
      }}
      onClick={onClick}
    >
      <div className="children">{children}</div>
      {onClick && <ChevronRight className="chevron" />}
    </Card>
  );
}

export const ButtonCard = styled(ButtonCardBase)`
  cursor: pointer;
  display: flex;
  align-items: center;

  &.enabled {
    &:hover {
      background-color: ${({ theme }) => theme.hoverBackgroundColor};
    }
  }

  .NeuSectionContent {
    display: flex;
    align-items: center;
  }

  .children {
    flex-grow: 1;
  }

  .chevron {
    margin-right: -20px;
  }
`;
