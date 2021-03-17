import {
  BorderIconButton,
  BorderIconButtonProps,
} from '@terra-dev/neumorphism-ui/components/BorderIconButton';
import { MenuItemProps, MenuList, Popover } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { ReactElement, useState } from 'react';
import styled from 'styled-components';

export interface MoreMenuProps {
  className?: string;
  children: ReactElement<MenuItemProps> | ReactElement<MenuItemProps>[];
  size: BorderIconButtonProps['size'];
}

function MoreMenuBase({ size, children, className }: MoreMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <BorderIconButton
        size={size}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreHoriz />
      </BorderIconButton>

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
      >
        <MenuList variant="menu" className={className}>
          {children}
        </MenuList>
      </Popover>
    </>
  );
}

export const MoreMenu = styled(MoreMenuBase)`
  // TODO
`;
