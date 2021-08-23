import { MenuItemProps, MenuList, Popover } from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
  ChevronRightRounded,
} from '@material-ui/icons';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import React, {
  MouseEvent,
  ReactElement,
  useState,
  Children,
  cloneElement,
} from 'react';
import styled from 'styled-components';

export interface MoreMenuProps {
  className?: string;
  children: ReactElement<MenuItemProps> | ReactElement<MenuItemProps>[];
}

function MoreMenuBase({ children, className }: MoreMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <MoreButton
        onClick={(event: MouseEvent<HTMLButtonElement>) =>
          setAnchorEl(event.currentTarget)
        }
      >
        More {anchorEl ? <ExpandLess /> : <ExpandMore />}
      </MoreButton>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        className={className}
      >
        <MenuList variant="menu">
          {Children.map(children, (child) => {
            return cloneElement(child, {
              children: (
                <IconSpan>
                  {child.props.children} <ChevronRightRounded />
                </IconSpan>
              ),
            });
          })}
        </MenuList>
      </Popover>
    </>
  );
}

const MoreButton = styled(BorderButton)`
  font-size: 12px;
  width: 120px;
  height: 32px;

  svg {
    font-size: 1em;
    transform: scale(1.6) translate(3px, 0.5px);
  }
`;

export const MoreMenu = styled(MoreMenuBase)`
  transform: translateY(8px);

  .MuiPaper-root {
    border-radius: 16px;
  }

  .MuiList-root {
    min-width: 165px;
    padding: 10px 0;

    .MuiListItem-root {
      > :first-child {
        width: 100%;
        display: flex;
        justify-content: space-between;

        svg {
          color: ${({ theme }) => theme.dimTextColor};
          transform: scale(1.2) translateY(2px);
        }

        &:hover {
          svg {
            color: ${({ theme }) => theme.textColor};
          }
        }
      }
    }
  }
`;
