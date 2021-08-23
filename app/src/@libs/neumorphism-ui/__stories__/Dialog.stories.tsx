import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { MessageColor, messageColors } from '@libs/neumorphism-ui/themes/Theme';
import { Modal } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { Icons } from '@storybook/components';
import React from 'react';

export default {
  title: 'components/Dialog',
  argTypes: {
    color: {
      control: {
        type: 'radio',
        options: [...messageColors],
      },
    },
    close: {
      control: {
        type: 'boolean',
      },
    },
    width: {
      control: {
        type: 'range',
        min: 200,
        max: 1500,
      },
    },
    height: {
      control: {
        type: 'range',
        min: 200,
        max: 1000,
      },
    },
  },
};

interface StoryProps {
  color: MessageColor;
  close: boolean;
  width: number;
  height: number;
}

export const Basic = ({ color, close, width, height }: StoryProps) => (
  <Modal open>
    <Dialog
      color={color}
      onClose={close ? () => {} : undefined}
      style={{ width, height }}
    >
      <h1 style={{ textAlign: 'center', fontWeight: 300 }}>Title</h1>
      <p>
        This dialog deal with the responsive design. please find{' '}
        <Icons icon="grow" style={{ display: 'inline', width: '1em' }} /> icon
        from the upper toolbar. you can change device view.
      </p>
    </Dialog>
  </Modal>
);

Basic.args = {
  color: 'normal',
  close: true,
  width: 600,
  height: 400,
};

export const With_Button = ({ color, close, width, height }: StoryProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <ActionButton onClick={() => setOpen(true)} style={{ width: 300 }}>
        OPEN DIALOG
      </ActionButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Dialog
          color={color}
          onClose={close ? () => setOpen(false) : undefined}
          style={{ width, height }}
        >
          <h1 style={{ textAlign: 'center', fontWeight: 300 }}>Title</h1>
          <p>
            You can close this dialog with the <code>ESC</code> key and the
            backdrop click.
          </p>
        </Dialog>
      </Modal>
    </>
  );
};

With_Button.args = {
  color: 'normal',
  close: true,
  width: 600,
  height: 400,
};

export const Prevent_Close = ({ color, width, height }: StoryProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const openDialog = useCallback(() => {
    setOpen(true);

    setTimeout(() => {
      setOpen(false);
    }, 5000);
  }, []);

  return (
    <>
      <ActionButton onClick={() => openDialog()} style={{ width: 300 }}>
        OPEN DIALOG
      </ActionButton>
      <Modal open={open} disableBackdropClick>
        <Dialog color={color} style={{ width, height }}>
          <h1 style={{ textAlign: 'center', fontWeight: 300 }}>Title</h1>
          <p>
            You can't close this dialog yourself. this dialog will close after 5
            seconds.
          </p>
        </Dialog>
      </Modal>
    </>
  );
};

Prevent_Close.args = {
  color: 'normal',
  close: false,
  width: 600,
  height: 400,
};
