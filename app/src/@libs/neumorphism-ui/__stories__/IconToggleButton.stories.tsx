import { IconToggleButton } from '@libs/neumorphism-ui/components/IconToggleButton';
import { Menu, MenuClose } from '@anchor-protocol/icons';
import React, { useState } from 'react';

export default {
  title: 'components/IconToggleButton',
};

export const Basic = () => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <IconToggleButton
      on={open}
      onChange={setOpen}
      onIcon={Menu}
      offIcon={MenuClose}
      style={{ fontSize: 20, color: 'white' }}
    />
  );
};
